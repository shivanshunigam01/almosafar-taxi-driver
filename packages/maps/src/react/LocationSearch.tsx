"use client";

import { useEffect, useState } from "react";
import type { MapPlace } from "../types";
import { useMapServices } from "./MapProvider";

export function LocationSearch({
  placeholder,
  onSelect,
  initialQuery = "",
  autoFocus,
}: {
  placeholder: string;
  onSelect: (place: MapPlace) => void;
  initialQuery?: string;
  autoFocus?: boolean;
}) {
  const { geocoding } = useMapServices();
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<MapPlace[]>(() =>
    geocoding.searchPresets("")
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const debounced = geocoding.createDebouncedSearch(
      (r) => {
        setResults(r.places);
        setLoading(false);
      },
      (msg) => {
        setError(msg);
        setLoading(false);
      }
    );
    setLoading(true);
    setError(null);
    debounced(query);
  }, [query, geocoding]);

  return (
    <div className="space-y-2">
      <input
        type="search"
        autoFocus={autoFocus}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base shadow-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20"
      />
      {loading && <p className="text-xs text-slate-500">Searching…</p>}
      {error && <p className="text-xs text-amber-700">{error}</p>}
      <ul className="max-h-56 overflow-y-auto rounded-xl border border-slate-100 bg-white shadow-sm">
        {results.map((place) => (
          <li key={`${place.label}-${place.geo.latitude}`}>
            <button
              type="button"
              className="w-full px-4 py-3 text-left text-sm hover:bg-slate-50"
              onClick={() => onSelect(place)}
            >
              {place.label}
              {place.source === "preset" && (
                <span className="ml-2 text-xs text-teal-700">Demo</span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
