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
    const result = await pool.query("INSERT INTO messages (title, body, sender) VALUES ($1, $2, $3) RETURNING *", [message.title, message.body, message.sender]);
    return result.rows[0] || null;
}

export async function updateOne(id, message) {
    console.log("update:" + id);
    const result = await pool.query("UPDATE messages SET title=$1, body=$2, sender=$3 WHERE message_id=$4 RETURNING *", [message.title, message.body, message.sender, id]);
    return result.rows[0] || null;
}

export async function deleteOne(id) {
    console.log("delete:" + id);
    const result = await pool.query("DELETE FROM messages WHERE message_id = $1 RETURNING *", [id]);
    return result.rows[0] || null;
}
