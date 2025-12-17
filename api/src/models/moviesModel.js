import pool from "../database.js";

// getAllMovies with optional userId
export async function getAllMovies(filters = {}, userId) {
  const {
    search,
    genres,
    yearFrom,
    yearTo,
    language,
    country,
    ratingMin,
    ratingMax,
    limit = 50,
    offset = 0
  } = filters;

  const params = [];
  const conditions = [];

  // Perus SELECT
  let query = `
    SELECT 
      m.*,
      ${userId ? 'r.rating AS user_rating' : 'NULL AS user_rating'}
    FROM movies m
    ${userId ? 'LEFT JOIN ratings r ON m.id = r.movie_id AND r.user_id = $1' : ''}
  `;

  if (userId) params.push(userId);

  if(search) {
    const words = search.trim().split(/\s+/);

    words.forEach((word) => {
      params.push(word);
      conditions.push(`m.title ILIKE '%' || $${params.length} || '%'`);
    });
  }

  // Genre
  if (genres && genres.length > 0) {
    const genreConditions = genres.map((g) => {
      params.push(`%${g}%`);
      return `m.genre ILIKE $${params.length}`;
    });
    conditions.push("(" + genreConditions.join(" OR ") + ")");
  }

  // Vuodet
  if (yearFrom !== undefined) {
    params.push(yearFrom);
    conditions.push(`m.release_year >= $${params.length}`);
  }
  if (yearTo !== undefined) {
    params.push(yearTo);
    conditions.push(`m.release_year <= $${params.length}`);
  }

  // Language / country
  if (language) {
    params.push(`%${language}%`);
    conditions.push(`m.language ILIKE $${params.length}`);
  }
  if (country) {
    params.push(`%${country}%`);
    conditions.push(`m.country ILIKE $${params.length}`);
  }

  // Rating average
  if (ratingMin !== undefined) {
    params.push(ratingMin);
    conditions.push(`m.rating_avg >= $${params.length}`);
  }
  if (ratingMax !== undefined) {
    params.push(ratingMax);
    conditions.push(`m.rating_avg <= $${params.length}`);
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  // Limit & offset
  params.push(limit, offset);
  query += ` ORDER BY m.release_year DESC LIMIT $${params.length - 1} OFFSET $${params.length}`;

  const result = await pool.query(query, params);
  return result.rows;
}

// getMovieById
export async function getMovieById(id) {
  const result = await pool.query("SELECT * FROM movies WHERE id = $1", [id]);
  return result.rows[0] || null;
}

// addMovie
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

// updateMovie
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

// patchMovie
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

  const result = await pool.query([...values, id]);
  return result.rows[0];
}

// deleteMovie
export async function deleteMovie(id) {
  const result = await pool.query("DELETE FROM movies WHERE id=$1 RETURNING *", [id]);
  return result.rows[0];
}

//Top rated movies
export async function getTopRatedMovies(limit = 5) {
  const result = await pool.query(`
    SELECT 
      m.*, 
      COALESCE(AVG(r.rating), 0) AS avg_rating
    FROM movies m
    LEFT JOIN ratings r ON r.movie_id = m.id
    GROUP BY m.id
    ORDER BY avg_rating DESC
    LIMIT $1
  `, [limit]);

  return result.rows;
}

// Now in theater movies
export async function getNowPlayingMovies(limit = 40) {
  const query = `
    SELECT * FROM movies
    WHERE in_theaters = TRUE
    ORDER BY release_year DESC, created_at DESC
    LIMIT $1
  `;
  const result = await pool.query(query, [limit]);
  return result.rows;
}


