import pool from "../database.js";

///
// REST API implementointiin tarvitaan 4 eri fileä:
// template_controller.js 
// template_model.js  <- current
// template_router.js
// index.js
///

export async function getAll() {
  const result = await pool.query("SELECT * FROM groups");
  return result.rows;
}

export async function getOne(id) {
  const result = await pool.query("SELECT * FROM groups WHERE group_id = $1", [id]);
  return result.rows.length > 0 ? result.rows[0] : null;
  //return result.rows[0] || null; <- ^ nämä on sama asia eri tavalla kirjoitettuna
}

export async function getOwn(id) {
  const result = await pool.query(`SELECT groups.group_id, groups.group_name
  FROM groups
  JOIN members ON groups.group_id = members.group_id
  WHERE members.user_id = $1    
  AND members.role IN ('Admin', 'Member');`, [id]);
  return result.rows.length > 0 ? result.rows : null;
  //return result.rows[0] || null; <- ^ nämä on sama asia eri tavalla kirjoitettuna
}

export async function addOne(group) {
  const result = await pool.query("INSERT INTO groups (group_name) VALUES($1) RETURNING *", [group.group_name]);
  return result.rows[0] || null;
}

export async function updateOne(id, group) {
  console.log("update:" + id);
  const result = await pool.query("UPDATE groups SET group_name=$1 WHERE group_id=$2 RETURNING *", [group.group_name, id]);
  return result.rows[0] || null;
}

export async function deleteOne(id) {
  console.log("delete:" + id);
  const result = await pool.query("DELETE FROM groups WHERE group_id = $1 RETURNING *", [id]);
  return result.rows[0] || null;
}
