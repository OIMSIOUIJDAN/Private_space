// Service worker disabled - no caching
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());
self.addEventListener('fetch', (event) => {
  // Do nothing - let browser handle requests normally
});