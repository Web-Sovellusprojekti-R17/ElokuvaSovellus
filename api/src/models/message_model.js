import pool from "../database.js";

export async function getAll() {
    const result = await pool.query("SELECT * FROM messages");
    return result.rows;
}

export async function getOne(id) {
    const result = await pool.query("SELECT * FROM messages WHERE message_id = $1", [id]);
    return result.rows.length > 0 ? result.rows[0] : null;

}

export async function addOne(message) {
    const result = await pool.query("INSERT INTO messages (text, user_id, group_id) VALUES ($1, $2, $3) RETURNING *", [message.text, message.user_id, message.group_id]);
    return result.rows[0] || null;
}

export async function updateOne(id, message) {
    console.log("update:" + id);
    const result = await pool.query("UPDATE messages SET text=$1, user_id=$2, group_id=$3 WHERE message_id=$4 RETURNING *", [message.text, message.user_id, message.group_id, id]);
    return result.rows[0] || null;
}

export async function deleteOne(id) {
    console.log("delete:" + id);
    const result = await pool.query("DELETE FROM messages WHERE message_id = $1 RETURNING *", [id]);
    return result.rows[0] || null;
}
