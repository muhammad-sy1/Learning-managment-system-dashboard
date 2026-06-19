import { useState } from "react";
import { SearchMapPlaces } from "../services/SearchMap";

export default function useSearchMap() {
  const [loading, setLoading] = useState(false);
  const [places, setPlaces] = useState<any[]>([]);

  const searchPlaces = async (query: string, lat: number, lng: number) => {
    try {
      setLoading(true);
      const res = await SearchMapPlaces(query, lat, lng);
      setPlaces(res);
    } finally {
      setLoading(false);
    }
  };

  return {
    places,
    loading,
    searchPlaces,
    
  };
}
