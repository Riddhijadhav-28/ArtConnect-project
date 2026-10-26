import express from "express";

import {
  createInvoice,
  getArtistInvoices,
  getClientInvoices,
  markInvoicePaid,
  updatePaymentMethod
} from "../controllers/invoice.js";

import {
  protect,
  isArtist,
  isClient
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, isArtist, createInvoice);

router.get("/artist", protect, isArtist, getArtistInvoices);

router.get("/client", protect, isClient, getClientInvoices);

router.patch("/:id/paid", protect, isArtist, markInvoicePaid);
router.patch("/:id/payment-method", protect, isClient, updatePaymentMethod);

export default router;