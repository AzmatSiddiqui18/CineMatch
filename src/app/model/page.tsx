import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Cpu, Database, Binary, Clock, Milestone, Code } from "lucide-react";
import modelStatsRaw from "@/data/model_stats.json";

interface ModelStats {
  dataset_size: number;
  vocab_size: number;
  top_k: number;
  training_time_seconds: number;
  last_trained: string;
}

const stats = modelStatsRaw as ModelStats;

export default function ModelPage() {
  return (
    <div className="relative min-h-screen flex flex-col bg-zinc-950 text-zinc-100 font-sans selection:bg-rose-500/30 selection:text-rose-200 overflow-hidden">
      {/* Subtle Background Glows */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full bg-rose-900/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-[400px] h-[400px] rounded-full bg-amber-900/5 blur-[120px] pointer-events-none" />

      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 z-10 w-full">
        {/* Header Title */}
        <div className="mb-12 border-b border-zinc-900 pb-8 text-center md:text-left">
          <span className="text-xs uppercase tracking-widest font-mono text-rose-500 font-bold">
            System Architecture & Evaluation
          </span>
          <h1 className="text-4xl font-extrabold text-white mt-1 mb-3">Model Analysis</h1>
          <p className="text-zinc-400 text-base max-w-3xl">
            A comprehensive breakdown of the content-based recommendation model powering CineMatch. Review our features, mathematical metrics, and the precomputed pipeline runtime.
          </p>
        </div>

        {/* Model Metrics Grid */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="bg-zinc-900/30 border border-zinc-900 rounded-2xl p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Dataset Size</span>
              <Database className="h-5 w-5 text-rose-500" />
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-white">{stats.dataset_size.toLocaleString()}</p>
              <p className="text-xs text-zinc-500 mt-1">Cleaned Movies</p>
            </div>
          </div>

          <div className="bg-zinc-900/30 border border-zinc-900 rounded-2xl p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Vocabulary</span>
              <Binary className="h-5 w-5 text-rose-500" />
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-white">{stats.vocab_size.toLocaleString()}</p>
              <p className="text-xs text-zinc-500 mt-1">Unique TF-IDF tokens</p>
            </div>
          </div>

          <div className="bg-zinc-900/30 border border-zinc-900 rounded-2xl p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Metric</span>
              <Cpu className="h-5 w-5 text-rose-500" />
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-white">Cosine Sim</p>
              <p className="text-xs text-zinc-500 mt-1">Term weights angle</p>
            </div>
          </div>

          <div className="bg-zinc-900/30 border border-zinc-900 rounded-2xl p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Execution</span>
              <Clock className="h-5 w-5 text-rose-500" />
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-white">{stats.training_time_seconds.toFixed(2)}s</p>
              <p className="text-xs text-zinc-500 mt-1">Offline training time</p>
            </div>
          </div>
        </section>

        {/* Feature Engineering Breakdown */}
        <section className="bg-zinc-900/20 border border-zinc-900 rounded-3xl p-8 md:p-10 mb-16">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Milestone className="h-5 w-5 text-rose-500" /> Feature Weighting Strategy
          </h2>
          <p className="text-zinc-400 text-sm leading-relaxed mb-6">
            In content-based recommendation systems, simple text concatenation can cause long plots (overviews) to dominate more specific indicators like director and genre names. To counter this, CineMatch implements a custom **weighted feature concatenation model**:
          </p>
          <div className="space-y-4 font-mono text-xs bg-zinc-950/60 p-5 rounded-2xl border border-zinc-900 text-zinc-300">
            <div>
              <span className="text-rose-400">weighted_features</span> = (
            </div>
            <div className="pl-6 text-zinc-400">
              plot_overview + <span className="text-zinc-500"># single weight</span>
            </div>
            <div className="pl-6 text-zinc-400">
              genre_list + genre_list + <span className="text-rose-400 font-bold"># double weight</span>
            </div>
            <div className="pl-6 text-zinc-400">
              keywords_list + <span className="text-zinc-500"># single weight</span>
            </div>
            <div className="pl-6 text-zinc-400">
              top_5_cast_members + <span className="text-zinc-500"># single weight</span>
            </div>
            <div className="pl-6 text-zinc-400">
              director_name + director_name <span className="text-rose-400 font-bold"># double weight</span>
            </div>
            <div>)</div>
          </div>
          <div className="mt-6 text-zinc-400 text-sm">
            Additionally, multi-word entities (like actor names `Tom Hanks` or genre tags `Science Fiction`) are automatically stripped of spaces to become unique individual tokens (`TomHanks` and `ScienceFiction`). This guarantees that matching actors/directors must match the exact person rather than merely the first name.
          </div>
        </section>

        {/* Mathematical Pipeline Code */}
        <section className="bg-zinc-900/20 border border-zinc-900 rounded-3xl p-8 md:p-10 mb-16">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Code className="h-5 w-5 text-rose-500" /> Pipeline Implementation (Python)
          </h2>
          <p className="text-zinc-400 text-sm leading-relaxed mb-6">
            The core ML calculation is performed offline in python using `scikit-learn`. The script vectorizes the movie feature document using Term Frequency-Inverse Document Frequency (TF-IDF) and computes the dot product (cosine similarity angle) between all vectors:
          </p>
          <pre className="bg-zinc-950/60 p-5 rounded-2xl border border-zinc-900 text-xs font-mono text-zinc-300 overflow-x-auto">
{`from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# 1. Transform text descriptors into TF-IDF vector matrix
tfidf = TfidfVectorizer(stop_words='english')
tfidf_matrix = tfidf.fit_transform(df['combined_features'])

# 2. Calculate the cosine similarity matrix (dot product of normalized vectors)
similarity_matrix = cosine_similarity(tfidf_matrix, tfidf_matrix)

# 3. For each movie, sort similarity indices and save top 10 matches
# Results are serialized to recommendations.json`}
          </pre>
        </section>

        {/* Evaluation and Training Meta */}
        <section className="border-t border-zinc-900 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-zinc-650">
          <span>Model Architecture: TF-IDF + Cosine Similarity Vector Angle</span>
          <span>Last Offline Training Run: {stats.last_trained}</span>
        </section>
      </main>

      <Footer />
    </div>
  );
}
