// Flouvia OS — Service Worker v1
// Handles: push notifications + basic asset caching

const CACHE = 'flouvia-os-v1';

// ── Push: recibir notificación del servidor ───────────────
self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {};

  const title   = data.title   || 'Flouvia OS';
  const options = {
    body:    data.body   || '',
    icon:    '/android-touch-icon.png',
    badge:   '/android-touch-icon.png',
    tag:     data.tag    || 'flouvia-notif',
    renotify: true,
    data:    { url: data.url || '/dashboard' },
    actions: data.action
      ? [{ action: 'open', title: data.action }]
      : [],
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// ── Click en notificación: abrir la URL ──────────────────
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/dashboard';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((wins) => {
      const existing = wins.find((w) => w.url.includes(url));
      if (existing) return existing.focus();
      return clients.openWindow(url);
    })
  );
});

// ── Activate: limpiar caches viejos ──────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
});
