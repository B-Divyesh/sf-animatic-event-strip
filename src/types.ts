export type MarkerKind = 'beat' | 'sound' | 'interaction' | 'note';

export interface LocalMedia {
  name: string;
  type: string;
  blob: Blob;
}

export interface BaseEvent {
  id: string;
  label: string;
  startFrame: number;
  endFrame: number;
  notes: string;
}

export interface ShotEvent extends BaseEvent {
  type: 'shot';
  media?: LocalMedia;
}

export interface AudioEvent extends BaseEvent {
  type: 'audio';
  media?: LocalMedia;
  waveform: number[];
}

export interface MarkerEvent extends BaseEvent {
  type: 'marker';
  kind: MarkerKind;
}

export type StripEvent = ShotEvent | AudioEvent | MarkerEvent;

export interface Project {
  schema: 'aes-project-1';
  id: string;
  name: string;
  fps: number;
  durationFrames: number;
  createdAt: string;
  updatedAt: string;
  events: StripEvent[];
}

export interface PortableMedia {
  name: string;
  type: string;
  data: string;
}

export interface PortableEvent extends Omit<BaseEvent, 'id'> {
  id: string;
  type: StripEvent['type'];
  kind?: MarkerKind;
  waveform?: number[];
  media?: PortableMedia;
}

export interface PortableProject extends Omit<Project, 'events'> {
  events: PortableEvent[];
}
