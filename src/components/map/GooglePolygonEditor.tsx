"use client";

import { useEffect, useRef } from "react";

type LatLng = { lat: number; lng: number };

interface Props {
  loaded: boolean;
  center: LatLng;
  polygon: LatLng[];
  onChange: (points: LatLng[]) => void;
}

const EPS = 1e-7;
function samePoints(a: LatLng[], b: LatLng[]) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (Math.abs(a[i].lat - b[i].lat) > EPS) return false;
    if (Math.abs(a[i].lng - b[i].lng) > EPS) return false;
  }
  return true;
}

export default function GooglePolygonEditor({
  loaded,
  center,
  polygon,
  onChange,
}: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const map = useRef<google.maps.Map | null>(null);

  const drawingManager = useRef<google.maps.drawing.DrawingManager | null>(null);
  const activePolygon = useRef<google.maps.Polygon | null>(null);

  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const syncingFromProps = useRef(false);
  const pathListeners = useRef<google.maps.MapsEventListener[]>([]);
  const dmListener = useRef<google.maps.MapsEventListener | null>(null);

  const hasMaps = () =>
    typeof window !== "undefined" && !!(window as any).google?.maps;

  const hasDrawing = () => hasMaps() && !!(window as any).google?.maps?.drawing;

  const clearPathListeners = () => {
    pathListeners.current.forEach((l) => google.maps.event.removeListener(l));
    pathListeners.current = [];
  };

  const bindPolygon = (poly: google.maps.Polygon) => {
    clearPathListeners();

    activePolygon.current = poly;

    poly.setOptions({
      editable: true,
      clickable: true,
      geodesic: false,
      zIndex: 999,
      strokeWeight: 5, // أسهل للمسك
    });

    const path = poly.getPath?.();
    if (!path) return;

    const emit = () => {
      if (syncingFromProps.current) return;
      const arr = path.getArray?.();
      if (!arr) return;
      onChangeRef.current(arr.map((p) => ({ lat: p.lat(), lng: p.lng() })));
    };

    pathListeners.current = [
      google.maps.event.addListener(path, "insert_at", emit),
      google.maps.event.addListener(path, "set_at", emit),
      google.maps.event.addListener(path, "remove_at", emit),
    ];

    emit();
  };

  // Init map once
  useEffect(() => {
    if (!loaded) return;
    if (!mapRef.current) return;
    if (map.current) return;
    if (!hasMaps()) return;

    map.current = new google.maps.Map(mapRef.current, {
      center,
      zoom: 14,
      clickableIcons: false,
      gestureHandling: "greedy",
      draggableCursor: "grab",
      draggingCursor: "grabbing",
    });
  }, [loaded]);

  // Recenter
  useEffect(() => {
    if (!map.current) return;
    map.current.setCenter(center);
  }, [center]);

  // Setup DrawingManager
  useEffect(() => {
    if (!loaded) return;
    if (!map.current) return;
    if (drawingManager.current) return;
    if (!hasDrawing()) return;

    drawingManager.current = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.POLYGON,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [google.maps.drawing.OverlayType.POLYGON],
      },
      polygonOptions: {
        editable: true,
        clickable: true,
        fillOpacity: 0.35,
        strokeColor: "#FF0000",
        strokeWeight: 5,
        zIndex: 999,
      },
    });

    drawingManager.current.setMap(map.current);

    dmListener.current = google.maps.event.addListener(
      drawingManager.current,
      "polygoncomplete",
      (poly: google.maps.Polygon) => {
        if (activePolygon.current) {
          activePolygon.current.setMap(null);
          activePolygon.current = null;
        }

        bindPolygon(poly);

        // وقف الرسم وخبّي أدواته حتى يصير السحب سهل
        drawingManager.current?.setDrawingMode(null);
        drawingManager.current?.setOptions({ drawingControl: false });
      },
    );

    return () => {
      if (dmListener.current) {
        google.maps.event.removeListener(dmListener.current);
        dmListener.current = null;
      }
    };
  }, [loaded]);

  // Sync external polygon -> path
  useEffect(() => {
    if (!map.current) return;
    if (!hasMaps()) return;
    if (!polygon || polygon.length < 3) return;

    if (!activePolygon.current) {
      const polyObj = new google.maps.Polygon({
        paths: polygon,
        editable: true,
        clickable: true,
        geodesic: false,
        zIndex: 999,
        strokeWeight: 5,
        fillOpacity: 0.35,
        strokeColor: "#FF0000",
        map: map.current,
      });

      bindPolygon(polyObj);
      return;
    }

    const path = activePolygon.current.getPath?.();
    if (!path) return;

    const currentArr = path.getArray?.();
    if (!currentArr) return;

    const current = currentArr.map((p) => ({ lat: p.lat(), lng: p.lng() }));
    const next = polygon;

    if (samePoints(current, next)) return;

    syncingFromProps.current = true;

    path.clear?.();
    for (const pt of next) {
      path.push(new google.maps.LatLng(pt.lat, pt.lng));
    }

    queueMicrotask(() => {
      syncingFromProps.current = false;
    });
  }, [polygon]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (!hasMaps()) return;

      clearPathListeners();

      if (dmListener.current) {
        google.maps.event.removeListener(dmListener.current);
        dmListener.current = null;
      }

      activePolygon.current?.setMap(null);
      activePolygon.current = null;

      drawingManager.current?.setMap(null);
      drawingManager.current = null;

      map.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={mapRef} className="w-full h-[450px] border rounded" />;
}
