"use client";
import { useEffect } from "react";

export default function SwRegistrar() {
    useEffect(() => {
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker
                .register("/firebase-messaging-sw.js")
                .catch((e) => console.error("SW registration failed", e));
        }
    }, []);
    return null;
}
