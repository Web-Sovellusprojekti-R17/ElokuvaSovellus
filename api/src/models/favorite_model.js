import pool from "../database.js";

export async function addFavorite(user_id, movie_id) {
    const result = await pool.query(`INSERT INTO favorites (user_id, movie_id) VALUES ($1, $2) RETURNING *`, [user_id, movie_id]);
    return result.rows[0] || null;
}

export async function removeFavorite(user_id, movie_id) {
    const sql = `DELETE FROM favorites WHERE user_id = $1 AND movie_id = $2 RETURNING *`;
    const result = await pool.query(sql, [user_id, movie_id]);
    return result.rows[0] || null;
}

export async function getFavoritesForUser(user_id) {
    const result = await pool.query(`SELECT movie_id FROM favorites WHERE user_id = $1`, [user_id]);
    return result.rows.map(row => row.movie_id) || []; 
}

export async function getAll() {
    const result = await pool.query(`SELECT * FROM favorites`);
    return result.rows || null;
}

export async function isFavorite(user_id, movie_id) {
    const result = await pool.query(`SELECT * FROM favorites WHERE user_id = $1 AND movie_id = $2`, [user_id, movie_id]);
    return result.rows.length > 0;
}