import pool from "../database.js";

export async function getAllGroupFavourites(groupId) {
    const result = await pool.query(
        `SELECT movies.id, movies.title, movies.poster_url
         FROM group_favourites
         JOIN movies ON movies.id = group_favourites.movie_id
         WHERE group_favourites.group_id = $1
         ORDER BY group_favourites.created_at DESC`,
        [groupId]
    );
    return result.rows;
}

/* Add favourite to group */
export async function addFavouriteToGroup(groupId, movieId, userId) {
    const result = await pool.query(
        `INSERT INTO group_favourites (group_id, movie_id, added_by)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [groupId, movieId, userId]
    );

    return result.rows[0];
}

/* Remove favourite from group */
export async function removeFavouriteFromGroup(groupId, movieId) {
    const result = await pool.query(
        `DELETE FROM group_favourites
         WHERE group_id = $1 AND movie_id = $2
         RETURNING *`,
        [groupId, movieId]
    );

    return result.rows[0];
}

/* Check if movie is favourite in a specific group */
export async function checkGroupFavourite(groupId, movieId) {
    const result = await pool.query(
        `SELECT * FROM group_favourites
         WHERE group_id = $1 AND movie_id = $2`,
        [groupId, movieId]
    );

    return result.rows.length > 0;
}
