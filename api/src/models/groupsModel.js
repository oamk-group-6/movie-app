import pool from "../database.js";

export async function getAllGroups() {
    const result = await pool.query(
        "SELECT * FROM groups ORDER BY created_at DESC"
    );
    return result.rows;
}

export async function getGroupById(id) {
    const result = await pool.query(
        "SELECT * FROM groups WHERE id = $1", [id]
    );
    return result.rows[0];
}

export async function addGroup(group) {
  const { name, description, avatar_url, owner_id } = group;
  const result = await pool.query(
    `INSERT INTO groups (name, description, avatar_url, owner_id)
     VALUES ($1,$2,$3,$4) RETURNING *`,
    [name, description, avatar_url, owner_id]
  );
  return result.rows[0];
}

export async function updateGroup(id, group) {
  const { name, description, avatar_url } = group;
  const result = await pool.query(
    `UPDATE groups SET name=$1, description=$2, avatar_url=$3 WHERE id=$4 RETURNING *`,
    [name, description, avatar_url, id]
  );
  return result.rows[0];
}

export async function patchGroup(id, fields) {
  const keys = Object.keys(fields);
  if (keys.length === 0) return null;

  const setClauses = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");
  const values = Object.values(fields);

  const query = `
    UPDATE groups
    SET ${setClauses}
    WHERE id = $${keys.length + 1}
    RETURNING *
  `;

  const result = await pool.query(query, [...values, id]);
  return result.rows[0];
}

export async function deleteGroup(id) {
  const result = await pool.query(
    "DELETE FROM groups WHERE id = $1 RETURNING *", [id]
  );
  return result.rows[0];
}