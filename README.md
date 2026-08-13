# CineMatch — Content-Based Movie Recommendation System

CineMatch is a movie recommendation web application powered by a real, content-based machine learning pipeline (TF-IDF + Cosine Similarity) that runs offline, paired with a modern Next.js frontend with Supabase integration.

---

## Features

- **Dynamic Search Hub**: Debounced client-side movie searching querying our database.
- **Cinematic Detail Display**: Immersive layout displaying full movie info including poster, backdrop, overview, ratings, director, and top cast.
- **Precomputed Recommendations**: Shows 10 recommended movies based on cosine similarity, accompanied by actual similarity match percentages (e.g. `91.4% Match`).
- **Interactive Model Analysis Page**: Evaluation overview displaying dataset size, unique vocabulary size, processing times, and explanations of our feature engineering.
- **TMDB Attribution**: Clear alignment and compliance with TMDB's developer requirements.

---

## System Architecture

```
                 TMDB API
                    │
                    ▼
          Python Offline Pipeline (collect_data.py)
                    │
                    ▼
          Movie Dataset (movies_cleaned.json)
                    │
                    ▼
            Feature Engineering (train.py)
                    │
                    ▼
                 TF-IDF
                    │
                    ▼
           Cosine Similarity
                    │
                    ▼
        Top-10 Recommendations
                    │
                    ▼
       Lightweight JSON Artifact (recommendations.json)
                    │
                    ▼
                  Git
                    │
                    ▼
             Next.js / Vercel
                    │
             ┌──────┴──────┐
             ▼             ▼
         Supabase      Recommendation
        Movie Data        Artifact
             │             │
             └──────┬──────┘
                    ▼
                CineMatch Frontend
```

- **ML Pipeline (Offline)**: Python scripts collect TMDB metadata, engineer text feature documents, fit a TF-IDF vectorizer, compute cosine similarity, and serialize top-10 recommended movie mappings to a static JSON file.
- **Production Server (Next.js/Vercel)**: Zero heavy ML computations or Python running at runtime. Renders fast, pre-computed recommendations instantly by looking up mappings and retrieving metadata from Supabase.

---

## Machine Learning Approach

CineMatch uses **Content-Based Filtering** to recommend movies:
1. **Feature Engineering**: For each movie, we combine `overview`, `genres` (weighted 2x), `keywords`, `cast_members` (top 5), and `director` (weighted 2x) into a single textual document.
2. **Space Stripping**: Names (e.g., `Tom Hanks` -> `TomHanks`) and multi-word genres (e.g., `Science Fiction` -> `ScienceFiction`) are space-stripped to treat them as distinct tokens, preventing partial name matching.
3. **TF-IDF Vectorization**: Text descriptors are converted into numerical term frequency-inverse document frequency vector representations.
4. **Cosine Similarity**: The cosine angle between movie vectors is calculated to measure how similar two movies are based on plot and crew details.

---

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Lucide Icons
- **Database**: Supabase PostgreSQL
- **Data Source**: TMDB API
- **Machine Learning**: Python, pandas, NumPy, scikit-learn

---

## Environment Variables

Create a `.env.local` file in the project root:

```env
# TMDB API Read Access Token (Bearer Token)
TMDB_API_READ_ACCESS_TOKEN=your_tmdb_read_access_token

# Supabase API (Client-side)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Supabase Service Role Key (ONLY used offline for seeding)
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

*Ensure `.env.local` is ignored by Git to secure your secrets.*

---

## Local Development

### 1. Database Setup
1. Create a project in [Supabase](https://supabase.com/).
2. Run the SQL schema from [supabase/schema.sql](./supabase/schema.sql) in the **SQL Editor** of your Supabase dashboard.

### 2. Run the Offline ML Pipeline
Follow the steps in [ml/README.md](./ml/README.md) to collect data, compute similarity recommendations, and seed the Supabase database.

### 3. Run the Next.js Frontend
Once the database is populated and `recommendations.json` is generated:

```bash
# Install frontend dependencies
npm install

# Run the local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application locally.

---

## Vercel Deployment

Deploy the Next.js app to Vercel.
1. Connect your repository to Vercel.
2. Configure environment variables in the Vercel Project Settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Deploy! The precomputed recommendations artifact (`src/data/recommendations.json`) will compile statically, enabling instant loads.

---

## TMDB Attribution

This product uses the TMDB API but is not endorsed or certified by TMDB.
All movie metadata and images are sourced from [The Movie Database (TMDB)](https://www.themoviedb.org/).
