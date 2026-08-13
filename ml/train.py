import os
import json
import time
import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def process_field(val):
    if not val:
        return ""
    if isinstance(val, list):
        # Remove spaces in elements (e.g. "Science Fiction" -> "ScienceFiction", "Tom Hanks" -> "TomHanks")
        # to treat multi-word entities as single tokens.
        return " ".join([x.replace(" ", "") for x in val])
    if isinstance(val, str):
        return val.replace(" ", "")
    return str(val)

def main():
    print("Starting ML offline training pipeline...")
    start_time = time.time()
    
    # Path setup
    base_dir = os.path.dirname(os.path.abspath(__file__))
    input_path = os.path.join(base_dir, 'data', 'movies_cleaned.json')
    output_dir = os.path.join(os.path.dirname(base_dir), 'src', 'data')
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, 'recommendations.json')
    
    if not os.path.exists(input_path):
        print(f"ERROR: Cleaned data file not found at {input_path}.")
        print("Please run collect_data.py first.")
        return
        
    with open(input_path, 'r', encoding='utf-8') as f:
        movies = json.load(f)
        
    df = pd.DataFrame(movies)
    dataset_size = len(df)
    print(f"Loaded {dataset_size} movies from dataset.")
    
    # Feature Engineering
    print("Performing feature engineering...")
    df['genres_str'] = df['genres'].apply(process_field)
    df['keywords_str'] = df['keywords'].apply(process_field)
    df['cast_str'] = df['cast_members'].apply(process_field)
    df['director_str'] = df['director'].apply(process_field)
    df['overview_str'] = df['overview'].fillna("")
    
    # Combine features into a single document per movie
    # We repeat certain key features (like genres, director, and keywords) to give them more weight relative to the long overview.
    df['combined_features'] = (
        df['overview_str'] + " " +
        df['genres_str'] + " " + df['genres_str'] + " " +  # Double weight
        df['keywords_str'] + " " +
        df['cast_str'] + " " +
        df['director_str'] + " " + df['director_str']  # Double weight
    )
    
    # Vectorization
    print("Vectorizing using TF-IDF...")
    tfidf = TfidfVectorizer(stop_words='english', max_features=15000)
    tfidf_matrix = tfidf.fit_transform(df['combined_features'])
    
    vocab_size = len(tfidf.vocabulary_)
    print(f"TF-IDF matrix shape: {tfidf_matrix.shape} (Vocabulary size: {vocab_size})")
    
    # Similarity calculations
    print("Calculating cosine similarity matrix...")
    similarity_matrix = cosine_similarity(tfidf_matrix, tfidf_matrix)
    
    # Generate recommendations mapping
    print("Extracting top 10 recommendations per movie...")
    recommendations = {}
    
    # For each movie index, get the top 10 recommendations
    for idx in range(dataset_size):
        # Get similarities for the current movie
        sim_scores = list(enumerate(similarity_matrix[idx]))
        
        # Sort by score descending
        sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
        
        # Filter out the movie itself and get top 10
        recommended_indices = []
        for index, score in sim_scores:
            if index == idx:
                continue
            recommended_indices.append((index, score))
            if len(recommended_indices) == 10:
                break
                
        # Map back to TMDB IDs
        movie_tmdb_id = str(df.iloc[idx]['tmdb_id'])
        recommendations[movie_tmdb_id] = [
            {
                "id": int(df.iloc[rec_idx]['tmdb_id']),
                "score": float(np.round(score, 4))
            }
            for rec_idx, score in recommended_indices
        ]
        
    training_time = time.time() - start_time
    print(f"ML Offline Pipeline completed in {training_time:.2f} seconds.")
    
    # Save the recommendation mapping
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(recommendations, f)
        
    print(f"Lightweight recommendations artifact saved to {output_path} (File size: {os.path.getsize(output_path)/1024:.2f} KB)")
    
    # Output model parameters/stats for the model/How-It-Works page
    model_stats = {
        "dataset_size": dataset_size,
        "vocab_size": vocab_size,
        "top_k": 10,
        "training_time_seconds": round(training_time, 2),
        "last_trained": time.strftime("%Y-%m-%d %H:%M:%S")
    }
    
    stats_path = os.path.join(base_dir, 'data', 'model_stats.json')
    with open(stats_path, 'w', encoding='utf-8') as f:
        json.dump(model_stats, f, indent=2)
    print(f"Model training stats saved to {stats_path}")

if __name__ == "__main__":
    main()
