import React from "react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-zinc-900 bg-zinc-950 text-zinc-400 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start gap-2">
          <span className="font-bold text-lg text-white tracking-wider">CineMatch</span>
          <span className="text-xs text-zinc-500">
            Content-Based Movie Recommendation System — Powered by Machine Learning.
          </span>
        </div>
        
        <div className="flex flex-col items-center md:items-end gap-3 max-w-md text-center md:text-right">
          <div className="flex items-center gap-3 justify-center md:justify-end">
            {/* Simple TMDB Attribution Logo/Mark using a styled div */}
            <span className="text-[10px] bg-sky-500 text-zinc-950 font-bold px-2 py-0.5 rounded tracking-wide">
              TMDB
            </span>
            <p className="text-xs text-zinc-500">
              This product uses the TMDB API but is not endorsed or certified by TMDB.
            </p>
          </div>
          <span className="text-xs text-zinc-600">
            &copy; {new Date().getFullYear()} CineMatch. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}
