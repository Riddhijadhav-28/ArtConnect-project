import express from "express";
import { createArtistProfile, getAllArtists, getArtistById, getMyArtistProfile, updateArtistProfile } from "../controllers/artistController.js";
import { protect, isArtist } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", protect,isArtist, createArtistProfile);
router.get("/me", protect, isArtist, getMyArtistProfile);
router.put("/me", protect, isArtist, updateArtistProfile);
router.get("/", getAllArtists);
router.get("/:id", getArtistById);

export default router;