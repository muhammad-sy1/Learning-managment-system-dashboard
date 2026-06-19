import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2, MapPin, Search, X } from "lucide-react";
import { useState } from "react";
import useSearchMap from "./hooks/useSearchMap";

interface SearchInputProps {
  onSelectPlace: (place: any) => void;
  markerPosition: { lat: number; lng: number };
}

export function SearchMapInput({
  onSelectPlace,
  markerPosition,
}: SearchInputProps) {
  const handleKeyPress = (e: React.KeyboardEvent) =>
    e.key === "Enter" && handleSearch();
  const { places, searchPlaces, loading } = useSearchMap();

  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    searchPlaces(searchQuery, markerPosition.lat, markerPosition.lng);
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Search className="h-5 w-5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            placeholder="ابحث عن موقع أو عنوان..."
            className="w-full border border-gray-300 rounded-lg p-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        <Button
          onClick={handleSearch}
          disabled={loading || !searchQuery.trim()}
          className="px-6 py-2 font-medium disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> جاري البحث...
            </>
          ) : (
            <>
              <Search className="h-4 w-4" /> بحث
            </>
          )}
        </Button>
      </div>

      {places.length > 0 && (isFocused || searchQuery) && (
        <div className="absolute z-10 w-full mt-1 border border-gray-200 rounded-lg bg-white shadow-xl max-h-60 overflow-auto">
          <div className="p-2 border-b border-gray-100 bg-gray-50">
            <p className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Search className="h-4 w-4" /> نتائج البحث ({places.length})
            </p>
          </div>
          {places.map((place) => (
            <div
              key={place.name + place.lat}
              className="p-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
              onClick={() => onSelectPlace(place)}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1 mr-3 text-blue-500">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 truncate">
                    {place.name}
                  </p>
                  {place.address && (
                    <p className="text-sm text-gray-500 mt-1 truncate">
                      {place.address}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {searchQuery &&
        places.length === 0 &&
        !loading &&
        (isFocused || searchQuery) && (
          <div className="absolute z-10 w-full mt-1 border border-gray-200 rounded-lg bg-white shadow-lg p-4 text-center text-gray-500">
            <AlertCircle className="h-10 w-10 mx-auto text-gray-300 mb-2" />
            <p>لم يتم العثور على نتائج لـ &quot;{searchQuery}&quot;</p>
            <p className="text-sm mt-1">حاول استخدام كلمات بحث مختلفة</p>
          </div>
        )}
    </div>
  );
}
