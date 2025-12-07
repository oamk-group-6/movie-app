
import pool from "../database.js";
import bcrypt from "bcrypt";


export async function getAllUsers() {
  const result = await pool.query("SELECT id, username, email, avatar_url, bio, created_at FROM users");
  return result.rows;
}

export async function getUserById(id) {
  const result = await pool.query("SELECT id, username, email, avatar_url, bio, created_at FROM users WHERE id=$1", [id]);
  return result.rows[0] || null;
}

export async function getUserByEmail(email) {
  const result = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );
  return result.rows[0] || null;
}

export async function getUserByUsername(username) {
  const result = await pool.query(
    "SELECT * FROM users WHERE username = $1",
    [username]
  );
  return result.rows[0] || null;
}

export async function searchUsersByUsername(username) {
  const result = await pool.query(
    `SELECT id::int, username 
     FROM users 
     WHERE username ILIKE $1
     LIMIT 10`,
    [username + "%"]
  );
  return result.rows;
}

export async function addUser(user) {
  const hash = await bcrypt.hash(user.password, 10);
  const query = `
    INSERT INTO users (username, email, password_hash, avatar_url, bio)
    VALUES ($1,$2,$3,$4,$5)
    RETURNING id, username, email, avatar_url, bio, created_at
  `;
  const values = [user.username, user.email, hash, user.avatar_url, user.bio];
  const result = await pool.query(query, values);

  if (result.rows.length === 0) {
    throw new Error("User insertion returned no rows");
  }

  return result.rows[0];
}

export async function updateUser(id, user) {
  const query = `
    UPDATE users
    SET username=$1, email=$2, avatar_url=$3, bio=$4
    WHERE id=$5
    RETURNING id, username, email, avatar_url, bio, created_at
  `;
  const values = [user.username, user.email, user.avatar_url, user.bio, id];
  const result = await pool.query(query, values);
  return result.rows[0];
}

export async function updatePassword(id, oldPassword, newPassword) {
  const userRes = await pool.query("SELECT password_hash FROM users WHERE id = $1", [id]);
  if (userRes.rows.length === 0) return null;

  const user = userRes.rows[0];
  const isMatch = await bcrypt.compare(oldPassword, user.password_hash);
  if (!isMatch) throw new Error("Incorrect current password");

  const newHash = await bcrypt.hash(newPassword, 10);

  const updateRes = await pool.query(
    "UPDATE users SET password_hash = $1 WHERE id = $2 RETURNING id, username, email, updated_at",
    [newHash, id]
  );

  return updateRes.rows[0];
}

export async function patchUser(id, fields) {
  if (fields.password_hash || fields.password) {
    throw new Error("Password cannot be changed via PATCH.");
  }

  const keys = Object.keys(fields);
  if (keys.length === 0) return null;

  const setClauses = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");
  const values = Object.values(fields);

  const query = `
    UPDATE users
    SET ${setClauses}
    WHERE id = $${keys.length + 1}
    RETURNING id, username, email, avatar_url, updated_at
  `;

  const result = await pool.query(query, [...values, id]);
  return result.rows[0];
}

export async function deleteUser(id) {
  const result = await pool.query("DELETE FROM users WHERE id=$1 RETURNING *", [id]);
  return result.rows[0];
}

export async function updateAvatar(userId, avatarUrl) {
  const query = `
    UPDATE users
    SET avatar_url = $1
    WHERE id = $2
    RETURNING id, username, email, avatar_url, bio, created_at;
  `;
  const values = [avatarUrl, userId];
  const result = await pool.query(query, values);
  return result.rows[0];
}
