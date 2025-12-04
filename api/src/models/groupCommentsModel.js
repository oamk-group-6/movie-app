import pool from "../database.js";

export async function getAllGroupComments() {
    const result = await pool.query(
        "SELECT * FROM group_comments ORDER BY created_at DESC"
    );
    return result.rows;
}

export async function getGroupCommentById(id) {
    const result = await pool.query(
        "SELECT * FROM group_comments WHERE id = $1",
        [id]
    );
    return result.rows[0];
}

export async function addGroupComment(comment) {
    const { user_id, group_id, content } = comment;
    const result = await pool.query(
        `INSERT INTO group_comments (user_id, group_id, content)
        VALUES ($1, $2, $3)
        RETURNING *`,
        [user_id, group_id, content]
    );
    const inserted = result.rows[0];

    //hae username mukaan
    const userResult = await pool.query(
        `SELECT username FROM users WHERE id = $1`,
        [user_id]
    );

    return {
        ...inserted,
        username: userResult.rows[0].username
    };
}

export async function updateGroupComment(id, comment) {
    const { content } = comment;
    const result = await pool.query(
        `UPDATE group_comments
        SET content = $1
        WHERE id = $2
        RETURNING *`,
        [content, id]
    );
    return result.rows[0];
}

export async function patchGroupComment(id, fields) {
    const keys = Object.keys(fields);
    if (keys.length === 0) return null;

    const setClauses = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");
    const values = Object.values(fields);

    const query = `
        UPDATE group_comments
        SET ${setClauses}
        WHERE id = $${keys.length + 1}
        RETURNING *
    `;

    const result = await pool.query(query, [...values, id]);
    return result.rows[0];
}

export async function deleteGroupComment(id) {
    const result = await pool.query(
        "DELETE FROM group_comments WHERE id = $1 RETURNING *",
        [id]
    );
    return result.rows[0];
}

export async function getCommentsByGroupId(groupId) {
    const result = await pool.query(
        `SELECT gc.*, u.username
        FROM group_comments gc
        LEFT JOIN users u ON gc.user_id = u.id
        WHERE gc.group_id = $1
        ORDER BY created_at ASC`,
        [groupId]
    );
    return result.rows;
    }

export async function countGroupComments(groupId) {
    const result = await pool.query(
        `SELECT COUNT(*) AS total FROM group_comments WHERE group_id = $1`,
        [groupId]
    );
    return result.rows[0];
}

export async function getUserCommentsInGroup(userId, groupId) {
    const result = await pool.query(
        `SELECT * FROM group_comments
        WHERE user_id = $1 AND group_id = $2
        ORDER BY created_at DESC`,
        [userId, groupId]
    );
    return result.rows;
}
