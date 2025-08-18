const CACHE_NAME = "focus-cache-v4";
const APP_SHELL = [
  "/",
  "/index.html",
  "/manifest.webmanifest",
  "images/logo2.png",
  "/sounds/start.mp3",
  "/sounds/tone1.mp3",
  "/sounds/tone2.mp3",
  "/sounds/tone3.mp3",
  "/sounds/tone4.mp3",
  "/sounds/tone5.mp3",
];

// Install event – cache app shell
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
});

// Activate event – clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

// Fetch – serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return (
        cached ||
        fetch(event.request).then((res) => {
          return res;
        })
      );
    })
  );
});
