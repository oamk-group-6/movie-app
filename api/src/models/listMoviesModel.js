import pool from "../database.js";

export async function getMoviesInList(listId) {
    const result = await pool.query(
        `
        SELECT lm.*, m.title, m.poster_url, m.release_year
        FROM list_movies lm
        JOIN movies m ON lm.movie_id = m.id
        WHERE lm.list_id = $1
        ORDER BY lm.added_at DESC
        `,
        [listId]
    );
    return result.rows;
}

export async function addMovieToList(listId, movieId, userId) {
    const result = await pool.query(
        `
        INSERT INTO list_movies (list_id, movie_id, added_by_user_id)
        VALUES ($1, $2, $3)
        ON CONFLICT (list_id, movie_id) DO NOTHING
        RETURNING *
        `,
        [listId, movieId, userId]
    );

    return result.rows[0];
}

export async function removeMovieFromList(listId, movieId) {
    const result = await pool.query(
        `
        DELETE FROM list_movies
        WHERE list_id = $1 AND movie_id = $2
        RETURNING *
        `,
        [listId, movieId]
    );
    return result.rows[0];
}