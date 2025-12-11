import pool from "../database.js";
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;
import { compare, hash } from 'bcryptjs';

export async function getAll() {
  const result = await pool.query("SELECT * FROM users");
  return result.rows; 
}

export async function getOneByID(id) {
  const result = await pool.query("SELECT * FROM users WHERE user_id = $1", [id]);
  return result.rows.length > 0 ? result.rows[0] : null;
}

export async function getOneByName(name) {
  const result = await pool.query("SELECT * FROM users WHERE username = $1", [name]);
  return result.rows[0] || null;
}

export async function addOne(user) {
  const hashedPassword = await bcrypt.hash(user.password, SALT_ROUNDS);
  const result = await pool.query("INSERT INTO users (username, password) VALUES($1,$2) RETURNING *", [user.name, hashedPassword]);
  return result.rows[0] || null;
}

export async function updateShareToken(id, token) {
  const result = await pool.query("UPDATE users SET share_token=$1 WHERE user_id = $2 RETURNING *", [token,id]);
  return result.rows[0] || null;
}

export async function updatePassword(id, password) {
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const result = await pool.query("UPDATE users SET password=$1 WHERE user_id=$2 RETURNING *", [hashedPassword, id]);
  return result.rows[0] || null;
}

export async function updateName(id, name) {
  const result = await pool.query("UPDATE users SET username=$1 WHERE user_id=$2 RETURNING *", [name, id]);
  return result.rows[0] || null;
}

export async function deleteOne(id) {
  console.log("delete: "+id);
  const result = await pool.query("DELETE FROM users WHERE user_id = $1 RETURNING *", [id]);
  return result.rows[0] || null;
}

export async function saveRefreshToken(username, refreshToken) {
  const result = await pool.query(
    "UPDATE users SET refresh_token = $1 WHERE username = $2 RETURNING username",
    [refreshToken, username]
  );
  return result.rows[0];
}

export async function getUserByRefreshToken(refreshToken) {
  const result = await pool.query(
    "SELECT username, user_id FROM users WHERE refresh_token = $1",
    [refreshToken]
  );
  return result.rows.length > 0 ? result.rows[0] : null;
}

export async function clearRefreshToken(username) {
  const result = await pool.query(
    "UPDATE users SET refresh_token = NULL WHERE username = $1 RETURNING username",
    [username]
  );
  return result.rows[0];
}

export async function deleteSelf(id, password) {
  console.log("delete: "+id);

  const result = await pool.query("SELECT password FROM users WHERE user_id = $1",[id]);

  const user = result.rows[0];
  if (!user) return null;

  const isMatch = await compare(password, user.password);
  if (!isMatch) return false; 

  const deleted = await pool.query("DELETE FROM users WHERE user_id = $1 RETURNING *",[id]);
 

  return deleted.rows[0] || null;
}



export async function updateDelete(id, user) {
  console.log("delete: "+id);

  const updated = await pool.query("UPDATE users SET is_active=false, deletion_date=$1 WHERE user_id=$2 RETURNING *", [user.deletion_date,id]);
  return updated.rows[0] || null;
}
