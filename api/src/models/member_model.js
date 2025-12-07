import pool from "../database.js";


export async function getAll() {
  const result = await pool.query("SELECT * FROM members");
  return result.rows;
}


export async function getOne(groupId, userId) {
  const result = await pool.query(
    "SELECT * FROM members WHERE group_id = $1 AND user_id = $2",
    [groupId, userId]
  );
  return result.rows[0] || null;
}


export async function addOne(member) {
  const result = await pool.query(
    `INSERT INTO members (group_id, user_id, role)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [member.group_id, member.user_id, member.role || "Pending"]
  );
  return result.rows[0] || null;
}

export async function getKaikkiJasenet(id) {
  const result = await pool.query("SELECT username, role, members.user_id, group_id FROM users INNER JOIN members ON users.user_id = members.user_id WHERE group_id = $1", [id]);
  return result.rows; 
}

export async function updateOne(groupId, userId, role) {
  const result = await pool.query(
    `UPDATE members
     SET role = $1
     WHERE group_id = $2 AND user_id = $3
     RETURNING *`,
    [role, groupId, userId]
  );
  return result.rows[0] || null;
}


export async function deleteOne(groupId, userId) {
  const result = await pool.query(
    `DELETE FROM members
     WHERE group_id = $1 AND user_id = $2
     RETURNING *`,
    [groupId, userId]
  );
  return result.rows[0] || null;
}
