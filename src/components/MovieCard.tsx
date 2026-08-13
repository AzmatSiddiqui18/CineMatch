"use client";

import React from "react";
import Link from "next/link";
import { Star, Film } from "lucide-react";

interface MovieCardProps {
  id: number;
  title: string;
  release_date?: string;
  genres?: string[];
  vote_average?: number;
  poster_path?: string;
  similarity_score?: number;
}

export default function MovieCard({
  id,
  title,
  release_date,
  genres = [],
  vote_average = 0,
  poster_path,
  similarity_score,
}: MovieCardProps) {
  const year = release_date ? release_date.split("-")[0] : "N/A";
  const displayGenres = genres.slice(0, 2).join(" • ");

  return (
    <Link href={`/movie/${id}`} className="group flex flex-col h-full bg-zinc-900/40 border border-zinc-800/80 hover:border-rose-500/30 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-rose-500/5 hover:-translate-y-1">
      {/* Poster Container */}
      <div className="relative aspect-[2/3] bg-zinc-950 overflow-hidden w-full">
        {poster_path ? (
          <img
            src={`https://image.tmdb.org/t/p/w342${poster_path}`}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = ""; // Fallback to icon
            }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-zinc-600 gap-2">
            <Film className="h-10 w-10 text-zinc-700" />
            <span className="text-xs text-zinc-500">No Image Available</span>
          </div>
        )}
        
        {/* Similarity Score Overlay */}
        {similarity_score !== undefined && (
          <div className="absolute top-3 right-3 bg-rose-600 text-white text-[11px] font-bold px-2 py-1 rounded-full shadow-lg border border-rose-400/20 backdrop-blur-sm select-none">
            {(similarity_score * 100).toFixed(1)}% Match
          </div>
        )}
      </div>

      {/* Info Block */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-sm text-zinc-100 group-hover:text-white truncate line-clamp-1 group-hover:underline transition-all">
            {title}
          </h3>
          <p className="text-xs text-zinc-500 mt-1 truncate">{displayGenres || "Movie"}</p>
        </div>
        
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-900 text-xs">
          <span className="text-zinc-400 font-medium">{year}</span>
          
          <div className="flex items-center gap-1 text-amber-500">
            <Star className="h-3 w.5 fill-amber-500 text-amber-500" />
            <span className="font-semibold text-zinc-300">{vote_average.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
