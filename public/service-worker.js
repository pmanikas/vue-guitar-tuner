const CACHE_VERSION = 1;
const CACHE_NAME = `guitar-tuner-app-cache-${CACHE_VERSION}`;
const urlsToCache = [
    "./",
    "./index.html",
    "./icons/android-chrome-192x192.png",
    "./icons/android-chrome-512x512.png",
    "./icons/apple-touch-icon.png",
    "./icons/favicon-16x16.png",
    "./icons/favicon-32x32.png",
    "./icons/favicon.ico",
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});

self.addEventListener("activate", (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
