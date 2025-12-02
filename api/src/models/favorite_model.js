import pool from "../database.js";

class FavoriteModel {
    static async addFavorite(user_id, movie_id) {
        const sql = `
      INSERT INTO favorites (user_id, movie_id)
      VALUES ($1, $2)
      ON CONFLICT DO NOTHING
      RETURNING *;
    `;
        const result = await pool.query(sql, [user_id, movie_id]);
        return result.rows[0];
    }

    static async removeFavorite(user_id, movie_id) {
        const sql = `DELETE FROM favorites WHERE user_id = $1 AND movie_id = $2`;
        await pool.query(sql, [user_id, movie_id]);
        return true;
    }

    static async getFavorites(user_id) {
        const sql = `
      SELECT movie_id FROM favorites
      WHERE user_id = $1;
    `;
        const result = await pool.query(sql, [user_id]);
        return result.rows.map(row => row.movie_id);
    }
}

export default FavoriteModel;
