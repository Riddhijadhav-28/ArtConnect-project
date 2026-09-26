import express from "express";
import { protect,isClient } from "../middleware/authMiddleware.js";
import { createReview, getArtistReviews } from "../controllers/review.js";

const router = express.Router();

router.post("/", protect,isClient, createReview);
router.get("/:artistId", getArtistReviews);

export default router;