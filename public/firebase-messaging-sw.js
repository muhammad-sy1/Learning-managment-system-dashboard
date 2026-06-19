/* public/firebase-messaging-sw.js */
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.4/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.4/firebase-messaging-compat.js",
);

firebase.initializeApp({
  apiKey: "AIzaSyDGO0mSOjTolrbJ7fTXmtFkRV1tnJangbE",
  authDomain: "bayanmasters-store.firebaseapp.com",
  projectId: "bayanmasters-store",
  messagingSenderId: "1008191863502",
  appId: "1:1008191863502:web:022778cf5c629f5e902e9f",
  storageBucket: "bayanmasters-store.firebasestorage.app",
  measurementId: "G-WGX1ZVD7WY",
});

const messaging = firebase.messaging();

// Handle background messages (when tab is closed or not focused)
messaging.onBackgroundMessage((payload) => {
  const { title, body, icon } = payload.notification || {};
  self.registration.showNotification(title || "Notification", {
    body: body || "",
    icon: icon || "/icon-192.png",
    data: payload.data || {},
  });
  console.log("payload", payload);
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification?.data?.click_action || "/";
  event.waitUntil(
    (async () => {
      const all = await clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });
      for (const c of all) {
        if ("url" in c && c.url.includes(url)) return c.focus();
      }
      return clients.openWindow(url);
    })(),
  );
});
