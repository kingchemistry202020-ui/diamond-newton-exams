const CACHE = 'nd-cache-v1';

self.addEventListener('install', function(e) {
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', function(e) {
  if (e.request.method !== 'GET') return;
  
  e.respondWith(
    caches.open(CACHE).then(function(cache) {
      return fetch(e.request).then(function(response) {
        if (response && response.status === 200 && response.type === 'basic') {
          cache.put(e.request, response.clone());
        }
        return response;
      }).catch(function() {
        return cache.match(e.request).then(function(match) {
          return match || cache.match('./index.html');
        });
      });
    })
  );
});