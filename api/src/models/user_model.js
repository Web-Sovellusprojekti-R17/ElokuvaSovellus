import pool from "../database.js";

export async function getAll() {
  const result = await pool.query("SELECT * FROM users");
  return result.rows; 
}

export async function getOne(id) {
  const result = await pool.query("SELECT * FROM users WHERE user_id = $1", [id]);
  return result.rows.length > 0 ? result.rows[0] : null;
}

// TODO: add hashed password as a separate parameter in the future
export async function addOne(user) {
  const result = await pool.query("INSERT INTO users (username, password) VALUES($1,$2) RETURNING *", [user.username, user.password]);
  return result.rows[0] || null;
}
// TODO: add hashed password as a separate parameter in the future
export async function updateOne(id, user) {
  console.log("update: "+id);
  const result = await pool.query("UPDATE users SET username=$1, password=$2 WHERE user_id=$3 RETURNING *", [user.username, user.password, id]);
  return result.rows[0] || null;
}

export async function deleteOne(id) {
  console.log("delete: "+id);
  const result = await pool.query("DELETE FROM users WHERE user_id = $1 RETURNING *", [id]);
  return result.rows[0] || null;
}
