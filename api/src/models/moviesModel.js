import pool from "../database.js";


export async function getAllMovies(filters = {}) {
  const { genre, year, limit = 50, offset = 0 } = filters;
  const params = [];
  let query = "SELECT * FROM movies";
  const conditions = [];

  if (genre) {
    conditions.push(`genre ILIKE $${params.length + 1}`);
    params.push(`%${genre}%`);
  }

  if (year) {
    conditions.push(`release_year = $${params.length + 1}`);
    params.push(year);
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  query += ` ORDER BY release_year DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
  params.push(limit, offset);

  const result = await pool.query(query, params);
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

export async function patchMovie(id, fields) {
  const keys = Object.keys(fields);
  if (keys.length === 0) return null;

  const setClauses = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");
  const values = Object.values(fields);

  const query = `
    UPDATE movies
    SET ${setClauses}
    WHERE id = $${keys.length + 1}
    RETURNING *
  `;

  const result = await pool.query(query, [...values, id]);
  return result.rows[0];
}

export async function deleteMovie(id) {
  const result = await pool.query("DELETE FROM movies WHERE id=$1 RETURNING *", [id]);
  return result.rows[0];
}