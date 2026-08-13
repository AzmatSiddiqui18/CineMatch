import React from "react";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="font-bold text-2xl tracking-wider bg-gradient-to-r from-rose-500 to-amber-500 bg-clip-text text-transparent group-hover:opacity-95 transition-opacity">
            CineMatch
          </span>
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded border border-rose-500/30 text-rose-400 bg-rose-500/5 select-none">
            ML
          </span>
        </Link>
        <div className="flex items-center gap-6">
          <Link 
            href="/" 
            className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
          >
            Search
          </Link>
          <Link 
            href="/model" 
            className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
          >
            Model Analysis
          </Link>
        </div>
      </div>
    </nav>
  );
}
