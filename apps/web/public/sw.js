self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", async () => {
  // Unregister the service worker
  self.registration.unregister();

  // Delete all caches
  const keys = await caches.keys();
  await Promise.all(keys.map((key) => caches.delete(key)));

  // Optionally, force page reload
  clients.matchAll({ type: "window" }).then((clients) => {
    for (const client of clients) {
      client.navigate(client.url);
    }
  });
});
