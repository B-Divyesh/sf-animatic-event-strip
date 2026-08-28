import type { MarkerKind, PortableEvent, PortableProject, Project, StripEvent } from './types';

export const FPS_OPTIONS = [12, 15, 24, 25, 30, 60] as const;
export const MARKER_KINDS: MarkerKind[] = ['beat', 'sound', 'interaction', 'note'];

export function uid(prefix = 'evt'): string {
  return `${prefix}_${crypto.randomUUID()}`;
}

export function newProject(): Project {
  const now = new Date().toISOString();
  return {
    schema: 'aes-project-1',
    id: uid('project'),
    name: 'Untitled scene',
    fps: 24,
    durationFrames: 240,
    createdAt: now,
    updatedAt: now,
    events: [],
  };
}

export function clampFrame(frame: number, duration: number): number {
  return Math.min(Math.max(0, Math.round(frame)), Math.max(0, duration - 1));
}

export function frameRange(event: StripEvent): string {
  if (event.endFrame <= event.startFrame + 1) return `F${event.startFrame}`;
  return `F${event.startFrame}–${event.endFrame - 1}`;
}

export function frameToTimecode(frame: number, fps: number): string {
  const safeFrame = Math.max(0, Math.floor(frame));
  const frames = safeFrame % fps;
  const totalSeconds = Math.floor(safeFrame / fps);
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60) % 60;
  const hours = Math.floor(totalSeconds / 3600);
  return [hours, minutes, seconds, frames].map((part) => String(part).padStart(2, '0')).join(':');
}

export function secondsForFrames(frames: number, fps: number): number {
  return Math.round((frames / fps) * 1000) / 1000;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function integer(value: unknown, label: string): number {
  if (typeof value !== 'number' || !Number.isInteger(value)) throw new Error(`${label} must be a whole number.`);
  return value;
}

export function validatePortableProject(value: unknown): PortableProject {
  if (!isRecord(value) || value.schema !== 'aes-project-1') throw new Error('This is not an Animatic Event Strip project (AES project 1).');
  if (typeof value.id !== 'string' || typeof value.name !== 'string' || !value.name.trim()) throw new Error('The project name is missing.');
  const fps = integer(value.fps, 'Frames per second');
  const durationFrames = integer(value.durationFrames, 'Duration');
  if (!FPS_OPTIONS.includes(fps as (typeof FPS_OPTIONS)[number])) throw new Error('Frames per second must be 12, 15, 24, 25, 30, or 60.');
  if (durationFrames < 12 || durationFrames > 216000) throw new Error('Project duration is outside the supported range.');
  if (!Array.isArray(value.events)) throw new Error('The project event list is missing.');

  const events = value.events.map((raw, index) => {
    if (!isRecord(raw)) throw new Error(`Event ${index + 1} is malformed.`);
    if (!['shot', 'audio', 'marker'].includes(String(raw.type))) throw new Error(`Event ${index + 1} has an unknown type.`);
    if (typeof raw.id !== 'string' || typeof raw.label !== 'string' || !raw.label.trim()) throw new Error(`Event ${index + 1} needs an id and label.`);
    const startFrame = integer(raw.startFrame, `Event ${index + 1} start frame`);
    const endFrame = integer(raw.endFrame, `Event ${index + 1} end frame`);
    if (startFrame < 0 || endFrame <= startFrame || endFrame > durationFrames) throw new Error(`Event ${index + 1} has a frame range outside the project.`);
    if (typeof raw.notes !== 'string') throw new Error(`Event ${index + 1} notes are malformed.`);
    if (raw.type === 'marker' && !MARKER_KINDS.includes(raw.kind as MarkerKind)) throw new Error(`Event ${index + 1} has an unknown marker kind.`);
    if (raw.media !== undefined) {
      if (!isRecord(raw.media) || typeof raw.media.name !== 'string' || typeof raw.media.type !== 'string' || typeof raw.media.data !== 'string' || !raw.media.data.startsWith('data:')) {
        throw new Error(`Event ${index + 1} contains invalid media.`);
      }
    }
    return raw as unknown as PortableEvent;
  });

  return {
    schema: 'aes-project-1',
    id: value.id,
    name: value.name.trim().slice(0, 80),
    fps,
    durationFrames,
    createdAt: typeof value.createdAt === 'string' ? value.createdAt : new Date().toISOString(),
    updatedAt: typeof value.updatedAt === 'string' ? value.updatedAt : new Date().toISOString(),
    events,
  };
}

export function sortEvents(events: StripEvent[]): StripEvent[] {
  const order = { shot: 0, audio: 1, marker: 2 };
  return [...events].sort((a, b) => a.startFrame - b.startFrame || order[a.type] - order[b.type] || a.label.localeCompare(b.label));
}
