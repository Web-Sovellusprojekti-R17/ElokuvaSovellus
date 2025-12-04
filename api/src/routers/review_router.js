import { Router } from "express";
import { getReviews, getReviewByID, getReviewsByMovieID, getReviewsByUserID, addReview, updateReview, deleteReview } from "../controllers/review_controller.js";
import { authenticateToken } from "../utils/auth.js";

const reviewRouter = Router();

reviewRouter.get("/", getReviews);
reviewRouter.get("/:id", getReviewByID);
reviewRouter.get("/movie/:id", getReviewsByMovieID);
reviewRouter.get("/user/:id", getReviewsByUserID);
reviewRouter.post("/", authenticateToken, addReview);
reviewRouter.put("/:id", authenticateToken, updateReview);
reviewRouter.delete("/:id", authenticateToken, deleteReview);

export default reviewRouter;
