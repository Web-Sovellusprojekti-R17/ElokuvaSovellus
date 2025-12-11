import pool from "../database.js";

export async function getAll() {
    const result = await pool.query(
        `SELECT messages.*, users.username
     FROM messages
     JOIN users ON messages.user_id = users.user_id`);
    return result.rows;
}

export async function getOne(id) {
    const result = await pool.query(`SELECT messages.*, users.username
     FROM messages
     JOIN users ON messages.user_id = users.user_id
     WHERE messages.message_id = $1`,
        [id]);
    return result.rows.length > 0 ? result.rows[0] : null;
}

export async function getOneGroup(id) {
    const result = await pool.query(
        `SELECT messages.*, users.username
     FROM messages
     JOIN users ON messages.user_id = users.user_id
     WHERE messages.group_id = $1`,
        [id]);
    return result.rows;
}

export async function addOne({ text, user_id, group_id, movie_id = null, movie_title = null, movie_poster = null }) {
    const query = `
        INSERT INTO messages (text, user_id, group_id, movie_id, movie_title, movie_poster)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
    `;
    const values = [text, user_id, group_id, movie_id, movie_title, movie_poster];
    const { rows } = await pool.query(query, values);
    return rows[0];
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
