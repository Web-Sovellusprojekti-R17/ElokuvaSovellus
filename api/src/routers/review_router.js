import { Router } from "express";
import { getReviews, getReview, addReview, updateReview, deleteReview } from "../controllers/review_controller.js";


const reviewRouter = Router();

reviewRouter.get("/", getReviews);
reviewRouter.get("/:id", getReview);
reviewRouter.post("/", addReview);
reviewRouter.put("/:id", updateReview);
reviewRouter.delete("/:id", deleteReview);

export default reviewRouter;
