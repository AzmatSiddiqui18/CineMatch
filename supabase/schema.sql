-- CineMatch Database Schema
-- Run this in the Supabase SQL Editor (https://supabase.com/dashboard/project/_/editor)

-- 1. Create the movies table
CREATE TABLE IF NOT EXISTS public.movies (
    id BIGINT PRIMARY KEY,
    title TEXT NOT NULL,
    original_title TEXT,
    overview TEXT,
    release_date TEXT,
    genres TEXT[] DEFAULT '{}',
    keywords TEXT[] DEFAULT '{}',
    cast_members TEXT[] DEFAULT '{}',
    director TEXT,
    poster_path TEXT,
    backdrop_path TEXT,
    vote_average DOUBLE PRECISION DEFAULT 0.0,
    vote_count INTEGER DEFAULT 0,
    popularity DOUBLE PRECISION DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create indexes to optimize search and lookup performance
-- Index for case-insensitive search (ILIKE '%query%')
CREATE INDEX IF NOT EXISTS idx_movies_title ON public.movies (title);

-- Index for sorting by popularity (used for discovery/default landing page options)
CREATE INDEX IF NOT EXISTS idx_movies_popularity ON public.movies (popularity DESC);

-- Enable Row-Level Security (RLS)
ALTER TABLE public.movies ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies
-- Allow anyone to read movies (public select access)
CREATE POLICY "Allow public read access to movies" 
ON public.movies 
FOR SELECT 
USING (true);

-- Allow service_role to manage all movie records (insert/update/delete)
CREATE POLICY "Allow service_role full management of movies" 
ON public.movies 
FOR ALL 
USING (true) 
WITH CHECK (true);
