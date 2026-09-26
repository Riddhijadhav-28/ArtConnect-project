import express from "express";
import {  createArtwork, deleteArtwork, getAllArtworks, getArtworkById, updateArtistArtwork,getArtworksByArtist } from "../controllers/artworkController.js";
import { protect, isArtist } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/", protect, isArtist, upload.single("image"), createArtwork);
router.get("/", getAllArtworks);
router.get("/:id", getArtworkById);
router.get("/artist/:artistId", getArtworksByArtist);
router.put("/:id", protect, isArtist, updateArtistArtwork);
router.delete("/:id", protect, isArtist, deleteArtwork);

export default router;
