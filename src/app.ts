import './style.css';
import { createAdapterExport, createCsvExport, createProjectExport, godotAdapterSource, projectFilename, restoreProject, unityAdapterSource } from './exporters';
import { clampFrame, frameRange, frameToTimecode, newProject, sortEvents, uid } from './model';
import { sampleProject } from './sample';
import { clearProject, loadProject, saveProject, type StorageSpace } from './storage';
import type { LocalMedia, MarkerKind, StripEvent } from './types';

const SLUG = 'animatic-event-strip';
const LICENSE_KEY = `sb_license:${SLUG}`;
const LICENSE_CACHE_KEY = `${LICENSE_KEY}:verdict`;
const VERIFY_URL = `https://api.sociobot.in/api/v1/products/${SLUG}/verify`;
const params = new URLSearchParams(location.search);
const demoMode = location.pathname.replace(/\/$/, '') === '/demo' || params.get('demo') === '1';
const explicitRealStart = !demoMode && (params.get('start') === '1' || params.get('source') === 'pwa');
const storageSpace: StorageSpace = demoMode ? 'demo' : 'project';

function element<T extends HTMLElement>(id: string): T {
  const found = document.getElementById(id);
  if (!found) throw new Error(`Missing #${id}`);
  return found as T;
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character] ?? character);
}

let project = newProject();
let currentFrame = 0;
let selectedId: string | null = null;
let pendingImage: File | undefined;
let pendingAudio: File | undefined;
let playing = false;
let playStartedAt = 0;
let playStartedFrame = 0;
let animationFrame = 0;
let licensed = false;
let projectStorageReady = false;
let projectStorageLoading: Promise<boolean> | undefined;
let storageFailed = false;
const mediaUrls = new WeakMap<Blob, string>();
const activeAudio = new Set<HTMLAudioElement>();

const projectName = element<HTMLSpanElement>('project-name');
const durationLabel = element<HTMLSpanElement>('duration-label');
const fpsLabel = element<HTMLSpanElement>('fps-label');
const timecode = element<HTMLOutputElement>('timecode');
const stage = element<HTMLDivElement>('timeline-stage');
const viewport = element<HTMLDivElement>('timeline-viewport');
const ruler = element<HTMLDivElement>('ruler');
const boardsLane = element<HTMLDivElement>('boards-lane');
const audioLane = element<HTMLDivElement>('audio-lane');
const markersLane = element<HTMLDivElement>('markers-lane');
const playhead = element<HTMLDivElement>('playhead');
const emptyState = element<HTMLDivElement>('empty-state');
const saveStatus = element<HTMLSpanElement>('save-status');
const workspaceError = element<HTMLDivElement>('workspace-error');
const eventDialog = element<HTMLDialogElement>('event-dialog');
const settingsDialog = element<HTMLDialogElement>('settings-dialog');
const exportDialog = element<HTMLDialogElement>('export-dialog');
const guideDialog = element<HTMLDialogElement>('guide-dialog');
const artDialog = element<HTMLDialogElement>('art-dialog');
const confirmDialog = element<HTMLDialogElement>('confirm-dialog');
const eventForm = element<HTMLFormElement>('event-form');
const playButton = element<HTMLButtonElement>('play-preview');

type RouteState = { scrollX?: number; scrollY?: number; focusId?: string };

function routeMessage(): string {
  if (demoMode) return 'Demo loaded: Rain Gate sample strip.';
  if (storageFailed) return 'Planner loaded without local storage.';
  return projectStorageReady ? 'Planner loaded: your local project.' : 'Planner ready: your project has not been opened.';
}

function configureRouteMetadata(): void {
  const title = demoMode ? 'Demo — Animatic Event Strip' : 'Animatic Event Strip — plan animation events';
  const description = demoMode
    ? 'Try a filled animation event strip with sample boards, sound, and event markers.'
    : 'Plan frames, sound cues, and input windows in a local event strip for animation handoff.';
  const canonical = `https://animatic-event-strip.sociobot.in/${demoMode ? '?demo=1' : ''}`;
  document.title = title;
  document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute('href', canonical);
  document.querySelector<HTMLMetaElement>('meta[name="description"]')?.setAttribute('content', description);
  document.querySelector<HTMLMetaElement>('meta[property="og:title"]')?.setAttribute('content', title);
  document.querySelector<HTMLMetaElement>('meta[property="og:description"]')?.setAttribute('content', description);
  document.querySelector<HTMLMetaElement>('meta[property="og:url"]')?.setAttribute('content', canonical);
  document.querySelector<HTMLMetaElement>('meta[name="twitter:title"]')?.setAttribute('content', title);
  document.querySelector<HTMLMetaElement>('meta[name="twitter:description"]')?.setAttribute('content', description);
}

