const CACHE_NAME = "focus-cache-v2";
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

// Install and pre-cache
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

// Activate and cleanup old caches
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

// Fetch handler
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) return response;
      return fetch(event.request).catch(() => {
        // Fallback ONLY for navigation requests
        if (event.request.mode === "navigate") {
          return caches.match("/index.html");
        }
      });
    })
  );
});
