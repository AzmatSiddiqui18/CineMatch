import os
import sys
import json
import time
import argparse
from concurrent.futures import ThreadPoolExecutor, as_completed
import requests
from dotenv import load_dotenv

# Load env variables from the root .env.local file
env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), '.env.local')
load_dotenv(dotenv_path=env_path)

TMDB_TOKEN = os.getenv('TMDB_API_READ_ACCESS_TOKEN')

if not TMDB_TOKEN:
    print("ERROR: TMDB_API_READ_ACCESS_TOKEN not found in .env.local.")
    print("Please make sure you have approved the implementation plan and created a .env.local file with the correct credentials.")
    sys.exit(1)

HEADERS = {
    "accept": "application/json",
    "Authorization": f"Bearer {TMDB_TOKEN}"
}
BASE_URL = "https://api.themoviedb.org/3"

def get_movie_details(movie_id):
    """
    Fetches details for a single movie including credits and keywords using append_to_response.
    """
    url = f"{BASE_URL}/movie/{movie_id}?append_to_response=credits,keywords"
    retries = 3
    for attempt in range(retries):
        try:
            response = requests.get(url, headers=HEADERS, timeout=10)
            if response.status_code == 200:
                return response.json()
            elif response.status_code == 429:
                # Rate limit hit, wait and retry
                retry_after = int(response.headers.get("Retry-After", 1))
                time.sleep(retry_after)
            else:
                return None
        except Exception as e:
            if attempt == retries - 1:
                print(f"Error fetching movie {movie_id} details: {e}")
            time.sleep(1)
    return None

def fetch_discover_page(page):
    """
    Fetches a single page of discovered popular movies.
    """
    # Filter for English movies, sorted by popularity, with at least 50 votes
    url = f"{BASE_URL}/discover/movie?include_adult=false&include_video=false&language=en-US&page={page}&sort_by=popularity.desc&vote_count.gte=50&with_original_language=en"
    try:
        response = requests.get(url, headers=HEADERS, timeout=10)
        if response.status_code == 200:
            return response.json().get('results', [])
    except Exception as e:
        print(f"Error fetching page {page}: {e}")
    return []

def main():
    parser = argparse.ArgumentParser(description="Collect movie metadata from TMDB.")
    parser.add_argument('--limit', type=int, default=5000, help="Maximum number of movies to collect.")
    args = parser.parse_args()

    limit = args.limit
    print(f"Starting data collection. Target: {limit} movies.")

    # Create local data folder if it doesn't exist
    os.makedirs(os.path.join(os.path.dirname(__file__), 'data'), exist_ok=True)

    movie_ids = []
    page = 1
    
    # Step 1: Gather movie IDs using discover endpoint
    print("Discovering movie IDs...")
    while len(movie_ids) < limit:
        results = fetch_discover_page(page)
        if not results:
            print("No more movies found or API error occurred.")
            break
        
        for m in results:
            if m['id'] not in movie_ids:
                movie_ids.append(m['id'])
                if len(movie_ids) >= limit:
                    break
        
        print(f"Discovered {len(movie_ids)} movie IDs (Page {page})...")
        page += 1
        # Avoid hammering the API discovery endpoint
        time.sleep(0.1)

    # Trim to limit
    movie_ids = movie_ids[:limit]
    print(f"Discovered {len(movie_ids)} total movie IDs. Fetching details concurrently...")

    # Step 2: Fetch detailed info (genres, keywords, cast, crew, etc.) in parallel
    cleaned_movies = []
    
    with ThreadPoolExecutor(max_workers=15) as executor:
        futures = {executor.submit(get_movie_details, mid): mid for mid in movie_ids}
        
        completed_count = 0
        for future in as_completed(futures):
            completed_count += 1
            if completed_count % 50 == 0 or completed_count == len(movie_ids):
                print(f"Progress: {completed_count}/{len(movie_ids)} details fetched...")
                
            res = future.result()
            if res:
                # Basic cleaning and feature extraction
                tmdb_id = res.get('id')
                title = res.get('title')
                original_title = res.get('original_title')
                overview = res.get('overview', '')
                release_date = res.get('release_date', '')
                
                # Check for minimum required metadata
                if not title or not overview:
                    continue
                
                # Extract genres
                genres = [g.get('name') for g in res.get('genres', []) if g.get('name')]
                
                # Extract keywords
                keywords = [k.get('name') for k in res.get('keywords', {}).get('keywords', []) if k.get('name')]
                
                # Extract cast (top 5)
                cast = [c.get('name') for c in res.get('credits', {}).get('cast', [])[:5] if c.get('name')]
                
                # Extract director
                director = ""
                for crew_member in res.get('credits', {}).get('crew', []):
                    if crew_member.get('job') == 'Director':
                        director = crew_member.get('name', '')
                        break
                
                movie_data = {
                    "id": tmdb_id,
                    "tmdb_id": tmdb_id,
                    "title": title,
                    "original_title": original_title,
                    "overview": overview,
                    "release_date": release_date,
                    "genres": genres,
                    "keywords": keywords,
                    "cast_members": cast,
                    "director": director,
                    "poster_path": res.get('poster_path', ''),
                    "backdrop_path": res.get('backdrop_path', ''),
                    "vote_average": res.get('vote_average', 0.0),
                    "vote_count": res.get('vote_count', 0),
                    "popularity": res.get('popularity', 0.0)
                }
                
                cleaned_movies.append(movie_data)

    print(f"Successfully collected details for {len(cleaned_movies)} movies.")

    # Save to disk
    output_path = os.path.join(os.path.dirname(__file__), 'data', 'movies_cleaned.json')
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(cleaned_movies, f, indent=2, ensure_ascii=False)
        
    print(f"Data saved to {output_path}")

if __name__ == "__main__":
    main()
