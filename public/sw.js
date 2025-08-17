const CACHE_NAME = "focus-cache-v1";
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

// Install
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

// Fetch
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request).catch(() => caches.match("/index.html"))
      );
    })
  );
});
