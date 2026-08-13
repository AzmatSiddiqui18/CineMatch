import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Star, Film, Calendar, Users, Briefcase } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchBox from "@/components/SearchBox";
import MovieCard from "@/components/MovieCard";
import { supabase } from "@/lib/supabase";
import recommendationsRaw from "@/data/recommendations.json";

const recommendations = recommendationsRaw as Record<string, Array<{ id: number; score: number }>>;

interface MoviePageProps {
  params: {
    id: string;
  };
}

async function getMovieData(id: number) {
  try {
    const { data, error } = await supabase
      .from("movies")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      console.error(`Error loading movie ${id}:`, error);
      return null;
    }
    return data;
  } catch (e) {
    console.error(`Failed to fetch movie data: ${e}`);
    return null;
  }
}

interface RecommendedMovie {
  id: number;
  title: string;
  release_date?: string;
  genres?: string[];
  vote_average?: number;
  poster_path?: string;
  similarity_score: number;
}

async function getRecommendedMovies(selectedId: string): Promise<RecommendedMovie[]> {
  const recommendedList = recommendations[selectedId];
  if (!recommendedList || recommendedList.length === 0) {
    return [];
  }

  const ids = recommendedList.map((r) => r.id);

  try {
    // Fetch all recommended movies in one single batch query
    const { data, error } = await supabase
      .from("movies")
      .select("id, title, release_date, genres, vote_average, poster_path")
      .in("id", ids);

    if (error || !data) {
      console.error("Error loading recommended movies metadata:", error);
      return [];
    }

    // Map the database data to a quick-lookup map
    const movieMap = new Map(data.map((m) => [m.id, m]));

    // Sort the list exactly in order of cosine similarity score (descending)
    return recommendedList
      .map((rec) => {
        const movieMeta = movieMap.get(rec.id);
        if (!movieMeta) return null;
        return {
          ...movieMeta,
          similarity_score: rec.score,
        };
      })
      .filter((m) => m !== null) as RecommendedMovie[];
  } catch (e) {
    console.error("Failed to query recommended movies:", e);
    return [];
  }
}

export default async function MoviePage({ params }: MoviePageProps) {
  const movieId = parseInt(params.id, 10);
  if (isNaN(movieId)) {
    return notFound();
  }

  const movie = await getMovieData(movieId);
  if (!movie) {
    return notFound();
  }

  const recommendedMovies = await getRecommendedMovies(params.id);
  const releaseYear = movie.release_date ? movie.release_date.split("-")[0] : "N/A";

  return (
    <div className="relative min-h-screen flex flex-col bg-zinc-950 text-zinc-100 font-sans selection:bg-rose-500/30 selection:text-rose-200">
      <Navbar />

      {/* Dynamic Cinematic Header Backdrop */}
      <div className="relative w-full h-[50vh] md:h-[65vh] overflow-hidden bg-zinc-950">
        {movie.backdrop_path ? (
          <img
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt={movie.title}
            className="w-full h-full object-cover opacity-35 filter blur-[2px]"
          />
        ) : (
          <div className="w-full h-full bg-zinc-900/60" />
        )}
        {/* Ambient Dark Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-transparent to-zinc-950/50" />
      </div>

      {/* Movie Details Block */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-[25vh] md:-mt-[35vh] relative z-10 w-full mb-16">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Movie Poster */}
          <div className="w-48 sm:w-64 rounded-2xl overflow-hidden shadow-2xl border border-zinc-800 bg-zinc-900 flex-shrink-0 mx-auto md:mx-0">
            {movie.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="w-full aspect-[2/3] object-cover"
              />
            ) : (
              <div className="w-full aspect-[2/3] flex flex-col items-center justify-center text-zinc-600 gap-2">
                <Film className="h-12 w-12 text-zinc-700" />
                <span className="text-sm">No Poster</span>
              </div>
            )}
          </div>

          {/* Metadata details panel */}
          <div className="flex-1 text-center md:text-left">
            <Link 
              href="/" 
              className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-rose-500 text-sm font-medium mb-6 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Search
            </Link>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
              {movie.title}
            </h1>

            {/* Tags and Badges */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-6 text-sm text-zinc-400">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-zinc-500" />
                {releaseYear}
              </span>
              
              {movie.vote_average ? (
                <span className="flex items-center gap-1 text-amber-500 font-bold bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                  <Star className="h-4 w-4 fill-amber-500" />
                  {movie.vote_average.toFixed(1)}
                </span>
              ) : null}

              {movie.genres && movie.genres.length > 0 && (
                <span className="text-zinc-500">•</span>
              )}

              <div className="flex flex-wrap gap-1.5 justify-center">
                {movie.genres?.map((genre: string) => (
                  <span 
                    key={genre}
                    className="px-2.5 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-xs text-zinc-300"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>

            {/* Overview */}
            <div className="mb-8">
              <h2 className="text-sm uppercase tracking-wider text-zinc-500 font-bold mb-2">Overview</h2>
              <p className="text-zinc-300 text-base leading-relaxed max-w-3xl">
                {movie.overview}
              </p>
            </div>

            {/* Cast and Crew info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-zinc-900 max-w-2xl text-left">
              {movie.director && (
                <div>
                  <h3 className="text-xs uppercase tracking-wider text-zinc-500 font-bold mb-1.5 flex items-center gap-1.5">
                    <Briefcase className="h-3.5 w-3.5" /> Director
                  </h3>
                  <p className="text-sm font-semibold text-zinc-200">{movie.director}</p>
                </div>
              )}
              {movie.cast_members && movie.cast_members.length > 0 && (
                <div>
                  <h3 className="text-xs uppercase tracking-wider text-zinc-500 font-bold mb-1.5 flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5" /> Top Cast
                  </h3>
                  <p className="text-sm font-semibold text-zinc-200 truncate">
                    {movie.cast_members.slice(0, 4).join(", ")}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recommendation Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mb-20 border-t border-zinc-900 pt-12">
        <div className="mb-8">
          <span className="text-xs uppercase tracking-widest font-mono text-rose-500 font-bold">
            Recommendation Pipeline Results
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 mb-2">
            Because you liked {movie.title}
          </h2>
          <p className="text-zinc-500 text-sm max-w-2xl">
            These movies are recommended using cosine similarity from our offline content-based model, analyzing similarities in plot summaries, genres, keywords, cast, and directors.
          </p>
        </div>

        {recommendedMovies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {recommendedMovies.map((recMovie) => (
              <MovieCard
                key={recMovie.id}
                id={recMovie.id}
                title={recMovie.title}
                release_date={recMovie.release_date}
                genres={recMovie.genres}
                vote_average={recMovie.vote_average}
                poster_path={recMovie.poster_path}
                similarity_score={recMovie.similarity_score}
              />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-zinc-900/10 border border-zinc-900 rounded-2xl text-zinc-500">
            No precomputed recommendations available for this film.
          </div>
        )}
      </section>

      {/* Continuation Search Hub */}
      <section className="max-w-xl mx-auto px-4 w-full mb-24 text-center">
        <h3 className="text-zinc-400 text-sm font-medium mb-4">Want to find recommendations for another movie?</h3>
        <SearchBox />
      </section>

      <Footer />
    </div>
  );
}
