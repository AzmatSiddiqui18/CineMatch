import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchBox from "@/components/SearchBox";
import MovieCard from "@/components/MovieCard";
import { supabase } from "@/lib/supabase";
import { Film, Award, GitBranch, Binary, LineChart } from "lucide-react";

// Server component to fetch starting popular movies
async function getPopularMovies() {
  try {
    const { data, error } = await supabase
      .from("movies")
      .select("id, title, release_date, genres, vote_average, poster_path")
      .order("popularity", { ascending: false })
      .limit(10);

    if (error) {
      console.error("Database error loading starting popular movies:", error);
      return [];
    }
    return data || [];
  } catch (e) {
    console.error("Failed to load popular movies:", e);
    return [];
  }
}

export default async function Home() {
  const popularMovies = await getPopularMovies();

  return (
    <div className="relative min-h-screen flex flex-col bg-zinc-950 text-zinc-100 font-sans selection:bg-rose-500/30 selection:text-rose-200 overflow-hidden">
      {/* Subtle Background Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-rose-900/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-amber-900/5 blur-[120px] pointer-events-none" />

      <Navbar />

      <main className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-12 md:py-20 z-10 max-w-7xl mx-auto w-full">
        {/* Hero Section */}
        <section className="w-full text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 mb-6">
            Content-Based Recommendation Engine
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent leading-tight">
            Find your next <br />
            favorite movie.
          </h1>
          <p className="text-zinc-400 text-lg sm:text-xl leading-relaxed max-w-xl mx-auto mb-10">
            CineMatch analyzes metadata like genre, plot, director, and cast to match your movie taste using mathematical text similarities.
          </p>

          {/* Search Box */}
          <SearchBox />
        </section>

        {/* Popular Starting Movies Section */}
        {popularMovies.length > 0 && (
          <section className="w-full mb-20">
            <div className="flex items-center gap-2 mb-8 border-b border-zinc-900 pb-4">
              <Award className="h-5 w-5 text-rose-500" />
              <h2 className="text-xl font-bold text-white tracking-wide">Popular Starters</h2>
              <span className="text-xs text-zinc-500 ml-auto">Click a movie to view matches</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
              {popularMovies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  id={movie.id}
                  title={movie.title}
                  release_date={movie.release_date}
                  genres={movie.genres}
                  vote_average={movie.vote_average}
                  poster_path={movie.poster_path}
                />
              ))}
            </div>
          </section>
        )}

        {/* Explainability Pipeline Segment */}
        <section className="w-full max-w-4xl mx-auto bg-zinc-900/20 border border-zinc-900 rounded-3xl p-8 sm:p-12 backdrop-blur-sm">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold text-white mb-2">How CineMatch Works</h3>
            <p className="text-zinc-500 text-sm">Our offline ML pipeline runs content-based filtering in 5 steps</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-rose-500 mb-4 shadow-lg">
                <Film className="h-6 w-6" />
              </div>
              <h4 className="font-bold text-sm text-zinc-200 mb-1">01. Metadata</h4>
              <p className="text-xs text-zinc-500">Collect overview, cast, genres & keywords from TMDB.</p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-rose-500 mb-4 shadow-lg">
                <GitBranch className="h-6 w-6" />
              </div>
              <h4 className="font-bold text-sm text-zinc-200 mb-1">02. Engineering</h4>
              <p className="text-xs text-zinc-500">Concatenate details, weighting genres and crew heavily.</p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-rose-500 mb-4 shadow-lg">
                <Binary className="h-6 w-6" />
              </div>
              <h4 className="font-bold text-sm text-zinc-200 mb-1">03. TF-IDF</h4>
              <p className="text-xs text-zinc-500">Convert tokens into text TF-IDF vector representations.</p>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-rose-500 mb-4 shadow-lg">
                <LineChart className="h-6 w-6" />
              </div>
              <h4 className="font-bold text-sm text-zinc-200 mb-1">04. Cosine Sim</h4>
              <p className="text-xs text-zinc-500">Calculate similarity angles between movie vectors.</p>
            </div>

            {/* Step 5 */}
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-550 flex items-center justify-center text-white mb-4 shadow-lg shadow-rose-500/25">
                <Award className="h-6 w-6" />
              </div>
              <h4 className="font-bold text-sm text-zinc-200 mb-1">05. Recommendations</h4>
              <p className="text-xs text-zinc-500">Store and query the top 10 recommended matches.</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
