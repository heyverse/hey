self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", async () => {
  // Unregister the service worker
  await self.registration.unregister();

  // Delete all caches
  const keys = await caches.keys();
  await Promise.all(keys.map((key) => caches.delete(key)));

  // Reload all clients
  const clientsList = await clients.matchAll({ type: "window" });
  for (const client of clientsList) {
    client.navigate(client.url);
  }
});
