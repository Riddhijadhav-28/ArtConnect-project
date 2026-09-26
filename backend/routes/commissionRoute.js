import express from "express";
import { createCommission, getArtistCommissions, getMyCommissions, updateCommissionStatus } from "../controllers/commission.js";
import { isArtist,isClient, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, isClient, createCommission);
router.get("/artist", protect, isArtist, getArtistCommissions);
router.put("/:id/status",protect, isArtist, updateCommissionStatus);
router.get("/my", protect,isClient, getMyCommissions);

export default router;
