const CACHE_NAME = "focus-cache-v5";

const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/sounds/start.mp3",
  "/sounds/tone1.mp3",
  "/sounds/tone2.mp3",
  "/sounds/tone3.mp3",
  "/sounds/tone4.mp3",
  "/sounds/tone5.mp3",
];

// Install – pre-cache everything
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .catch((err) => console.error("Cache addAll failed:", err))
  );
  self.skipWaiting();
});

// Activate – remove old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
  );
  self.clients.claim();
});

// Fetch – respond from cache, fallback to network, and cache new requests
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request)
        .then((res) => {
          // Only cache successful, same-origin requests (avoid opaque HMR/dev requests)
          if (!res || !res.ok || !event.request.url.startsWith(self.origin))
            return res;

          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, res.clone());
            return res;
          });
        })
        .catch(() => {
          // Offline fallback for navigation
          if (event.request.mode === "navigate") {
            return caches.match("/index.html");
          }
        });
    })
  );
});
