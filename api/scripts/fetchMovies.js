// run  node scripts/fetchMovies.js 

import fetch from "node-fetch";
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

async function fetchPopularMovies(page = 1) {
  const url = `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`TMDB API error: ${res.statusText}`);
  const data = await res.json();
  return data.results; 
}

async function fetchMovieDetails(movieId) {
  const url = `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&language=en-US`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`TMDB API error: ${res.statusText}`);
  return await res.json();
}

async function insertMovie(movie) {
  const query = `
    INSERT INTO movies
      (external_id, title, original_title, release_year, genre, description, poster_url, runtime, language)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
    ON CONFLICT (external_id) DO NOTHING
  `;

  const values = [
    movie.id,
    movie.title,
    movie.original_title,
    movie.release_date ? movie.release_date.split("-")[0] : null,
    movie.genres ? movie.genres.map(g => g.name).join(", ") : null,
    movie.overview,
    movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
    movie.runtime,
    movie.original_language
  ];

  await pool.query(query, values);
}

async function main() {
  try {
    for (let page = 1; page <= 5; page++) {
      const popularMovies = await fetchPopularMovies(page);
      for (const m of popularMovies) {
        const details = await fetchMovieDetails(m.id);
        await insertMovie(details);
        console.log(`Inserted: ${details.title}`);
      }
    }
    console.log("All movies inserted successfully!");
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

main();