function announceRoute(): void {
  const heading = element<HTMLElement>('product-title');
  element('route-status').textContent = routeMessage();
  requestAnimationFrame(() => heading.focus({ preventScroll: true }));
}

function saveRouteState(): void {
  const active = document.activeElement as HTMLElement | null;
  const current = history.state as RouteState | null;
  history.replaceState({ ...current, scrollX: window.scrollX, scrollY: window.scrollY, focusId: active?.id }, '', location.href);
}

function restoreRouteState(): void {
  const state = history.state as RouteState | null;
  if (typeof state?.scrollX === 'number' && typeof state.scrollY === 'number') window.scrollTo(state.scrollX, state.scrollY);
}

function blobUrl(blob: Blob): string {
  const existing = mediaUrls.get(blob);
  if (existing) return existing;
  const url = URL.createObjectURL(blob);
  mediaUrls.set(blob, url);
  return url;
}

function percent(frame: number): number {
  return (frame / project.durationFrames) * 100;
}

function eventWidth(event: StripEvent): number {
  return Math.max(percent(event.endFrame - event.startFrame), event.type === 'marker' ? 1.8 : 3.2);
}

function markerLabel(kind: MarkerKind): string {
  return ({ beat: 'Visual beat', sound: 'Sound cue', interaction: 'Interaction', note: 'Note' })[kind];
}

function waveformSvg(values: number[]): string {
  const waveform = values.length ? values : [0.2, .45, .3, .8, .5, .22, .62, .35, .7, .3];
  const points = waveform.map((value, index) => `${(index / Math.max(1, waveform.length - 1)) * 100},${17 - value * 15}`).join(' ');
  const reflected = waveform.map((value, index) => `${(index / Math.max(1, waveform.length - 1)) * 100},${17 + value * 15}`).reverse().join(' ');
  return `<svg aria-hidden="true" viewBox="0 0 100 34" preserveAspectRatio="none"><polygon points="${points} ${reflected}" fill="currentColor" opacity=".55" stroke="none"/><path d="M0 17h100"/></svg>`;
}

function renderRuler(): void {
  const seconds = project.durationFrames / project.fps;
  const intervalSeconds = seconds <= 15 ? 1 : seconds <= 60 ? 5 : seconds <= 180 ? 10 : 30;
  const ticks: string[] = [];
  for (let second = 0; second <= seconds; second += intervalSeconds) {
    const frame = Math.min(Math.round(second * project.fps), project.durationFrames);
    ticks.push(`<span class="tick" style="left:${percent(frame)}%">${frame}</span>`);
  }
  ruler.innerHTML = ticks.join('');
}

function renderEvents(): void {
  const shots = sortEvents(project.events).filter((event) => event.type === 'shot');
  const sounds = sortEvents(project.events).filter((event) => event.type === 'audio');
  const markers = sortEvents(project.events).filter((event) => event.type === 'marker');
  boardsLane.innerHTML = shots.map((event) => {
    const visual = event.media ? `<img src="${blobUrl(event.media.blob)}" alt="" />` : '<div class="fallback-board"></div>';
    return `<button class="timeline-item shot-card${selectedId === event.id ? ' selected' : ''}" style="left:${percent(event.startFrame)}%;width:${eventWidth(event)}%" data-event-id="${event.id}" type="button" aria-label="Edit board ${escapeHtml(event.label)}, ${frameRange(event)}">${visual}<span class="item-caption">${escapeHtml(event.label)}<small>${frameRange(event)}</small></span></button>`;
  }).join('');
  audioLane.innerHTML = sounds.map((event) => `<button class="timeline-item audio-card${selectedId === event.id ? ' selected' : ''}" style="left:${percent(event.startFrame)}%;width:${eventWidth(event)}%" data-event-id="${event.id}" type="button" aria-label="Edit sound ${escapeHtml(event.label)}, ${frameRange(event)}"><strong>${escapeHtml(event.label)}</strong><small>${frameRange(event)}</small>${waveformSvg(event.waveform)}</button>`).join('');
  markersLane.innerHTML = markers.map((event) => `<button class="marker-item${selectedId === event.id ? ' selected' : ''}" style="left:${percent(event.startFrame)}%;width:${eventWidth(event)}%" data-event-id="${event.id}" data-kind="${event.kind}" type="button" aria-label="Edit ${markerLabel(event.kind)} ${escapeHtml(event.label)}, ${frameRange(event)}"><strong>${escapeHtml(event.label)}</strong><span>${markerLabel(event.kind)} · ${frameRange(event)}</span></button>`).join('');
  element('shot-count').textContent = `${shots.length} ${shots.length === 1 ? 'board' : 'boards'}`;
  element('audio-count').textContent = `${sounds.length} ${sounds.length === 1 ? 'clip' : 'clips'}`;
  element('marker-count').textContent = `${markers.length} ${markers.length === 1 ? 'marker' : 'markers'}`;
  emptyState.hidden = project.events.length > 0;
}

