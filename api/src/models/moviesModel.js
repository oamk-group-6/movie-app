import pool from "../database.js";

export async function getAllMovies() {
  const result = await pool.query("SELECT * FROM movies ORDER BY release_year DESC");
  return result.rows;
}

export async function getMovieById(id) {
  const result = await pool.query("SELECT * FROM movies WHERE id = $1", [id]);
  return result.rows[0] || null;
}

export async function addMovie(movie) {
  const query = `
    INSERT INTO movies (external_id, title, original_title, release_year, genre, description, poster_url, runtime, language)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
    RETURNING *
  `;
  const values = [
    movie.external_id,
    movie.title,
    movie.original_title,
    movie.release_year,
    movie.genre,
    movie.description,
    movie.poster_url,
    movie.runtime,
    movie.language
  ];
  const result = await pool.query(query, values);
  return result.rows[0];
}

export async function updateMovie(id, movie) {
  const query = `
    UPDATE movies
    SET title=$1, original_title=$2, release_year=$3, genre=$4, description=$5, poster_url=$6, runtime=$7, language=$8
    WHERE id=$9
    RETURNING *
  `;
  const values = [
    movie.title,
    movie.original_title,
    movie.release_year,
    movie.genre,
    movie.description,
    movie.poster_url,
    movie.runtime,
    movie.language,
    id
  ];
  const result = await pool.query(query, values);
  return result.rows[0];
}

export async function deleteMovie(id) {
  const result = await pool.query("DELETE FROM movies WHERE id=$1 RETURNING *", [id]);
  return result.rows[0];
}