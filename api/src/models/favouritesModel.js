/**import pool from "../database.js";

export async function addFavourite(userId, movieId) {
    const result = await pool.query(
        `
        INSERT INTO user_favourites (user_id, movie_id)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING
        RETURNING *;
        `,
        [userId, movieId]
    );
    return result.rows[0] || null;
}

export async function removeFavourite(userId, movieId) {
    await pool.query(
        `DELETE FROM user_favourites WHERE user_id = $1 AND movie_id = $2`,
        [userId, movieId]
    );
}

export async function isFavourite(userId, movieId) {
    const result = await pool.query(
        `SELECT 1 FROM user_favourites WHERE user_id = $1 AND movie_id = $2`,
        [userId, movieId]
    );
    return result.rowCount > 0;
}

export async function getUserFavourites(userId) {
    const result = await pool.query(
        `
        SELECT m.*
        FROM user_favourites uf
        JOIN movies m ON uf.movie_id = m.id
        WHERE uf.user_id = $1
        ORDER BY uf.created_at DESC;
        `,
        [userId]
    );
    return result.rows;
}*/
