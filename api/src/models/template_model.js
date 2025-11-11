import pool from "../database.js";

export async function getAll() {
  const result = await pool.query("SELECT * FROM x");
  return result.rows; 
}

export async function getOne(id) {
  const result = await pool.query("SELECT * FROM x WHERE id = $1", [id]);
  return result.rows.length > 0 ? result.rows[0] : null;
}

export async function addOne(templateObject) {
  const result = await pool.query("INSERT INTO x (row1,row2,row3) VALUES($1,$2,$3)", [templateObject.name, templateObject.author, templateObject.isbn]);
  return result.rows;
}

export async function updateOne(id, templateObject) {
  console.log("update:"+id);
  const result = await pool.query("UPDATE x SET row1=$1, row2=$2, row3=$3", [templateObject.name, templateObject.author, templateObject.isbn]);
  return result.rows;
}

export async function deleteOne(id) {
  console.log("delete:"+id);
  const result = await pool.query("DELETE FROM x WHERE id = $1", [id]);
  return result.rows;
}
