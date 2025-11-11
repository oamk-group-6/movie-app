import pool from "../models/db.js";
import bcrypt from "bcrypt";

export async function getAllUsers() {
  const result = await pool.query("SELECT id, username, email, avatar_url, bio, created_at FROM users");
  return result.rows;
}

export async function getUserById(id) {
  const result = await pool.query("SELECT id, username, email, avatar_url, bio, created_at FROM users WHERE id=$1", [id]);
  return result.rows[0] || null;
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

export async function deleteUser(id) {
  const result = await pool.query("DELETE FROM users WHERE id=$1 RETURNING *", [id]);
  return result.rows[0];
}
