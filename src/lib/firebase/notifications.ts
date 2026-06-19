// app/_lib/notifications.ts (client)
"use client";

import { getToken, onMessage } from "firebase/messaging";
import { getMessagingIfSupported } from "./firebase";

// export async function ensureFcmToken(): Promise<string | null> {
//   if (typeof window === "undefined") return null;
//   const permission = await Notification.requestPermission();
//   if (permission !== "granted") return null;

// const messaging = await getBrowserMessaging();
// if (!messaging) return null;

//   // IMPORTANT: use your public VAPID key
//   const token = await getToken(messaging, {
//     vapidKey: process.env.NEXT_PUBLIC_FB_VAPID_KEY,
//     serviceWorkerRegistration: await navigator.serviceWorker.ready,
//   }).catch((e) => {
//     console.error("getToken error", e);
//     return null;
//   });

//   return token;
// }
const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY!;

export async function ensureFcmToken(): Promise<string | null> {
  const messaging = await getMessagingIfSupported();
  if (!messaging) {
    console.log("⚠️ Firebase Messaging not supported");
    return null;
  }

  try {
    let registration = await navigator.serviceWorker.getRegistration(
      "/firebase-messaging-sw.js",
    );

    if (!registration) {
      registration = await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js",
      );
    }

    // console.log("✅ Using SW registration:", registration);

    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    // console.log("🔥 FCM token:", token);
    return token || null;
  } catch (err) {
    console.log("❌ Error getting FCM token:", err);
    return null;
  }
}

// export async function onForegroundMessage(
//   handler: (payload: import("firebase/messaging").MessagePayload) => void,
// ) {
//   const messaging = await getBrowserMessaging();
//   if (!messaging) return;
//   onMessage(messaging, handler);
// }

export async function onForegroundMessage(
  cb: (payload: any) => void,
): Promise<void> {
  const messaging = await getMessagingIfSupported();
  if (!messaging) return;

  onMessage(messaging, cb);
}
