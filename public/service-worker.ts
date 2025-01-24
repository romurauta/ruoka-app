self.addEventListener('install', (event: any) => {
    event.waitUntil(
      caches.open('ruoka-cache').then((cache) => {
        return cache.addAll(['/']);
      })
    );
  });
  
  self.addEventListener('fetch', (event: any) => {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  });