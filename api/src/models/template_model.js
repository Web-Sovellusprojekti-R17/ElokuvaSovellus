import pool from "../database.js";

///
// REST API implementointiin tarvitaan 4 eri fileä:
// template_controller.js 
// template_model.js  <- current
// template_router.js
// index.js
///

export async function getAll() {
  const result = await pool.query("SELECT * FROM x");
  return result.rows; 
}

export async function getOne(id) {
  const result = await pool.query("SELECT * FROM x WHERE x_id = $1", [id]);
  return result.rows.length > 0 ? result.rows[0] : null;
//return result.rows[0] || null; <- ^ nämä on sama asia eri tavalla kirjoitettuna
}

export async function addOne(template) {
  const result = await pool.query("INSERT INTO x (row1, row2, row3) VALUES($1, $2, $3) RETURNING *", [template.name, template.author, template.isbn]);
  return result.rows[0] || null;
}

export async function updateOne(id, template) {
  console.log("update:"+id);
  const result = await pool.query("UPDATE x SET row1=$1, row2=$2 WHERE x_id=$3 RETURNING *", [template.row1, template.row2, id]);
  return result.rows[0] || null;
}

export async function deleteOne(id) {
  console.log("delete:"+id);
  const result = await pool.query("DELETE FROM x WHERE id = $1 RETURNING *", [id]);
  return result.rows[0] || null;
}
