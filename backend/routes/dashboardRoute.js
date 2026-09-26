import express from "express"
import {protect, isArtist,isClient} from "../middleware/authMiddleware.js";
import { getArtistDashboard, getClientDashboard } from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/artist", protect, isArtist, getArtistDashboard);
router.get("/client", protect, isClient, getClientDashboard);

export default router;