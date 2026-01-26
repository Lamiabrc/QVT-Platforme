self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("zena-cache-v1").then((cache) =>
      cache.addAll(["/", "/index.html", "/favicon.png"])
    )
  );
});

// Cache only same-origin GET requests. Let Supabase/API and POST bypass to avoid ERR_FAILED on network calls.
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const isGET = request.method === "GET";
  const sameOrigin = request.url.startsWith(self.location.origin);

  if (!isGET || !sameOrigin) return;

  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request))
  );
});
