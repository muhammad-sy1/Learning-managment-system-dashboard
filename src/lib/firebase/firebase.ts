// lib/firebase.ts
import { getApp, getApps, initializeApp } from "firebase/app";
import { getMessaging, isSupported, Messaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FB_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FB_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FB_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FB_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FB_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FB_APP_ID!,
};

export const firebaseApp = getApps().length
  ? getApp()
  : initializeApp(firebaseConfig);

// Lazy accessors so you don’t crash on SSR:
// export async function getBrowserMessaging() {
//   if (typeof window === "undefined") return null;
//   const supported = await isSupported().catch(() => false);
//   if (!supported) return null;
//   return getMessaging(firebaseApp);
// }

let messagingPromise: Promise<Messaging | null> | null = null;

export function getMessagingIfSupported() {
  if (!messagingPromise) {
    messagingPromise = isSupported()
      .then((ok) => (ok ? getMessaging(firebaseApp) : null))
      .catch(() => null);
  }
  return messagingPromise;
}
