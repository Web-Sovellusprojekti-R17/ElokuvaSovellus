import pool from "../database.js";
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
  const result = await pool.query("INSERT INTO users (username, password) VALUES($1,$2) RETURNING *", [user.username, user.password]);
  return result.rows[0] || null;
}

export async function updateOne(id, user) {
  console.log("update: "+id);
  const result = await pool.query("UPDATE users SET username=$1, password=$2 WHERE user_id=$3 RETURNING *", [user.name, user.password, id]);
  return result.rows[0] || null;
}

export async function deleteOne(id) {
  console.log("delete: "+id);
  const result = await pool.query("DELETE FROM users WHERE user_id = $1 RETURNING *", [id]);
  return result.rows[0] || null;
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
