import pool from "../database.js";

export async function getAllComments() {
  const result = await pool.query("SELECT * FROM comments ORDER BY created_at DESC");
  return result.rows;
}

export async function getCommentById(id) {
  const result = await pool.query("SELECT * FROM comments WHERE id = $1", [id]);
  return result.rows[0];
}

export async function addComment(comment) {
  const { user_id, movie_id, list_id, content } = comment;
  const result = await pool.query(
    `INSERT INTO comments (user_id, movie_id, list_id, content) VALUES ($1,$2,$3,$4) RETURNING *`,
    [user_id, movie_id, list_id, content]
  );
  return result.rows[0];
}

export async function updateComment(id, comment) {
  const { content } = comment;
  const result = await pool.query(
    `UPDATE comments SET content=$1 WHERE id=$2 RETURNING *`,
    [content, id]
  );
  return result.rows[0];
}

export async function patchComment(id, fields) {
  const keys = Object.keys(fields);
  if (keys.length === 0) return null;

  const setClauses = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");
  const values = Object.values(fields);

  const query = `
    UPDATE comments
    SET ${setClauses}
    WHERE id = $${keys.length + 1}
    RETURNING *
  `;

  const result = await pool.query(query, [...values, id]);
  return result.rows[0];
}

export async function deleteComment(id) {
  const result = await pool.query("DELETE FROM comments WHERE id = $1 RETURNING *", [id]);
  return result.rows[0];
}