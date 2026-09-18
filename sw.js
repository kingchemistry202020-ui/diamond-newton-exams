const CACHE = 'nd-cache-v1';
self.addEventListener('install', e => { self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.open(CACHE).then(c =>
      fetch(e.request).then(res => {
        if (res.ok && e.request.url.indexOf(self.location.origin) === 0) c.put(e.request, res.clone());
        return res;
      }).catch(() => c.match(e.request).then(m => m || caches.match('./index.html')))
    )
  );
});