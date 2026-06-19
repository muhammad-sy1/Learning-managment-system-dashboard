"use client";

import { Button } from "@/components/ui/button";
import { IZone } from "@/modules/provinces/types/zone";
import { useJsApiLoader } from "@react-google-maps/api";
import { Loader2, MapPin } from "lucide-react";
import { useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { SearchMapInput } from "./SearchMapInput";

export function pointInZone(
  lat: number,
  lng: number,
  polygon: Array<{ lat: number; lng: number }>,
) {
  return google.maps.geometry.poly.containsLocation(
    new google.maps.LatLng(lat, lng),
    new google.maps.Polygon({ paths: polygon }),
  );
}

interface GoogleMapPickerProps {
  zones: IZone[];
}

const DEFAULT_CENTER = { lat: 33.6058232, lng: 36.310409 };

interface LocationFields {
  store_latitude: string;
  store_longitude: string;
}

export default function GoogleMapPicker({ zones }: GoogleMapPickerProps) {
  const {
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext<LocationFields>();

  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);

  const [isLocating, setIsLocating] = useState(false);
  const [outOfZone, setOutOfZone] = useState(false);
  const [locationChanged, setLocationChanged] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!,
    libraries: ["geometry"],
  });

  /* ================= HELPERS ================= */
  const resolveZone = (lat: number, lng: number) =>
    zones.find((z) => pointInZone(lat, lng, z.polygon));

  const handleIdle = () => {
    if (!mapRef.current || !markerRef.current) return;

    const center = mapRef.current.getCenter();
    if (!center) return;

    const lat = center.lat();
    const lng = center.lng();

    markerRef.current.setPosition({ lat, lng });

    const zone = resolveZone(lat, lng);
    setOutOfZone(!zone);

    const originalLat = getValues("store_latitude");
    const originalLng = getValues("store_longitude");

    if (
      lat.toFixed(6) !== Number(originalLat)?.toFixed(6) ||
      lng.toFixed(6) !== Number(originalLng)?.toFixed(6)
    ) {
      setLocationChanged(true);
    } else {
      setLocationChanged(false);
    }
  };

  const confirmLocation = async () => {
    if (!mapRef.current) return;

    const center = mapRef.current.getCenter();
    if (!center) return;

    const lat = center.lat();
    const lng = center.lng();

    const zone = resolveZone(lat, lng);
    if (!zone) {
      toast.error("الموقع خارج نطاق الخدمة");
      return;
    }

    setIsConfirming(true);
    await new Promise((res) => setTimeout(res, 800)); // Loader وهمي

    setValue("store_latitude", String(lat), { shouldDirty: true });
    setValue("store_longitude", String(lng), { shouldDirty: true });
    toast.success("تم تحديد الموقع");

    setIsConfirming(false);
    setLocationChanged(false);
  };

  const initMap = (el: HTMLDivElement) => {
    if (!el || mapRef.current) return;

    const map = new google.maps.Map(el, {
      center: DEFAULT_CENTER,
      zoom: 20,
      gestureHandling: "greedy",
      minZoom: 14,
      maxZoom: 20,
      streetViewControl: true,
      mapTypeControl: true,
      fullscreenControl: true,
    });

    mapRef.current = map;

    markerRef.current = new google.maps.Marker({
      map,
      position: DEFAULT_CENTER,
      clickable: false,
      optimized: true,
    });

    map.addListener("idle", handleIdle);

    zones.forEach(
      (z) =>
        new google.maps.Polygon({
          paths: z.polygon,
          map,
          strokeColor: "#f54900",
          fillColor: "#f54900",
          strokeOpacity: 0.6,
          strokeWeight: 1,
          fillOpacity: 0.09,
        }),
    );

    const lat = getValues("store_latitude");
    const lng = getValues("store_longitude");
    if (lat && lng) {
      map.panTo({ lat: +lat, lng: +lng });
      markerRef.current.setPosition({ lat: +lat, lng: +lng });
    }
  };

  const handleSelectPlace = (place: any) => {
    if (!mapRef.current) return;

    mapRef.current.panTo({
      lat: place.lat,
      lng: place.lng,
    });

    mapRef.current.setZoom(16);
  };

  const goToCurrentLocation = () => {
    if (!navigator.geolocation || !mapRef.current) {
      toast.error("المتصفح لا يدعم تحديد الموقع");
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        mapRef.current!.panTo({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        mapRef.current!.setZoom(20);
        setIsLocating(false);
      },
      () => {
        toast.error("تعذر تحديد موقعك");
        setIsLocating(false);
      },
      { enableHighAccuracy: true },
    );
  };

  if (!isLoaded) {
    return (
      <div className="h-64 flex items-center justify-center">
        <Loader2 className="animate-spin mr-2" />
        جاري تحميل الخريطة...
      </div>
    );
  }

  return (
    <>
      {/* <PlaceSearch onSelect={handleSelectPlace} /> */}
      <SearchMapInput
        onSelectPlace={handleSelectPlace}
        markerPosition={{
          lat: mapRef.current?.getCenter()?.lat() ?? DEFAULT_CENTER.lat,
          lng: mapRef.current?.getCenter()?.lng() ?? DEFAULT_CENTER.lng,
        }}
      />
      <div className="relative h-[400px] w-full rounded-lg overflow-hidden border shadow">
        <div ref={initMap} className="w-full h-full" />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div
            className={`h-1 w-1 rounded-full border-4 ${
              outOfZone ? "border-black" : "border-red-500"
            } bg-white shadow-lg`}
          />
        </div>
      </div>

      {outOfZone && (
        <p className="text-sm text-red-500 mt-2">
          الموقع الحالي خارج نطاق الخدمة
        </p>
      )}

      {(errors.store_latitude || errors.store_longitude) && (
        <p className="text-sm text-red-500 mt-2">
          {errors.store_latitude?.message || errors.store_longitude?.message}
        </p>
      )}

      {/* زر تأكيد الموقع */}
      {locationChanged && !isConfirming && (
        <Button
          type="button"
          className="w-full mt-4"
          onClick={confirmLocation}
          disabled={outOfZone}
        >
          تأكيد الموقع
        </Button>
      )}

      {isConfirming && (
        <Button type="button" className="w-full mt-4" disabled>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          جاري تأكيد الموقع...
        </Button>
      )}

      <Button
        type="button"
        variant="outline"
        onClick={goToCurrentLocation}
        className="w-full mt-2"
        disabled={isLocating}
      >
        {isLocating ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            جاري تحديد الموقع...
          </>
        ) : (
          <>
            <MapPin className="h-4 w-4 mr-2" />
            تحديد موقعي الحالي
          </>
        )}
      </Button>
    </>
  );
}
