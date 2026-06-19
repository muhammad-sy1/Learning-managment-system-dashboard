"use client";

import React, { useEffect, useState } from "react";

declare global {
  interface Window {
    google: typeof google;
    initGoogleMap: () => void;
  }
}

type LoaderChildren =
  | React.ReactNode
  | ((loaded: boolean) => React.ReactNode);

export default function GoogleMapsLoader({ children }: { children: LoaderChildren }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Already loaded
    if (window.google && window.google.maps) {
      setLoaded(true);
      return;
    }

    // Prevent duplicate script
    if (document.getElementById("google-maps-script")) {
      window.initGoogleMap = () => setLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.id = "google-maps-script";
    script.src =
      `https://maps.googleapis.com/maps/api/js?key=` +
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY +
      `&libraries=places,drawing&callback=initGoogleMap`;

    script.async = true;
    script.defer = true;

    window.initGoogleMap = () => setLoaded(true);
    script.onerror = () => setLoaded(false);

    document.body.appendChild(script);
  }, []);

  if (!loaded) return <div>Loading Google Maps…</div>;

  // ✅ supports both:
  // <GoogleMapsLoader>{(loaded)=>...}</GoogleMapsLoader>
  // <GoogleMapsLoader><SomeComponent/></GoogleMapsLoader>
  return (
    <>
      {typeof children === "function"
        ? (children as (loaded: boolean) => React.ReactNode)(true)
        : children}
    </>
  );
}
