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

export async function getMyGroups(userId) {
  const query = `
    SELECT 
      g.id,
      g.name,
      g.avatar_url,
      COUNT(gm2.user_id) AS member_count,
      gm.role AS user_role
    FROM groups g
    JOIN group_members gm ON gm.group_id = g.id AND gm.user_id = $1
    LEFT JOIN group_members gm2 ON gm2.group_id = g.id
    GROUP BY g.id, gm.role
    ORDER BY g.name ASC;
  `;
  const result = await pool.query(query, [userId]);
  return result.rows;
}

export async function getDiscoverGroups(userId) {
  const query = `
    SELECT 
      g.id,
      g.name,
      g.avatar_url,
      COUNT(gm.user_id) AS member_count
    FROM groups g
    LEFT JOIN group_members gm ON gm.group_id = g.id
    WHERE g.id NOT IN (
      SELECT group_id FROM group_members WHERE user_id = $1
    )
    GROUP BY g.id;
  `;
  const result = await pool.query(query, [userId]);
  return result.rows;
}

export async function getInvitations(userId) {
  const query = `
    SELECT 
      gi.id,
      gi.group_id,
      g.name AS group_name,
      u.username AS invited_by,
      gi.created_at
    FROM group_invitations gi
    JOIN groups g ON gi.group_id = g.id
    LEFT JOIN users u ON u.id = gi.invited_by_user_id
    WHERE gi.invited_user_id = $1 AND gi.status = 'pending'
    ORDER BY gi.created_at DESC;
  `;
  const result = await pool.query(query, [userId]);
  return result.rows;
}

export async function joinGroup(groupId, userId) {
  const result = await pool.query(
    `INSERT INTO group_members (user_id, group_id)
     VALUES ($1, $2)
     ON CONFLICT DO NOTHING
     RETURNING *`,
    [userId, groupId]
  );
  return result.rows[0];
}


export async function inviteUser({ groupId, invitedUserId, invitedBy }) {
  const result = await pool.query(
    `INSERT INTO group_invitations 
     (group_id, invited_user_id, invited_by_user_id)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [groupId, invitedUserId, invitedBy]
  );
  return result.rows[0];
}


export async function acceptInvite(inviteId, userId) {
  const res = await pool.query(
    `UPDATE group_invitations 
     SET status = 'accepted' 
     WHERE id = $1 AND invited_user_id = $2
     RETURNING *`,
    [inviteId, userId]
  );

  if (!res.rows.length) return null;

  // insert into group_members
  const invite = res.rows[0];

  await pool.query(
    `INSERT INTO group_members (user_id, group_id)
     VALUES ($1, $2)
     ON CONFLICT DO NOTHING`,
    [userId, invite.group_id]
  );

  return invite;
}

export async function declineInvite(inviteId, userId) {
  const res = await pool.query(
    `UPDATE group_invitations 
     SET status = 'declined' 
     WHERE id = $1 AND invited_user_id = $2
     RETURNING *`,
    [inviteId, userId]
  );

  return res.rows[0];
}

export async function addMember(userId, groupId, role = "member") {
  const result = await pool.query(
    `INSERT INTO group_members (user_id, group_id, role)
     VALUES ($1, $2, $3)
     ON CONFLICT (user_id, group_id) DO NOTHING`,
    [userId, groupId, role]
  );
  return result;
}

export async function getGroupMembers(groupId) {
  const result = await pool.query(
    `SELECT 
        users.id,
        users.username,
        users.email,
        group_members.role
     FROM group_members
     JOIN users ON users.id = group_members.user_id
     WHERE group_members.group_id = $1
     ORDER BY group_members.role = 'owner' DESC`,
    [groupId]
  );
  return result.rows;
}

export async function removeMember(userId, groupId) {
  const result = await pool.query(
    `DELETE FROM group_members
     WHERE user_id = $1 AND group_id = $2
     RETURNING *`,
    [userId, groupId]
  );
  return result.rows[0];
}
