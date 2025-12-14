import { getAll, getOneByReviewID, getAllByMovieID, getAllByUserID, addOne, updateOne, deleteOne } from "../models/review_model.js";
import { ApiError } from "../helpers/ApiError.js";


export async function getReviews(req, res, next) {
  try {
    const reviews = await getAll();
    res.status(200).json(reviews);
  } catch (err) {
    next(err);
  }
}

export async function getReviewByID(req, res, next) {
  const id = req.params.id;
  try {
    const review = await getOneByReviewID(id);
    if (!review)
      return next(new ApiError("Review not found", 404));

    res.status(200).json(review);
  } catch (err) {
    next(err);
  }
}

export async function getReviewsByMovieID(req, res, next) {
  const id = req.params.id;
  try {
    const review = await getAllByMovieID(id);

    res.status(200).json(review);
  } catch (err) {
    next(err);
  }
}

export async function getReviewsByUserID(req, res, next) {
  const id = req.params.id;
  try {
    const review = await getAllByUserID(id);

    res.status(200).json(review);
  } catch (err) {
    next(err);
  }
}

export async function addReview(req, res, next) {
  console.log("add called");
  console.log(req.body);
  const review = req.body;
  try {
    if(!review.movie_ID || !review.review || !review.user_ID || !review.rating)
     return next(new ApiError("Required data missing", 400));  
  
    const response = await addOne(review);
    console.log("Review added:", response);
    res.status(201).json(response);
  } catch (err) {
    next(err);
  }
}

export async function updateReview(req, res, next) {
  const review = req.body;
  const id = req.params.id;
  try {
    const response = await updateOne(id, review);
    if(!response)
      return next(new ApiError("Review not found", 404));
    console.log("Review updated:", response);
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
}

export async function deleteReview(req, res, next) {
  try {
    const review = await deleteOne(req.params.id);
    if (!review)
      return next(new ApiError("Review not found", 404));

    res.status(200).json(review);
  } catch (err) {
    next(err);
  }
}