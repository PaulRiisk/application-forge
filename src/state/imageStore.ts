// tiny indexeddb store for the photo + signature data urls
// the images stay out of the document and the exported json by design —
// this store only spares re-uploading after a reload in the same browser.
// every call swallows failures (private mode, quota) and degrades to memory-only

const DB_NAME = "application-forge-images";
const STORE = "images";

export type ImageKey = "photo" | "signature";

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STORE)) {
        req.result.createObjectStore(STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

// run one transaction against the store; the request is built by the caller
async function withStore<T>(
  mode: IDBTransactionMode,
  run: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  const db = await openDb();
  try {
    return await new Promise<T>((resolve, reject) => {
      const req = run(db.transaction(STORE, mode).objectStore(STORE));
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  } finally {
    db.close();
  }
}

export async function loadImage(key: ImageKey): Promise<string | null> {
  try {
    const value = await withStore("readonly", (s) => s.get(key));
    return typeof value === "string" ? value : null;
  } catch {
    return null;
  }
}

export async function saveImage(key: ImageKey, dataUrl: string): Promise<void> {
  try {
    await withStore("readwrite", (s) => s.put(dataUrl, key));
  } catch {
    // quota or blocked, silently stay memory-only
  }
}

export async function deleteImage(key: ImageKey): Promise<void> {
  try {
    await withStore("readwrite", (s) => s.delete(key));
  } catch {
    // no-op
  }
}
