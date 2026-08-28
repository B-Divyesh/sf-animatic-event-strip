import type { Project } from './types';

export type StorageSpace = 'project' | 'demo';

const DB_NAMES: Record<StorageSpace, string> = {
  project: 'animatic-event-strip',
  demo: 'demo:animatic-event-strip',
};
const DB_VERSION = 1;
const STORE = 'projects';
const ACTIVE_KEY = 'active';

function openDatabase(space: StorageSpace): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAMES[space], DB_VERSION);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE)) request.result.createObjectStore(STORE);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Could not open local project storage.'));
  });
}

export async function loadProject(space: StorageSpace = 'project'): Promise<Project | undefined> {
  const db = await openDatabase(space);
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly');
    const request = tx.objectStore(STORE).get(ACTIVE_KEY);
    request.onsuccess = () => resolve(request.result as Project | undefined);
    request.onerror = () => reject(request.error ?? new Error('Could not load the local project.'));
    tx.oncomplete = () => db.close();
  });
}

export async function saveProject(project: Project, space: StorageSpace = 'project'): Promise<void> {
  const db = await openDatabase(space);
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).put(project, ACTIVE_KEY);
    tx.oncomplete = () => { db.close(); resolve(); };
    tx.onerror = () => { db.close(); reject(tx.error ?? new Error('Could not save the project locally.')); };
  });
}

export async function clearProject(space: StorageSpace): Promise<void> {
  const db = await openDatabase(space);
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).delete(ACTIVE_KEY);
    tx.oncomplete = () => { db.close(); resolve(); };
    tx.onerror = () => { db.close(); reject(tx.error ?? new Error('Could not clear the local project.')); };
  });
}
