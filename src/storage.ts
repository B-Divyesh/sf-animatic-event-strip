import type { Project } from './types';

const DB_NAME = 'animatic-event-strip';
const DB_VERSION = 1;
const STORE = 'projects';
const ACTIVE_KEY = 'active';

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE)) request.result.createObjectStore(STORE);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Could not open local project storage.'));
  });
}

export async function loadProject(): Promise<Project | undefined> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly');
    const request = tx.objectStore(STORE).get(ACTIVE_KEY);
    request.onsuccess = () => resolve(request.result as Project | undefined);
    request.onerror = () => reject(request.error ?? new Error('Could not load the local project.'));
    tx.oncomplete = () => db.close();
  });
}

export async function saveProject(project: Project): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).put(project, ACTIVE_KEY);
    tx.oncomplete = () => { db.close(); resolve(); };
    tx.onerror = () => { db.close(); reject(tx.error ?? new Error('Could not save the project locally.')); };
  });
}
