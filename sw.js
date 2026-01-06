const CACHE = 'pilot-core-offline-v1';

const ASSETS = [
  './',
  './index.html',
  './sw.js',
  './manifest.webmanifest',
  './pilot-192.png',
  './pilot-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((k) => (k !== CACHE ? caches.delete(k) : null))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((cached) => cached || fetch(event.request))
      .catch(() => caches.match('./index.html'))
  );
});
