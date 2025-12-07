import express from "express";
import {getFavorites, getByUserID, toggleFavorite, getIsFavorite} from "../controllers/favorite_controller.js";
import { authenticateToken } from "../utils/auth.js";

const router = express.Router();

router.post("/", authenticateToken, toggleFavorite);
router.get("/:id", authenticateToken, getByUserID);
router.post("/check",authenticateToken, getIsFavorite);
router.get("/", authenticateToken, getFavorites);

export default router;
