/* ==========================================================================
   TASKSPHERE SERVICE WORKER — Cache-First PWA Strategy
   ========================================================================== */
const CACHE_NAME = 'tasksphere-v1';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './style.css',
    './app.js',
    './manifest.json',
    './icons/icon-192.png',
    './icons/icon-512.png',
    'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.11.0/sql-wasm.js',
    'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.11.0/sql-wasm.wasm'
];

/* ---- Install: pre-cache all static assets ---- */
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(async (cache) => {
            // Cache local assets first (always succeeds)
            const localAssets = ASSETS_TO_CACHE.filter(url => !url.startsWith('http'));
            await cache.addAll(localAssets);

            // Cache CDN assets individually (fail-safe — don't block install)
            const cdnAssets = ASSETS_TO_CACHE.filter(url => url.startsWith('http'));
            await Promise.allSettled(
                cdnAssets.map(url =>
                    fetch(url, { mode: 'cors' })
                        .then(response => {
                            if (response.ok) cache.put(url, response);
                        })
                        .catch(() => { /* CDN unavailable during install — okay */ })
                )
            );
        })
    );
    self.skipWaiting();
});

/* ---- Activate: clean up old caches ---- */
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys
                    .filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            )
        )
    );
    self.clients.claim();
});

/* ---- Fetch: cache-first with network fallback ---- */
self.addEventListener('fetch', (event) => {
    // Only handle GET requests and HTTP(S) schemes
    if (event.request.method !== 'GET') return;
    if (!event.request.url.startsWith('http')) return;

    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            if (cachedResponse) {
                // Serve from cache, update in background
                const fetchPromise = fetch(event.request)
                    .then(networkResponse => {
                        if (networkResponse && networkResponse.ok) {
                            caches.open(CACHE_NAME).then(cache => {
                                cache.put(event.request, networkResponse.clone());
                            });
                        }
                        return networkResponse;
                    })
                    .catch(() => cachedResponse);

                // Return cache immediately, update happens in background
                return cachedResponse;
            }

            // Not in cache — fetch from network and cache it
            return fetch(event.request).then(networkResponse => {
                if (networkResponse && networkResponse.ok) {
                    const responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, responseClone);
                    });
                }
                return networkResponse;
            });
        })
    );
});
