import pool from "../database.js"
import crypto from "crypto"

export async function getAllLists() {
  const result = await pool.query("SELECT * FROM lists ORDER BY created_at DESC");
  return result.rows;
}

export async function getListById(id) {
  const result = await pool.query("SELECT * FROM lists WHERE id = $1", [id]);
  return result.rows[0];
}

export async function addList(list) {
    const { name, description, owner_user_id = null, owner_group_id = null, is_public = false} = list;
    const share_id = crypto.randomBytes(8).toString("hex");

    const result = await pool.query(
        `INSERT INTO lists (name, description, owner_user_id, owner_group_id, is_public, share_id)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *`,
        [name, description, owner_user_id, owner_group_id, is_public, share_id]
    );

    return result.rows[0];
}

export async function updateList(id, list) {
  const { name, description, is_public } = list;
  const result = await pool.query(
    `UPDATE lists SET name=$1, description=$2, is_public=$3 WHERE id=$4 RETURNING *`,
    [name, description, is_public, id]
  );
  return result.rows[0];
}

export async function patchList(id, fields) {
  const keys = Object.keys(fields);
  if (keys.length === 0) return null;

  const setClauses = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");
  const values = Object.values(fields);

  const query = `
    UPDATE lists
    SET ${setClauses}
    WHERE id = $${keys.length + 1}
    RETURNING *
  `;

  const result = await pool.query(query, [...values, id]);
  return result.rows[0];
}

export async function deleteList(id) {
  const result = await pool.query("DELETE FROM lists WHERE id = $1 RETURNING *", [id]);
  return result.rows[0];
}

export async function getListByShareId(shareId) {
  const result = await pool.query(
    "SELECT * FROM lists WHERE share_id = $1",
    [shareId]
  );
  return result.rows[0];
}