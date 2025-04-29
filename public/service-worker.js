// service-worker.js

const CACHE_NAME = "wellbands-v1";

// Assets to pre-cache for faster loading
const PRECACHE_ASSETS = [
  "/",
  "/login",
  "/static/css/main.css",
  "/static/js/main.js",
  "/static/media/logo.png",
];

// Install event - cache static assets
self.addEventListener("install", (event) => {
  console.log("[ServiceWorker] Installing...");

  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("[ServiceWorker] Pre-caching assets");
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - cleanup old caches
self.addEventListener("activate", (event) => {
  console.log("[ServiceWorker] Activating...");

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => cacheName !== CACHE_NAME)
            .map((cacheName) => {
              console.log("[ServiceWorker] Removing old cache:", cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Helper function to determine if a request should bypass cache
const shouldBypassCache = (url) => {
  // Never cache API requests except certain static ones
  if (url.pathname.startsWith("/api/")) {
    // Allow caching health check endpoint
    return url.pathname !== "/api/health";
  }

  return false;
};

// Fetch event - apply network strategies
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Skip non-GET requests or requests to other domains
  if (event.request.method !== "GET" || url.origin !== self.location.origin) {
    return;
  }

  // Special handling for API requests
  if (shouldBypassCache(url)) {
    // Network-only strategy for API calls
    return;
  }

  // For everything else, use cache-first strategy
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached response
        return cachedResponse;
      }

      // Not in cache, get from network
      return fetch(event.request)
        .then((response) => {
          // Check if valid response
          if (
            !response ||
            response.status !== 200 ||
            response.type !== "basic"
          ) {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          // Add to cache for future
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        })
        .catch((error) => {
          console.log("[ServiceWorker] Fetch failed:", error);
          // For navigation requests, try to serve index.html from cache
          if (event.request.mode === "navigate") {
            return caches.match("/");
          }

          return null;
        });
    })
  );
});

// Handle messages from the main thread
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
