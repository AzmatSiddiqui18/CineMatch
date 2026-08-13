# CineMatch — Machine Learning Pipeline (Offline)

This directory contains the Python scripts for data collection, cleaning, feature engineering, vector representation (TF-IDF), similarity computing (Cosine Similarity), and seeding the Supabase database.

## Pipeline Architecture

```
        TMDB API
           │
           ▼
    collect_data.py   ──► [movies_cleaned.json]
           │
           ├─────────────────────────┐
           ▼                         ▼
        train.py              load_supabase.py
           │                         │
           ▼                         ▼
[recommendations.json]           Supabase DB
```

1. **`collect_data.py`**: Fetches movies concurrently from TMDB's discovery API. Filters for high-quality English releases (minimum 50 votes) and pulls credits, keywords, genres, and runtimes.
2. **`train.py`**: Combines cleaned text metadata, fits a TF-IDF vectorizer, computes cosine similarity angles between movies, and exports the top-10 recommended movie mappings to a lightweight JSON artifact.
3. **`load_supabase.py`**: Upserts the cleaned movie records into the Supabase database in batches.

---

## Getting Started (Offline Setup)

### 1. Install Python Dependencies
Ensure you have Python 3.10+ installed. Install the required Python packages into a virtual environment:

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment (Windows)
venv\Scripts\activate

# Install packages
pip install -r requirements.txt
```

### 2. Set Up Credentials
Add the following credentials to your `.env.local` file in the root project folder:

```env
TMDB_API_READ_ACCESS_TOKEN=your_bearer_token
NEXT_PUBLIC_SUPABASE_URL=your_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_secret
```

*Note: The `SUPABASE_SERVICE_ROLE_KEY` bypasses Row-Level Security to write movie metadata and should never be exposed in client code or checked into Git.*

---

## Running the Pipeline

### Step 1: Run Data Collection
Start by collecting movie details from TMDB. You can run in test mode first or go straight to the full dataset:

```bash
# Test Mode: Fetch only 150 movies
python collect_data.py --limit 150

# Full Production Mode: Fetch ~5,000 movies
python collect_data.py --limit 5000
```
This saves the output locally to `data/movies_cleaned.json`.

### Step 2: Compute Recommendations
Generate the content-based cosine similarity matrix and output the precomputed JSON recommendations map:

```bash
python train.py
```
This compiles the top-10 recommendations for each movie and saves it to `../src/data/recommendations.json`. It also stores training stats in `../src/data/model_stats.json`.

### Step 3: Seed Supabase Database
Ensure you have created the `movies` table by running [supabase/schema.sql](../supabase/schema.sql) in the Supabase SQL Editor. Then, seed the database:

```bash
python load_supabase.py
```
This performs batch bulk-upserts of all movie metadata into your remote Supabase PostgreSQL database.

---

## Model Details

- **Feature Vectors**: TF-IDF (Term Frequency-Inverse Document Frequency)
- **Tokenization**: Multi-word values (e.g. Actor names `Tom Hanks` or Genres `Science Fiction`) are space-stripped (`TomHanks`, `ScienceFiction`) to treat them as distinct entities.
- **Weights**: Genres and directors are concatenated twice to double their semantic weight relative to the movie's overview description.
- **Similarity Metric**: Cosine Similarity.
