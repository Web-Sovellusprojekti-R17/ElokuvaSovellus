import express from "express";
import FavoriteController from "../controllers/favorite_controller.js";
import { authenticateToken } from "../utils/auth.js";

const router = express.Router();

router.post("/", authenticateToken, FavoriteController.add);
router.delete("/", authenticateToken, FavoriteController.remove);
router.get("/:id", authenticateToken, FavoriteController.list);

export default router;
