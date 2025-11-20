import pool from "../database.js";

export async function addMember(groupId, userId, role = "member"){
  const result = await pool.query(
    `INSERT INTO group_members (group_id, user_id, role)
     VALUES ($1, $2, $3)
     ON CONFLICT (group_id, user_id) DO NOTHING
     RETURNING *`,
    [groupId, userId, role]
  );
  return result.rows[0];
}

export async function removeMember(groupId, userId) {
  const result = await pool.query(
    `DELETE FROM group_members
     WHERE group_id = $1 AND user_id = $2
     RETURNING *`,
    [groupId, userId]
  );
}

export async function getGroupMembers(groupId) {
  const result = await pool.query(
    `SELECT gm.*, u.username, u.avatar_url
     FROM group_members gm
     JOIN users u ON gm.user_id = u.id
     WHERE gm.group_id = $1
     ORDER BY gm.joined_at`,
    [groupId]
  );
  return result.rows;
}