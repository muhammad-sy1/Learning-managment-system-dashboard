"use client";

import { useState } from "react";

export default function PlaceSearch({
  onSelect,
}: {
  onSelect: (place: { lat: number; lng: number; name: string }) => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function search(text: string) {
    if (!text.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);

    const res = await fetch(
      "https://places.googleapis.com/v1/places:searchText",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!,
          "X-Goog-FieldMask": "places.displayName,places.location",
        },
        body: JSON.stringify({
          textQuery: text,
          regionCode: "SY",
          languageCode: "ar",
        }),
      }
    );

    const data = await res.json();
    setLoading(false);

    setResults(data.places ?? []);
  }

  function handleSelect(place: any) {
    const name = place.displayName?.text || "";
    const lat = place.location?.latitude;
    const lng = place.location?.longitude;

    onSelect({ name, lat, lng });

    setQuery(name);
    setResults([]);
  }

  return (
    <div className="relative space-y-2 px-2">
      <input
        className="w-full h-10 px-3 py-2 text-sm border border-input bg-background rounded-md ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        placeholder="ابحث عن منطقة…"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          search(e.target.value);
        }}
      />

      {loading && (
        <div className="absolute top-full left-0 right-0 mt-1 p-3 bg-popover text-popover-foreground border rounded-md shadow-md z-50">
          <div className="flex items-center justify-center space-x-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-sm">جاري البحث…</p>
          </div>
        </div>
      )}

      {results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-popover text-popover-foreground border rounded-md shadow-md max-h-60 overflow-auto z-50">
          {results.map((r, i) => (
            <div
              key={i}
              className="p-3 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors border-b last:border-b-0"
              onClick={() => handleSelect(r)}
            >
              {r.displayName?.text}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
