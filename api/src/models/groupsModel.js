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
      COUNT(gm.user_id) AS member_count,
      EXISTS (
        SELECT 1 FROM group_members gm2
        WHERE gm2.user_id = $1 AND gm2.group_id = g.id
      ) AS is_member,
      EXISTS (
        SELECT 1 FROM join_requests jr
        WHERE jr.user_id = $1 AND jr.group_id = g.id AND jr.status = 'pending'
      ) AS has_pending_request,
      EXISTS (
        SELECT 1 FROM group_invitations gi
        WHERE gi.invited_user_id = $1 AND gi.group_id = g.id AND gi.status = 'pending'
      ) AS has_pending_invite

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

export const leaveGroup = async (groupId, userId) => {
    const result = await pool.query(
        `
        DELETE FROM group_members
        WHERE group_id = $1 AND user_id = $2
        RETURNING *;
        `,
        [groupId, userId]
    );

    return result.rows[0];
};


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

export async function isUserMember(userId, groupId) {
  const result = await pool.query(
    `SELECT 1 FROM group_members 
     WHERE user_id = $1 AND group_id = $2`,
    [userId, groupId]
  );
  return result.rows.length > 0;
}

export async function hasPendingInvite(userId, groupId) {
  const result = await pool.query(
    `SELECT 1 FROM group_invitations 
     WHERE invited_user_id = $1 
       AND group_id = $2
       AND status = 'pending'`,
    [userId, groupId]
  );
  return result.rows.length > 0;
}

export async function getUserByUsername(username) {
  const result = await pool.query(
    `SELECT * FROM users WHERE username = $1 LIMIT 1`,
    [username]
  );
  return result.rows[0];
}

export async function hasPendingJoinRequest(userId, groupId) {
  const result = await pool.query(
    `SELECT 1 FROM join_requests 
     WHERE user_id = $1 AND group_id = $2 AND status = 'pending'`,
    [userId, groupId]
  );
  return result.rows.length > 0;
}

export async function createJoinRequest(userId, groupId) {
  const result = await pool.query(
    `INSERT INTO join_requests (user_id, group_id)
     VALUES ($1, $2)
     RETURNING *`,
    [userId, groupId]
  );
  return result.rows[0];
}


export async function acceptInvite(inviteId, userId) {
  const res = await pool.query(
    `DELETE FROM group_invitations
     WHERE id = $1
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

export async function declineInvite(inviteId) {
  const res = await pool.query(
    `DELETE FROM group_invitations
     WHERE id = $1
     RETURNING *`,
    [inviteId]
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

// Get pending join requests for a group
export async function getJoinRequests(groupId) {
  const result = await pool.query(
    `
    SELECT 
      jr.id,
      jr.user_id,
      u.username,
      jr.created_at
    FROM join_requests jr
    JOIN users u ON u.id = jr.user_id
    WHERE jr.group_id = $1 AND jr.status = 'pending'
    ORDER BY jr.created_at ASC
    `,
    [groupId]
  );
  return result.rows;
}

// Accept join request → add to members + update request status
export async function acceptJoinRequest(requestId) {

  // Get request info
  const requestRes = await pool.query(
    `SELECT * FROM join_requests WHERE id = $1`,
    [requestId]
  );

  if (requestRes.rows.length === 0) return null;

  const request = requestRes.rows[0];

  // Mark as accepted
  await pool.query(
    `UPDATE join_requests SET status = 'accepted' WHERE id = $1`,
    [requestId]
  );

  // Add user as group member
  await pool.query(
    `
    INSERT INTO group_members (user_id, group_id, role)
    VALUES ($1, $2, 'member')
    ON CONFLICT DO NOTHING
    `,
    [request.user_id, request.group_id]
  );

  return request;
}

// Decline a join request
export async function declineJoinRequest(requestId) {
  const res = await pool.query(
    `DELETE FROM join_requests
     WHERE id = $1
     RETURNING *`,
    [requestId]
  );
  return res.rows[0];
}
