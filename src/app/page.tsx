import React from "react";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col justify-between items-center overflow-hidden bg-[#09090b] font-[family-name:var(--font-geist-sans)] text-[#fafafa] px-4 py-8 md:px-8 md:py-12">
      {/* Cinematic Ambient Background Glows */}
      <div className="absolute top-[-10%] left-[-20%] w-[60%] h-[60%] rounded-full bg-rose-900/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-20%] w-[60%] h-[60%] rounded-full bg-violet-900/10 blur-[120px] pointer-events-none" />
      
      {/* Header / Logo */}
      <header className="w-full max-w-5xl flex justify-between items-center z-10">
        <div className="flex items-center gap-2 font-bold text-xl tracking-wider select-none bg-gradient-to-r from-rose-500 to-amber-500 bg-clip-text text-transparent">
          CineMatch
        </div>
        <div className="flex items-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            Coming Soon
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-2xl flex-1 flex flex-col justify-center items-center py-16 z-10">
        <div className="relative group w-full p-8 md:p-12 rounded-3xl border border-white/5 bg-zinc-900/40 backdrop-blur-xl shadow-2xl flex flex-col items-center text-center">
          {/* Decorative Film/AI Icon */}
          <div className="mb-8 w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 p-0.5 shadow-lg shadow-rose-500/20">
            <div className="w-full h-full rounded-[14px] bg-[#09090b] flex items-center justify-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={1.5} 
                className="w-8 h-8 text-rose-400"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z" 
                />
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="m15.75 10.5-6 3.75v-7.5l6 3.75Z" 
                />
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M7.5 3.75v16.5M16.5 3.75v16.5M3.75 7.5h16.5M3.75 12h16.5M3.75 16.5h16.5" 
                />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 select-none">
            <span className="bg-gradient-to-r from-white via-neutral-100 to-neutral-400 bg-clip-text text-transparent">
              Cine
            </span>
            <span className="bg-gradient-to-r from-rose-500 to-amber-500 bg-clip-text text-transparent">
              Match
            </span>
          </h1>

          {/* Subtitle */}
          <h2 className="text-lg md:text-2xl font-medium text-neutral-300 mb-6 max-w-md">
            An AI-powered movie recommendation system.
          </h2>

          {/* Description */}
          <p className="text-sm md:text-base text-neutral-400 leading-relaxed max-w-lg mb-8">
            CineMatch uses machine learning to recommend movies based on content similarity. Discover your next favorite film with recommendations tailored to plot connections, thematic patterns, and storytelling style.
          </p>

          {/* Minimal Interaction (Notify Me/Sign Up Placeholder) */}
          <div className="w-full max-w-sm flex flex-col sm:flex-row gap-2">
            <input 
              type="email" 
              placeholder="Enter your email for updates..." 
              disabled 
              className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-sm text-neutral-400 placeholder:text-neutral-600 focus:outline-none cursor-not-allowed select-none"
            />
            <button 
              disabled
              className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-white/10 text-neutral-400 border border-white/5 cursor-not-allowed select-none"
            >
              Notify Me
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-5xl flex flex-col sm:flex-row justify-between items-center gap-4 py-4 border-t border-white/5 z-10">
        <span className="text-xs text-neutral-500 select-none">
          CineMatch — Machine Learning Project
        </span>
        <span className="text-xs text-neutral-600 select-none">
          © {new Date().getFullYear()} CineMatch. All rights reserved.
        </span>
      </footer>
    </div>
  );
}