function renderPlayhead(): void {
  playhead.style.left = `${percent(currentFrame)}%`;
  timecode.value = frameToTimecode(currentFrame, project.fps);
  timecode.textContent = timecode.value;
}

function render(): void {
  projectName.textContent = project.name;
  durationLabel.textContent = `${(project.durationFrames / project.fps).toFixed(1)}s`;
  fpsLabel.textContent = String(project.fps);
  renderRuler();
  renderEvents();
  renderPlayhead();
}

function announceError(message: string): void {
  workspaceError.textContent = message;
  workspaceError.hidden = false;
}

function clearError(): void {
  workspaceError.hidden = true;
  workspaceError.textContent = '';
}

async function persist(message = 'Saved locally'): Promise<void> {
  project.updatedAt = new Date().toISOString();
  saveStatus.textContent = 'Saving…';
  clearError();
  try {
    await saveProject(project, storageSpace);
    saveStatus.textContent = demoMode ? 'Demo only' : message;
    saveStatus.setAttribute('aria-label', `${message}. Last saved ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
  } catch (error) {
    storageFailed = true;
    saveStatus.textContent = 'Save failed';
    announceError(`${error instanceof Error ? error.message : 'Could not save locally.'} Export a project backup before closing this tab.`);
  }
}

async function openRealProject(): Promise<boolean> {
  if (demoMode || projectStorageReady) return true;
  if (projectStorageLoading) return projectStorageLoading;
  projectStorageLoading = (async () => {
    try {
      const stored = await loadProject('project');
      project = stored ?? newProject();
      projectStorageReady = true;
      render();
      if (stored) saveStatus.textContent = 'Saved locally';
      else await persist('Ready offline');
      element('route-status').textContent = routeMessage();
      return true;
    } catch (error) {
      project = newProject();
      projectStorageReady = true;
      storageFailed = true;
      render();
      announceError(`${error instanceof Error ? error.message : 'Local storage is unavailable.'} You can still work and export from this tab.`);
      saveStatus.textContent = 'Storage unavailable';
      element('route-status').textContent = 'Planner loaded without local storage.';
      return true;
    } finally {
      projectStorageLoading = undefined;
    }
  })();
  return projectStorageLoading;
}

function setFrame(frame: number): void {
  currentFrame = clampFrame(frame, project.durationFrames);
  renderPlayhead();
}

function updateTypeFields(): void {
  const type = (eventForm.elements.namedItem('event-type') as RadioNodeList).value;
  element('image-picker').hidden = type !== 'shot';
  element('audio-picker').hidden = type !== 'audio';
  element('marker-kind-wrap').hidden = type !== 'marker';
  const kind = element<HTMLSelectElement>('marker-kind').value;
  element('event-end-wrap').hidden = type === 'marker' && kind !== 'interaction';
}

function openEventEditor(id?: string): void {
  pendingImage = undefined;
  pendingAudio = undefined;
  eventForm.reset();
  element<HTMLInputElement>('event-id').value = id ?? '';
  const editing = id ? project.events.find((event) => event.id === id) : undefined;
  element('event-dialog-title').textContent = editing ? 'Edit event' : 'Add event';
  element('save-event').textContent = editing ? 'Save event' : 'Add to strip';
  element<HTMLButtonElement>('delete-event').hidden = !editing;
  const type = editing?.type ?? 'shot';
  const radio = eventForm.querySelector<HTMLInputElement>(`input[name="event-type"][value="${type}"]`);
  if (radio) radio.checked = true;
  element<HTMLInputElement>('event-label').value = editing?.label ?? '';
  element<HTMLInputElement>('event-start').value = String(editing?.startFrame ?? currentFrame);
  element<HTMLInputElement>('event-end').value = String(editing?.endFrame ?? Math.min(project.durationFrames, currentFrame + project.fps));
  element<HTMLTextAreaElement>('event-notes').value = editing?.notes ?? '';
  element<HTMLSelectElement>('marker-kind').value = editing?.type === 'marker' ? editing.kind : 'beat';
  element<HTMLOutputElement>('image-picked').textContent = editing?.type === 'shot' && editing.media ? editing.media.name : 'No image chosen';
  element<HTMLOutputElement>('audio-picked').textContent = editing?.type === 'audio' && editing.media ? editing.media.name : 'No audio chosen';
  element('event-error').hidden = true;
  updateTypeFields();
  eventDialog.showModal();
  requestAnimationFrame(() => element<HTMLInputElement>('event-label').focus());
}

function parseMedia(file: File): LocalMedia {
  return { name: file.name, type: file.type || 'application/octet-stream', blob: file };
}

async function makeWaveform(file: File): Promise<number[]> {
  try {
    const context = new AudioContext();
    const buffer = await context.decodeAudioData(await file.arrayBuffer());
    const channel = buffer.getChannelData(0);
    const buckets = 56;
    const size = Math.max(1, Math.floor(channel.length / buckets));
    const values = Array.from({ length: buckets }, (_, index) => {
      let peak = 0;
      const end = Math.min(channel.length, (index + 1) * size);
      for (let offset = index * size; offset < end; offset += Math.max(1, Math.floor(size / 80))) peak = Math.max(peak, Math.abs(channel[offset] ?? 0));
      return Math.round(peak * 100) / 100;
    });
    await context.close();
    return values;
  } catch {
    return [];
  }
}

async function saveEventFromForm(): Promise<void> {
  const id = element<HTMLInputElement>('event-id').value;
  const existing = id ? project.events.find((event) => event.id === id) : undefined;
  const type = (eventForm.elements.namedItem('event-type') as RadioNodeList).value as StripEvent['type'];
  const label = element<HTMLInputElement>('event-label').value.trim();
  const startFrame = Math.round(Number(element<HTMLInputElement>('event-start').value));
  const markerKind = element<HTMLSelectElement>('marker-kind').value as MarkerKind;
  const usesRange = type !== 'marker' || markerKind === 'interaction';
  const endFrame = usesRange ? Math.round(Number(element<HTMLInputElement>('event-end').value)) : startFrame + 1;
  const notes = element<HTMLTextAreaElement>('event-notes').value.trim();
  const error = element('event-error');
  if (!label) { error.textContent = 'Give this event a short label that tells the implementer what to build.'; error.hidden = false; return; }
  if (!Number.isInteger(startFrame) || !Number.isInteger(endFrame) || startFrame < 0 || endFrame <= startFrame || endFrame > project.durationFrames) {
    error.textContent = `Choose a start and end between frames 0 and ${project.durationFrames - 1}. The end frame itself is not included.`;
    error.hidden = false;
    return;
  }
  const base = { id: existing?.id ?? uid(type), label, startFrame, endFrame, notes };
  let next: StripEvent;
  if (type === 'shot') {
    const oldMedia = existing?.type === 'shot' ? existing.media : undefined;
    next = { ...base, type, ...(pendingImage ? { media: parseMedia(pendingImage) } : oldMedia ? { media: oldMedia } : {}) };
  } else if (type === 'audio') {
    const oldMedia = existing?.type === 'audio' ? existing.media : undefined;
    const media = pendingAudio ? parseMedia(pendingAudio) : oldMedia;
    const waveform = pendingAudio ? await makeWaveform(pendingAudio) : existing?.type === 'audio' ? existing.waveform : [];
    next = { ...base, type, waveform, ...(media ? { media } : {}) };
  } else {
    next = { ...base, type, kind: markerKind };
  }
  project.events = existing ? project.events.map((event) => event.id === existing.id ? next : event) : [...project.events, next];
  selectedId = next.id;
  currentFrame = startFrame;
  render();
  await persist(existing ? 'Event updated' : 'Event added');
  eventDialog.close();
}

async function deleteCurrentEvent(): Promise<void> {
  const id = element<HTMLInputElement>('event-id').value;
  const found = project.events.find((event) => event.id === id);
  if (!found) return;
  element('confirm-title').textContent = `Delete “${found.label}”?`;
  element('confirm-copy').textContent = 'This removes the event and any media stored with it. You can cancel and export a backup first.';
  eventDialog.close();
  confirmDialog.showModal();
  const result = await new Promise<string>((resolve) => confirmDialog.addEventListener('close', () => resolve(confirmDialog.returnValue), { once: true }));
  if (result !== 'confirm') { openEventEditor(id); return; }
  project.events = project.events.filter((event) => event.id !== id);
  selectedId = null;
  render();
  await persist('Event deleted');
}

function openSettings(selectName = false): void {
  element<HTMLInputElement>('settings-name').value = project.name;
  element<HTMLSelectElement>('settings-fps').value = String(project.fps);
  element<HTMLInputElement>('settings-duration').value = String(project.durationFrames);
  element('settings-error').hidden = true;
  settingsDialog.showModal();
  requestAnimationFrame(() => (selectName ? element<HTMLInputElement>('settings-name') : element<HTMLSelectElement>('settings-fps')).focus());
}

async function saveSettings(): Promise<void> {
  const name = element<HTMLInputElement>('settings-name').value.trim();
  const fps = Number(element<HTMLSelectElement>('settings-fps').value);
  const duration = Math.round(Number(element<HTMLInputElement>('settings-duration').value));
  const maxEnd = Math.max(0, ...project.events.map((event) => event.endFrame));
  const error = element('settings-error');
  if (!name) { error.textContent = 'Give this project a name.'; error.hidden = false; return; }
  if (duration < Math.max(12, maxEnd) || duration > 216000) { error.textContent = `Duration must be at least ${Math.max(12, maxEnd)} frames to contain the current events.`; error.hidden = false; return; }
  project.name = name;
  project.fps = fps;
  project.durationFrames = duration;
  currentFrame = clampFrame(currentFrame, duration);
  render();
  await persist('Timing saved');
  settingsDialog.close();
}

function download(content: BlobPart, filename: string, type: string): void {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function exportFile(kind: string): Promise<void> {
  const base = projectFilename(project.name);
  try {
    if (kind === 'project') download(JSON.stringify(await createProjectExport(project), null, 2), `${base}.aes.json`, 'application/json');
    if (kind === 'json') download(JSON.stringify(createAdapterExport(project), null, 2), `${base}.adapter.json`, 'application/json');
    if (kind === 'csv') download(createCsvExport(project), `${base}.markers.csv`, 'text/csv;charset=utf-8');
    if (['godot', 'unity', 'print'].includes(kind) && !licensed) {
      exportDialog.close();
      element('license-note').textContent = 'The Studio adapters need a one-time license. The project, adapter JSON, and CSV remain free.';
      element('studio-title').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      return;
    }
    if (kind === 'godot') download(godotAdapterSource(), `${base}_event_strip.gd`, 'text/plain');
    if (kind === 'unity') download(unityAdapterSource(), `${base}_event_strip.cs`, 'text/plain');
    if (kind === 'print') { exportDialog.close(); document.body.classList.add('printing'); window.print(); setTimeout(() => document.body.classList.remove('printing'), 500); return; }
    saveStatus.textContent = 'Export ready';
    exportDialog.close();
  } catch (error) {
    announceError(error instanceof Error ? error.message : 'The export could not be created.');
  }
}

async function importFile(file: File): Promise<void> {
  try {
    const incoming = restoreProject(JSON.parse(await file.text()));
    element('confirm-title').textContent = `Open “${incoming.name}”?`;
    element('confirm-copy').textContent = `This replaces “${project.name}” on this device. Export a backup first if you want to keep both.`;
    confirmDialog.showModal();
    const result = await new Promise<string>((resolve) => confirmDialog.addEventListener('close', () => resolve(confirmDialog.returnValue), { once: true }));
    if (result !== 'confirm') return;
    project = incoming;
    project.updatedAt = new Date().toISOString();
    currentFrame = 0;
    selectedId = null;
    render();
    await persist('Project imported');
  } catch (error) {
    announceError(error instanceof Error ? error.message : 'The selected file could not be imported.');
  }
}

function stopPlayback(): void {
  playing = false;
  cancelAnimationFrame(animationFrame);
  playButton.setAttribute('aria-label', 'Play strip preview');
  playButton.innerHTML = '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="m8 5 11 7-11 7V5Z"/></svg>';
  for (const audio of activeAudio) { audio.pause(); audio.currentTime = 0; }
  activeAudio.clear();
}

function tick(now: number): void {
  if (!playing) return;
  const elapsedFrames = Math.floor(((now - playStartedAt) / 1000) * project.fps);
  const previous = currentFrame;
  currentFrame = playStartedFrame + elapsedFrames;
  if (currentFrame >= project.durationFrames) { setFrame(project.durationFrames - 1); stopPlayback(); return; }
  if (currentFrame !== previous) {
    renderPlayhead();
    for (const event of project.events) {
      if (event.type === 'audio' && event.media && event.startFrame > previous && event.startFrame <= currentFrame) {
        const audio = new Audio(blobUrl(event.media.blob));
        activeAudio.add(audio);
        audio.addEventListener('ended', () => activeAudio.delete(audio), { once: true });
        void audio.play().catch(() => activeAudio.delete(audio));
      }
    }
  }
  animationFrame = requestAnimationFrame(tick);
}

function togglePlayback(): void {
  if (playing) { stopPlayback(); return; }
  if (currentFrame >= project.durationFrames - 1) currentFrame = 0;
  playing = true;
  playStartedAt = performance.now();
  playStartedFrame = currentFrame;
  playButton.setAttribute('aria-label', 'Pause strip preview');
  playButton.innerHTML = '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M8 6v12M16 6v12"/></svg>';
  for (const event of project.events) {
    if (event.type === 'audio' && event.media && event.startFrame <= currentFrame && event.endFrame > currentFrame) {
      const audio = new Audio(blobUrl(event.media.blob));
      audio.currentTime = (currentFrame - event.startFrame) / project.fps;
      activeAudio.add(audio);
      audio.addEventListener('ended', () => activeAudio.delete(audio), { once: true });
      void audio.play().catch(() => activeAudio.delete(audio));
    }
  }
  animationFrame = requestAnimationFrame(tick);
}

async function moveSelected(delta: number): Promise<void> {
  if (!selectedId) { setFrame(currentFrame + delta); return; }
  const found = project.events.find((event) => event.id === selectedId);
  if (!found) return;
  const bounded = Math.max(-found.startFrame, Math.min(delta, project.durationFrames - found.endFrame));
  if (!bounded) return;
  found.startFrame += bounded;
  found.endFrame += bounded;
  currentFrame = found.startFrame;
  render();
  document.querySelector<HTMLElement>(`[data-event-id="${CSS.escape(found.id)}"]`)?.focus();
  await persist('Event moved');
}

function setOnlineStatus(): void {
  element('offline-banner').hidden = navigator.onLine;
}

function cacheLicense(valid: boolean): void {
  localStorage.setItem(LICENSE_CACHE_KEY, JSON.stringify({ valid, checkedAt: Date.now() }));
}

function saveLicenseToken(token: string): void {
  // A verdict belongs to the license that produced it. Keep the token and its
  // short-lived verdict separately, then discard the verdict before accepting
  // a replacement token from checkout or the restore form.
  localStorage.setItem(LICENSE_KEY, token);
  localStorage.removeItem(LICENSE_CACHE_KEY);
}

function renderLicense(note?: string): void {
  const state = element('license-state');
  state.innerHTML = `<span class="status-dot" style="background:${licensed ? 'var(--success)' : 'var(--paper-dim)'}"></span>${licensed ? 'Studio Pack unlocked' : 'Free planner active'}`;
  if (note) element('license-note').textContent = note;
  document.querySelectorAll('.pro-export').forEach((button) => button.classList.toggle('locked', !licensed));
}

async function verifyLicense(token: string, force = false): Promise<void> {
  const cachedText = localStorage.getItem(LICENSE_CACHE_KEY);
  let cached: { valid: boolean; checkedAt: number } | undefined;
  try { cached = cachedText ? JSON.parse(cachedText) as { valid: boolean; checkedAt: number } : undefined; } catch { cached = undefined; }
  if (cached?.valid) licensed = true;
  renderLicense(cached?.valid ? 'Cached Studio access is active.' : undefined);
  if (!navigator.onLine) { renderLicense(cached?.valid ? 'Studio access is cached on this device. License verification will resume online.' : 'Connect once to verify this license. The free planner works offline.'); return; }
  if (!force && cached && Date.now() - cached.checkedAt < 86_400_000) { licensed = cached.valid; renderLicense(cached.valid ? 'Studio access was checked within the last day.' : undefined); return; }
  try {
    const response = await fetch(`${VERIFY_URL}?license=${encodeURIComponent(token)}`, { headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error('License service unavailable');
    const result = await response.json() as { valid?: boolean; reason?: string };
    licensed = result.valid === true;
    cacheLicense(licensed);
    renderLicense(licensed ? 'License verified. Studio downloads are ready.' : 'This license is no longer active. You can keep using the complete free planner or purchase a new license.');
  } catch {
    renderLicense(cached?.valid ? 'Could not refresh the license; cached Studio access remains active.' : 'Could not verify right now. Check your connection and try again.');
  }
}

async function initializeLicense(): Promise<void> {
  const params = new URLSearchParams(location.search);
  const incoming = params.get('license');
  if (incoming) {
    saveLicenseToken(incoming);
    params.delete('license');
    history.replaceState({}, '', `${location.pathname}${params.size ? `?${params}` : ''}${location.hash}`);
  }
  const token = incoming ?? localStorage.getItem(LICENSE_KEY);
  if (token) await verifyLicense(token, Boolean(incoming));
  else renderLicense();
}

function registerEvents(): void {
  element('start-project').addEventListener('click', async () => {
    if (!await openRealProject()) return;
    element('workspace-title').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    openEventEditor();
  });
  element('reset-demo').addEventListener('click', async () => {
    project = sampleProject();
    currentFrame = 0;
    selectedId = null;
    render();
    await persist('Demo reset');
    element('demo-status').textContent = 'Sample strip reset.';
  });
  element('leave-demo').addEventListener('click', async () => {
    try { await clearProject('demo'); } finally { location.assign('/?start=1'); }
  });
  element('add-event').addEventListener('click', async () => { if (await openRealProject()) openEventEditor(); });
  element('empty-add').addEventListener('click', async () => { if (await openRealProject()) openEventEditor(); });
  element('project-settings').addEventListener('click', async () => { if (await openRealProject()) openSettings(); });
  element('rename-project').addEventListener('click', async () => { if (await openRealProject()) openSettings(true); });
  element('open-guide').addEventListener('click', () => guideDialog.showModal());
  element('export-menu').addEventListener('click', async () => { if (await openRealProject()) exportDialog.showModal(); });
  element('import-project').addEventListener('click', () => element<HTMLInputElement>('import-file').click());
  element<HTMLInputElement>('import-file').addEventListener('change', async (event) => {
    const input = event.currentTarget as HTMLInputElement;
    if (input.files?.[0] && await openRealProject()) await importFile(input.files[0]);
    input.value = '';
  });
  eventForm.addEventListener('change', (event) => {
    const target = event.target as HTMLInputElement;
    if (target.name === 'event-type' || target.id === 'marker-kind') updateTypeFields();
  });
  eventForm.addEventListener('submit', (event) => {
    const submitter = event.submitter as HTMLButtonElement | null;
    if (submitter?.value === 'cancel') return;
    event.preventDefault();
    void saveEventFromForm();
  });
  element('delete-event').addEventListener('click', () => void deleteCurrentEvent());
  element('choose-image').addEventListener('click', () => element<HTMLInputElement>('image-file').click());
  element('choose-audio').addEventListener('click', () => element<HTMLInputElement>('audio-file').click());
  element<HTMLInputElement>('image-file').addEventListener('change', (event) => {
    pendingImage = (event.currentTarget as HTMLInputElement).files?.[0];
    element('image-picked').textContent = pendingImage?.name ?? 'No image chosen';
  });
  element<HTMLInputElement>('audio-file').addEventListener('change', (event) => {
    pendingAudio = (event.currentTarget as HTMLInputElement).files?.[0];
    element('audio-picked').textContent = pendingAudio?.name ?? 'No audio chosen';
  });
  element<HTMLFormElement>('settings-form').addEventListener('submit', (event) => {
    const submitter = event.submitter as HTMLButtonElement | null;
    if (submitter?.value === 'cancel') return;
    event.preventDefault();
    void saveSettings();
  });
  document.querySelectorAll<HTMLButtonElement>('.close-dialog').forEach((button) => button.addEventListener('click', (event) => {
    if (button.form) return;
    event.preventDefault();
    button.closest('dialog')?.close('cancel');
  }));
  document.querySelectorAll<HTMLButtonElement>('[data-export]').forEach((button) => button.addEventListener('click', () => void exportFile(button.dataset.export ?? '')));
  for (const lane of [boardsLane, audioLane, markersLane]) {
    lane.addEventListener('click', (event) => {
      const button = (event.target as Element).closest<HTMLElement>('[data-event-id]');
      if (!button?.dataset.eventId) return;
      selectedId = button.dataset.eventId;
      openEventEditor(selectedId);
    });
    lane.addEventListener('keydown', (event) => {
      const keyEvent = event as KeyboardEvent;
      const button = (event.target as Element).closest<HTMLElement>('[data-event-id]');
      if (!button?.dataset.eventId) return;
      selectedId = button.dataset.eventId;
      if (keyEvent.key === 'ArrowLeft' || keyEvent.key === 'ArrowRight') {
        event.preventDefault();
        const direction = keyEvent.key === 'ArrowLeft' ? -1 : 1;
        void moveSelected(direction * (keyEvent.shiftKey ? 10 : 1));
      }
    });
  }
  eventDialog.addEventListener('close', () => {
    const id = element<HTMLInputElement>('event-id').value;
    if (!id) return;
    requestAnimationFrame(() => {
      if (confirmDialog.open || eventDialog.open) return;
      document.querySelector<HTMLElement>(`[data-event-id="${CSS.escape(id)}"]`)?.focus();
    });
  });
  viewport.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); setFrame(currentFrame + (event.key === 'ArrowLeft' ? -1 : 1) * (event.shiftKey ? 10 : 1)); }
    if (event.key === 'Home') { event.preventDefault(); setFrame(0); }
    if (event.key === 'End') { event.preventDefault(); setFrame(project.durationFrames - 1); }
  });
  stage.addEventListener('pointerdown', (event) => {
    if ((event.target as Element).closest('[data-event-id]')) return;
    const rect = stage.getBoundingClientRect();
    setFrame(Math.round(((event.clientX - rect.left) / rect.width) * project.durationFrames));
  });
  element('jump-start').addEventListener('click', () => setFrame(0));
  element('step-back').addEventListener('click', () => setFrame(currentFrame - 1));
  element('step-forward').addEventListener('click', () => setFrame(currentFrame + 1));
  playButton.addEventListener('click', async () => { if (await openRealProject()) togglePlayback(); });
  element<HTMLInputElement>('timeline-zoom').addEventListener('input', (event) => { stage.style.width = `${Number((event.target as HTMLInputElement).value) * 100}%`; });
  element<HTMLFormElement>('license-form').addEventListener('submit', (event) => {
    event.preventDefault();
    if (demoMode) { element('license-note').textContent = 'Start for real before restoring a license. The demo does not read your saved access.'; return; }
    const token = element<HTMLInputElement>('license-token').value.trim();
    if (!token) { element('license-note').textContent = 'Paste the license token from your receipt.'; return; }
    saveLicenseToken(token);
    void verifyLicense(token, true);
  });
  element('about-art').addEventListener('click', () => artDialog.showModal());
  window.addEventListener('online', () => { setOnlineStatus(); if (!demoMode) { const token = localStorage.getItem(LICENSE_KEY); if (token) void verifyLicense(token); } });
  window.addEventListener('offline', setOnlineStatus);
  window.addEventListener('pageshow', (event) => {
    setOnlineStatus();
    if (event.persisted) {
      restoreRouteState();
      announceRoute();
    }
  });
  window.addEventListener('pagehide', saveRouteState);
  window.addEventListener('popstate', () => {
    restoreRouteState();
    announceRoute();
  });
  setTimeout(setOnlineStatus, 250);
}

async function registerServiceWorker(): Promise<void> {
  if (!('serviceWorker' in navigator)) return;
  try {
    const controlledAtRegistration = Boolean(navigator.serviceWorker.controller);
    let updateRequested = false;
    const registration = await navigator.serviceWorker.register('/sw.js');
    registration.addEventListener('updatefound', () => {
      const worker = registration.installing;
      worker?.addEventListener('statechange', () => { if (worker.state === 'installed' && navigator.serviceWorker.controller) element('update-toast').hidden = false; });
    });
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (updateRequested) location.reload();
      else if (controlledAtRegistration) element('update-toast').hidden = false;
    });
    element('reload-app').addEventListener('click', () => {
      const button = element<HTMLButtonElement>('reload-app');
      const worker = registration.waiting ?? registration.installing;
      if (!worker || worker.state === 'activated') { location.reload(); return; }
      updateRequested = true;
      button.disabled = true;
      button.textContent = 'Updating…';
      if (worker.state === 'installed') worker.postMessage({ type: 'SKIP_WAITING' });
      else worker.addEventListener('statechange', () => {
        if (worker.state === 'installed') worker.postMessage({ type: 'SKIP_WAITING' });
      });
    });
  } catch {
    announceError('Offline install is unavailable in this browser. Your project still saves locally.');
  }
}

async function start(): Promise<void> {
  registerEvents();
  setOnlineStatus();
  configureRouteMetadata();
  element('demo-banner').hidden = !demoMode;
  document.body.classList.toggle('demo-mode', demoMode);
  if (demoMode) {
    projectStorageReady = true;
    try {
      const stored = await loadProject('demo');
      if (stored) project = stored;
      else {
        project = sampleProject();
        await persist('Demo ready');
      }
    } catch (error) {
      project = sampleProject();
      storageFailed = true;
      announceError(`${error instanceof Error ? error.message : 'Local storage is unavailable.'} You can still work and export from this tab.`);
    }
  } else if (explicitRealStart) {
    await openRealProject();
    if (params.get('start') === '1') history.replaceState({}, '', '/');
  }
  render();
  announceRoute();
  saveStatus.textContent = storageFailed ? 'Storage unavailable' : demoMode ? 'Demo only' : projectStorageReady ? 'Saved locally' : 'Project unopened';
  if (demoMode) renderLicense('The demo uses the free planner and does not read saved licenses.');
  else await initializeLicense();
  await registerServiceWorker();
}

void start();
