import { describe, expect, it } from 'vitest';
import { createAdapterExport, createCsvExport, projectFilename, restoreProject } from '../src/exporters';
import { frameRange, frameToTimecode, newProject, validatePortableProject } from '../src/model';
import type { Project } from '../src/types';

function fixture(): Project {
  return {
    ...newProject(),
    name: 'Forest Gate / intro',
    fps: 24,
    durationFrames: 240,
    events: [
      { id: 'm1', type: 'marker', kind: 'interaction', label: 'Accept jump input', startFrame: 48, endFrame: 61, notes: 'Buffer through landing.' },
      { id: 's1', type: 'shot', label: 'Gate opens', startFrame: 0, endFrame: 72, notes: '' },
    ],
  };
}

describe('timing helpers', () => {
  it('formats non-drop-frame timecode and ranges', () => {
    expect(frameToTimecode(1500, 24)).toBe('00:01:02:12');
    expect(frameRange(fixture().events[0]!)).toBe('F48–60');
  });
});

describe('portable adapters', () => {
  it('sorts events and expresses exclusive ranges with a stable version', () => {
    const adapter = createAdapterExport(fixture());
    expect(adapter.adapter_version).toBe(1);
    expect(adapter.events.map((event) => event.id)).toEqual(['s1', 'm1']);
    expect(adapter.events[1]?.duration_seconds).toBe(0.542);
  });

  it('escapes CSV cells and names files safely', () => {
    const project = fixture();
    project.events[0]!.notes = 'Ask, then "hold"';
    const csv = createCsvExport(project);
    expect(csv).toContain('"Ask, then ""hold"""');
    expect(projectFilename(project.name)).toBe('forest-gate-intro');
  });

  it('round-trips a valid project without media', () => {
    const value = JSON.parse(JSON.stringify(fixture()));
    expect(restoreProject(value)).toMatchObject({ schema: 'aes-project-1', name: 'Forest Gate / intro' });
    expect(validatePortableProject(value).events).toHaveLength(2);
  });

  it('rejects invalid imported frame ranges', () => {
    const value = JSON.parse(JSON.stringify(fixture()));
    value.events[0].endFrame = 500;
    expect(() => validatePortableProject(value)).toThrow(/outside the project/);
  });
});
