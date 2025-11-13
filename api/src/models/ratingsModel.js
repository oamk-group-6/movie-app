import pool from "../database.js";

export async function upsertRating(userId, movieId, rating, review = null){
    const result = await pool.query(
        `
        INSERT INTO ratings (user_id, movie_id, rating, review)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (user_id, movie_id)
        DO UPDATE SET 
        rating = EXCLUDED.rating,
        review = EXCLUDED.review,
        updated_at = CURRENT_TIMESTAMP
        RETURNING *;
    `,
        [userId, movieId, rating, review]
    );

    await pool.query(
            `
        UPDATE movies
        SET rating_avg = sub.avg, rating_count = sub.count
        FROM (
        SELECT movie_id, AVG(rating)::FLOAT AS avg, COUNT(*) AS count
        FROM ratings
        WHERE movie_id = $1
        GROUP BY movie_id
        ) AS sub
        WHERE movies.id = sub.movie_id;
    `,
    [movieId]
    );

    return result.rows[0];
}

export async function getUserRating(userId, movieId) {
    const result = await pool.query(
        `SELECT rating, review FROM ratings WHERE user_id = $1 AND movie_id = $2`,
        [userId, movieId]
    );
    return result.rows[0] || null;
}

export async function deleteRating(userId, movieId) {
    await pool.query(
        `DELETE FROM ratings WHERE user_id = $1 AND movie_id = $2`,
        [userId, movieId]
    )

    await pool.query(
            `
        UPDATE movies
        SET rating_avg = sub.avg, rating_count = sub.count
        FROM (
        SELECT movie_id, AVG(rating)::FLOAT AS avg, COUNT(*) AS count
        FROM ratings
        WHERE movie_id = $1
        GROUP BY movie_id
        ) AS sub
        WHERE movies.id = sub.movie_id;
    `,
    [movieId]
    );
}