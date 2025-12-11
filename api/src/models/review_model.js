import pool from "../database.js";


export async function getAll() {
  const result = await pool.query( 
    `SELECT reviews.*, users.username
     FROM reviews
     JOIN users ON reviews.user_id = users.user_id`);
  return result.rows; 
}

export async function getAllByMovieID(id) {
  const result = await pool.query( 
    `SELECT reviews.*, users.username
     FROM reviews
     JOIN users ON reviews.user_id = users.user_id
     WHERE reviews.movie_ID = $1`,
    [id]);
  return result.rows; 
}

export async function getAllByUserID(id) {
  const result = await pool.query( 
    `SELECT reviews.*, users.username
     FROM reviews
     JOIN users ON reviews.user_id = users.user_id
     WHERE reviews.user_id = $1`,
    [id]);
  return result.rows; 
}

export async function getOneByReviewID(id) {
  const result = await pool.query(
    `SELECT reviews.*, users.username
     FROM reviews
     JOIN users ON reviews.user_id = users.user_id
     WHERE reviews.review_id = $1`,
    [id]
  );

  return result.rows.length > 0 ? result.rows[0] : null;
}

export async function addOne(review,date) {
  const result = await pool.query("INSERT INTO reviews (movie_ID, review, user_ID, rating, review_date) VALUES($1, $2, $3, $4, $5) RETURNING *", [review.movie_ID, review.review, review.user_ID, review.rating, date]);
  return result.rows[0] || null;
}

export async function updateOne(id, review,date) {
  console.log("update:"+id);
  const result = await pool.query("UPDATE reviews SET review=$1, rating=$2, review_date=$3 WHERE review_ID=$4 RETURNING *", [review.review, review.rating, date, id]);
  return result.rows[0] || null;
}

export async function deleteOne(id) {
  console.log("delete:"+id);
  const result = await pool.query("DELETE FROM reviews WHERE review_ID = $1 RETURNING *", [id]);
  return result.rows[0] || null;
}
