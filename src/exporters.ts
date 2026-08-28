import { secondsForFrames, sortEvents, validatePortableProject } from './model';
import type { LocalMedia, PortableEvent, PortableProject, Project, StripEvent } from './types';

function mediaToData(media: LocalMedia): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error ?? new Error(`Could not read ${media.name}.`));
    reader.readAsDataURL(media.blob);
  });
}

function dataToMedia(media: { name: string; type: string; data: string }): LocalMedia {
  const [header, encoded] = media.data.split(',', 2);
  if (!header || encoded === undefined) throw new Error(`Could not decode ${media.name}.`);
  const binary = atob(encoded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return { name: media.name, type: media.type, blob: new Blob([bytes], { type: media.type }) };
}

export async function createProjectExport(project: Project): Promise<PortableProject> {
  const events: PortableEvent[] = await Promise.all(sortEvents(project.events).map(async (event) => {
    const portable: PortableEvent = {
      id: event.id,
      type: event.type,
      label: event.label,
      startFrame: event.startFrame,
      endFrame: event.endFrame,
      notes: event.notes,
    };
    if (event.type === 'marker') portable.kind = event.kind;
    if (event.type === 'audio') portable.waveform = event.waveform;
    if ('media' in event && event.media) portable.media = { name: event.media.name, type: event.media.type, data: await mediaToData(event.media) };
    return portable;
  }));
  return { ...project, events };
}

export function restoreProject(value: unknown): Project {
  const portable = validatePortableProject(value);
  const events = portable.events.map((event): StripEvent => {
    const base = { id: event.id, label: event.label, startFrame: event.startFrame, endFrame: event.endFrame, notes: event.notes };
    const media = event.media ? dataToMedia(event.media) : undefined;
    if (event.type === 'shot') return { ...base, type: 'shot', ...(media ? { media } : {}) };
    if (event.type === 'audio') return { ...base, type: 'audio', waveform: event.waveform ?? [], ...(media ? { media } : {}) };
    return { ...base, type: 'marker', kind: event.kind ?? 'note' };
  });
  return { ...portable, events };
}

export function createAdapterExport(project: Project) {
  return {
    schema: 'animatic-event-strip/adapter',
    adapter_version: 1,
    project: { id: project.id, name: project.name, fps: project.fps, duration_frames: project.durationFrames, duration_seconds: secondsForFrames(project.durationFrames, project.fps) },
    events: sortEvents(project.events).map((event) => ({
      id: event.id,
      type: event.type,
      kind: event.type === 'marker' ? event.kind : undefined,
      name: event.label,
      start_frame: event.startFrame,
      end_frame_exclusive: event.endFrame,
      start_seconds: secondsForFrames(event.startFrame, project.fps),
      duration_seconds: secondsForFrames(event.endFrame - event.startFrame, project.fps),
      notes: event.notes,
      media_filename: event.type !== 'marker' ? event.media?.name ?? null : null,
    })),
  };
}

function csvCell(value: string | number): string {
  const text = String(value).replace(/\r?\n/g, ' ');
  return /[",]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function createCsvExport(project: Project): string {
  const rows: Array<Array<string | number>> = [['schema', 'adapter_version', 'project', 'event_id', 'type', 'kind', 'name', 'start_frame', 'end_frame_exclusive', 'start_seconds', 'duration_seconds', 'notes', 'media_filename']];
  for (const event of sortEvents(project.events)) {
    rows.push(['animatic-event-strip/adapter', 1, project.name, event.id, event.type, event.type === 'marker' ? event.kind : '', event.label, event.startFrame, event.endFrame, secondsForFrames(event.startFrame, project.fps), secondsForFrames(event.endFrame - event.startFrame, project.fps), event.notes, event.type !== 'marker' ? event.media?.name ?? '' : '']);
  }
  return `\ufeff${rows.map((row) => row.map(csvCell).join(',')).join('\r\n')}\r\n`;
}

export function projectFilename(name: string): string {
  const safe = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48);
  return safe || 'animatic-strip';
}

export function godotAdapterSource(): string {
  return `# Animatic Event Strip adapter v1 — Godot 4.x\nclass_name AnimaticEventStrip\n\nstatic func load_events(json_text: String) -> Array:\n\tvar data = JSON.parse_string(json_text)\n\tif typeof(data) != TYPE_DICTIONARY or data.get("adapter_version") != 1:\n\t\tpush_error("Unsupported Animatic Event Strip adapter schema")\n\t\treturn []\n\treturn data.get("events", [])\n\nstatic func events_at_frame(events: Array, frame: int) -> Array:\n\treturn events.filter(func(event): return event.start_frame == frame)\n`;
}

export function unityAdapterSource(): string {
  return `// Animatic Event Strip adapter v1 — Unity 6\nusing System;\nusing UnityEngine;\n\n[Serializable] public class AnimaticProject { public int adapter_version; public AnimaticEvent[] events; }\n[Serializable] public class AnimaticEvent { public string id, type, kind, name, notes, media_filename; public int start_frame, end_frame_exclusive; public float start_seconds, duration_seconds; }\n\npublic static class AnimaticEventStrip {\n    public static AnimaticProject Load(TextAsset json) {\n        var strip = JsonUtility.FromJson<AnimaticProject>(json.text);\n        if (strip == null || strip.adapter_version != 1) throw new Exception("Unsupported Animatic Event Strip adapter schema");\n        return strip;\n    }\n}\n`;
}
