"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2, Film } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface MovieSuggestion {
  id: number;
  title: string;
  release_date?: string;
  poster_path?: string;
  vote_average?: number;
}

export default function SearchBox() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<MovieSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close suggestions on clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search logic
  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      setOpen(false);
      return;
    }

    setLoading(true);
    setOpen(true);
    setSelectedIndex(-1);

    const handler = setTimeout(async () => {
      try {
        const { data, error } = await supabase
          .from("movies")
          .select("id, title, release_date, poster_path, vote_average")
          .ilike("title", `%${query}%`)
          .order("popularity", { ascending: false })
          .limit(8);

        if (error) {
          console.error("Error fetching suggestions:", error);
          setSuggestions([]);
        } else if (data) {
          setSuggestions(data);
        }
      } catch (err) {
        console.error("Unexpected error querying movies:", err);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [query]);

  const handleSelectMovie = (id: number) => {
    setOpen(false);
    setQuery("");
    router.push(`/movie/${id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        handleSelectMovie(suggestions[selectedIndex].id);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-xl mx-auto z-40">
      {/* Search Input Box */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          {loading ? (
            <Loader2 className="h-5 w-5 text-rose-500 animate-spin" />
          ) : (
            <Search className="h-5 w-5 text-zinc-400 group-focus-within:text-rose-500 transition-colors" />
          )}
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search for a movie (e.g. Interstellar, Inception)..."
          className="w-full pl-12 pr-4 py-4 bg-zinc-900/60 border border-zinc-800 focus:border-rose-500/50 rounded-2xl text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-rose-500/30 transition-all shadow-xl backdrop-blur-sm text-base"
        />
      </div>

      {/* Suggestion Dropdown */}
      {open && (query.trim().length >= 2) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl z-50 max-h-96 overflow-y-auto divide-y divide-zinc-900">
          {loading && suggestions.length === 0 ? (
            <div className="p-6 text-center text-zinc-500 text-sm flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-rose-500" />
              Searching movie library...
            </div>
          ) : suggestions.length === 0 ? (
            <div className="p-6 text-center text-zinc-500 text-sm">
              No matching movies found in CineMatch database.
            </div>
          ) : (
            suggestions.map((movie, index) => {
              const year = movie.release_date ? movie.release_date.split("-")[0] : "N/A";
              const isSelected = index === selectedIndex;
              return (
                <button
                  key={movie.id}
                  onClick={() => handleSelectMovie(movie.id)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full p-3 flex items-center gap-3 text-left transition-colors ${
                    isSelected ? "bg-zinc-800 text-white" : "bg-transparent text-zinc-300 hover:bg-zinc-900/50"
                  }`}
                >
                  {/* Poster Thumbnail */}
                  {movie.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                      alt={movie.title}
                      className="w-9 h-13 object-cover rounded-md bg-zinc-900 flex-shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = ""; // Fallback will trigger below
                      }}
                    />
                  ) : (
                    <div className="w-9 h-13 bg-zinc-850 rounded-md flex items-center justify-center text-zinc-600 flex-shrink-0">
                      <Film className="h-4 w-4" />
                    </div>
                  )}
                  
                  {/* Movie Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{movie.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-zinc-500">{year}</span>
                      {movie.vote_average ? (
                        <span className="text-xs text-amber-500 font-medium">
                          ★ {movie.vote_average.toFixed(1)}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
