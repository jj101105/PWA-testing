const CACHE_NAME = "pwa-cache-v6";

// files to cache immediately (static assets)
const STATIC_ASSETS = ["./", "./index.html", "./manifest.json", "./icon.png"];

// install
self.addEventListener("install", (event) => {
  console.log("service worker : installing...");
  self.skipWaiting(); // if 2 or more tabs open we can just force activate the new sw

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("service worker caching static asset");
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// for user that already install and using the app again

//
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Update cache with fresh content
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      })
      .catch(() => {
        // Fallback to cache if offline
        return caches.match(event.request);
      })
  );
});
// for deleting old cache
self.addEventListener("activate", (event) => {
  console.log("cleaning up old cache");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
