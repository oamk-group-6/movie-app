import pool from "../database.js";

export async function addFavourite(userId, movieId) {
    const result = await pool.query(
        `
        INSERT INTO favourites (user_id, movie_id)
        VALUES ($1, $2)
        ON CONFLICT (user_id, movie_id) DO NOTHING
        RETURNING *;
        `,
        [userId, movieId]
    );
    return result.rows[0] || null;
}

export async function removeFavourite(userId, movieId) {
    await pool.query(
        `DELETE FROM favourites WHERE user_id = $1 AND movie_id = $2`,
        [userId, movieId]
    );
}

export async function getFavouritesByUser(userId) {
    const result = await pool.query(
        `
        SELECT m.*, r.rating AS user_rating
        FROM movies m
        JOIN favourites f ON m.id = f.movie_id
        LEFT JOIN ratings r ON m.id = r.movie_id AND r.user_id = $1
        WHERE f.user_id = $1
        ORDER BY f.created_at DESC;

        `,
        [userId]
    );
    return result.rows;
}
