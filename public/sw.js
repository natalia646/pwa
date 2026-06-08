const API_URL = 'https://dummyjson.com/todos';
const DB_NAME  = 'TodosDatabase';
const CACHE_VERSION = 'v1';
const STATIC_CACHE  = `static-${CACHE_VERSION}`;
const NAV_CACHE     = `nav-${CACHE_VERSION}`;
const ALL_CACHES    = [STATIC_CACHE, NAV_CACHE];
const APP_SHELL     = ['/', '/index.html', '/manifest.json', '/favicon.svg'];

// ---------------------------------------------------------------------------
// Cache lifecycle
// ---------------------------------------------------------------------------

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => !ALL_CACHES.includes(k)).map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (url.origin !== location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(NAV_CACHE).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() =>
          caches.match('/index.html').then(
            (cached) => cached ?? new Response('Offline', { status: 503 })
          )
        )
    );
    return;
  }

  const isStaticAsset =
    url.pathname.startsWith('/assets/') ||
    /\.(js|css|png|jpg|jpeg|webp|svg|ico|woff2?)$/.test(url.pathname);

  if (isStaticAsset) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ??
          fetch(request).then((response) => {
            const clone = response.clone();
            caches.open(STATIC_CACHE).then((cache) => cache.put(request, clone));
            return response;
          })
      )
    );
  }
});

// ---------------------------------------------------------------------------
// Background Sync
// ---------------------------------------------------------------------------

self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-todos') {
    event.waitUntil(syncTodos());
  }
});

async function syncTodos() {
  const db = await openSyncDB();
  const allEntries = await dbGetAll(db, 'syncQueue');
  const pending = allEntries.filter(
    (e) => e.status === 'pending' || e.status === 'failed'
  );

  let hasError = false;

  for (const entry of pending) {
    try {
      const payload = JSON.parse(entry.payload);

      if (entry.operation === 'create') {
        const { id: tempId, ...body } = payload;
        const created = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        }).then((res) => {
          if (!res.ok) throw new Error(`POST /todos failed: ${res.status}`);
          return res.json();
        });

        await dbDelete(db, 'todos', tempId);
        await dbPut(db, 'todos', created);
        await dbDelete(db, 'syncQueue', entry.id);

      } else if (entry.operation === 'update') {
        const { id, ...body } = payload;
        await fetch(`${API_URL}/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        }).then((res) => {
          if (!res.ok) throw new Error(`PUT /todos/${id} failed: ${res.status}`);
        });
        await dbDelete(db, 'syncQueue', entry.id);

      } else if (entry.operation === 'delete') {
        await fetch(`${API_URL}/${entry.entityId}`, {
          method: 'DELETE',
        }).then((res) => {
          if (!res.ok)
            throw new Error(`DELETE /todos/${entry.entityId} failed: ${res.status}`);
        });
        await dbDelete(db, 'syncQueue', entry.id);
      }

    } catch (err) {
      hasError = true;
      await dbPut(db, 'syncQueue', {
        ...entry,
        status: 'failed',
        retryCount: (entry.retryCount ?? 0) + 1,
        lastError: err instanceof Error ? err.message : String(err),
        updatedAt: Date.now(),
      });
    }
  }

  if (hasError) {
    throw new Error('sync-todos: one or more entries failed — browser will retry');
  }
}

// ---------------------------------------------------------------------------
// Raw IndexedDB helpers (no Dexie in SW scope)
// ---------------------------------------------------------------------------

function openSyncDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME);
    request.onerror  = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

function dbGetAll(db, storeName) {
  return new Promise((resolve, reject) => {
    const tx      = db.transaction(storeName, 'readonly');
    const store   = tx.objectStore(storeName);
    const request = store.getAll();
    request.onerror  = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

function dbPut(db, storeName, record) {
  return new Promise((resolve, reject) => {
    const tx      = db.transaction(storeName, 'readwrite');
    const store   = tx.objectStore(storeName);
    const request = store.put(record);
    request.onerror  = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

function dbDelete(db, storeName, key) {
  return new Promise((resolve, reject) => {
    const tx      = db.transaction(storeName, 'readwrite');
    const store   = tx.objectStore(storeName);
    const request = store.delete(key);
    request.onerror  = () => reject(request.error);
    request.onsuccess = () => resolve(undefined);
  });
}
