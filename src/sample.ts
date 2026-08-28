import type { Project } from './types';

export function sampleProject(): Project {
  const timestamp = new Date().toISOString();
  return {
    schema: 'aes-project-1',
    id: 'demo-rain-gate',
    name: 'Rain Gate — opening beat',
    fps: 24,
    durationFrames: 240,
    createdAt: timestamp,
    updatedAt: timestamp,
    events: [
      { id: 'demo-board-wide', type: 'shot', label: 'Hold on the closed gate', startFrame: 0, endFrame: 48, notes: 'Keep the player outside the trigger volume.' },
      { id: 'demo-sound-chain', type: 'audio', label: 'Chain pull and rain', startFrame: 24, endFrame: 96, notes: 'Let the chain transient lead the visual by two frames.', waveform: [.18, .25, .34, .82, .63, .42, .3, .55, .44, .26, .2, .16] },
      { id: 'demo-beat-reveal', type: 'marker', kind: 'beat', label: 'Reveal the path', startFrame: 46, endFrame: 47, notes: 'The opening silhouette must read before the camera moves.' },
      { id: 'demo-board-path', type: 'shot', label: 'Track through the doorway', startFrame: 48, endFrame: 144, notes: 'Ease the camera only after the gate clears the frame.' },
      { id: 'demo-input-enable', type: 'marker', kind: 'interaction', label: 'Enable player input', startFrame: 108, endFrame: 145, notes: 'Accept movement; keep pause and menu input active throughout.' },
      { id: 'demo-note-rain', type: 'marker', kind: 'note', label: 'Loop rain under dialogue', startFrame: 144, endFrame: 145, notes: 'Hand off the ambience loop without a gap.' },
    ],
  };
}
