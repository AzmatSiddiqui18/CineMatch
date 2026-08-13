import os
import sys
import json
import requests
from dotenv import load_dotenv

# Load env variables from the root .env.local file
env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), '.env.local')
load_dotenv(dotenv_path=env_path)

SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SERVICE_ROLE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY')

if not SUPABASE_URL or not SERVICE_ROLE_KEY:
    print("ERROR: Supabase URL or Service Role Key missing in .env.local.")
    print("Make sure you define:")
    print("  NEXT_PUBLIC_SUPABASE_URL")
    print("  SUPABASE_SERVICE_ROLE_KEY")
    sys.exit(1)

# Ensure URL does not end with a slash
SUPABASE_URL = SUPABASE_URL.rstrip('/')

def load_data():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    input_path = os.path.join(base_dir, 'data', 'movies_cleaned.json')
    
    if not os.path.exists(input_path):
        print(f"ERROR: Cleaned movies file not found at {input_path}.")
        print("Please run collect_data.py first.")
        return
        
    with open(input_path, 'r', encoding='utf-8') as f:
        movies = json.load(f)
        
    print(f"Loaded {len(movies)} movies from local JSON cache. Uploading to Supabase...")
    
    # Configure API headers
    url = f"{SUPABASE_URL}/rest/v1/movies"
    headers = {
        "apikey": SERVICE_ROLE_KEY,
        "Authorization": f"Bearer {SERVICE_ROLE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates"  # UPSERT: inserts or updates on primary key conflict
    }
    
    # Send in batches to avoid payload size limits
    batch_size = 100
    total_movies = len(movies)
    successful_count = 0
    
    for i in range(0, total_movies, batch_size):
        batch = movies[i:i+batch_size]
        try:
            response = requests.post(url, headers=headers, json=batch, timeout=15)
            # 201 Created is the standard successful response for PostgREST POST
            if response.status_code in [200, 201]:
                successful_count += len(batch)
                print(f"Uploaded batch {i//batch_size + 1}: {successful_count}/{total_movies} movies synced.")
            else:
                print(f"Error seeding batch starting at index {i}. Status code: {response.status_code}")
                print(f"Response details: {response.text}")
        except Exception as e:
            print(f"Exception occurred while seeding batch starting at index {i}: {e}")
            
    print(f"Seeding completed. Successfully synced {successful_count}/{total_movies} movies to Supabase.")

if __name__ == "__main__":
    load_data()
