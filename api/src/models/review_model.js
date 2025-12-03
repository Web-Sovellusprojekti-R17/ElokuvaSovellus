import pool from "../database.js";


export async function getAll() {
  const result = await pool.query("SELECT * FROM reviews");
  return result.rows; 
}

export async function getOne(id) {
  const result = await pool.query(`SELECT reviews.*, users.username FROM reviews
    JOIN users ON reviews.user_id = users.user_id 
    WHERE movie_ID = $1`, [id]);
  return result.rows.length > 0 ? result.rows : null;
  //return result.rows[0] || null; <- ^ nämä on sama asia eri tavalla kirjoitettuna
}

export async function addOne(review) {
  const result = await pool.query("INSERT INTO reviews (movie_ID, review, user_ID, rating, author) VALUES($1, $2, $3, $4, $5) RETURNING *", [review.movie_ID, review.review, review.user_ID, review.rating, review.author]);
  return result.rows[0] || null;
}

export async function updateOne(id, review) {
  console.log("update:"+id);
  const result = await pool.query("UPDATE reviews SET review=$1, rating=$2 WHERE review_ID=$3 RETURNING *", [review.review, review.rating, id]);
  return result.rows[0] || null;
}

export async function deleteOne(id) {
  console.log("delete:"+id);
  const result = await pool.query("DELETE FROM reviews WHERE review_ID = $1 RETURNING *", [id]);
  return result.rows[0] || null;
}
