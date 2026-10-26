import Invoice from "../models/Invoice.js";
import Commission from "../models/Commission.js";
import Artist from "../models/ArtistProfile.js";

// Generate an invoice for an accepted commission
export const createInvoice = async (req, res) => {
  try {
    const { commissionId, amount, dueDate } = req.body;

    if (
      !commissionId ||
      amount === undefined ||
      amount === null ||
      amount === "" ||
      !Number.isFinite(Number(amount)) ||
      Number(amount) < 0 ||
      !dueDate
    ) {
      return res.status(400).json({
        message: "Please provide all required invoice details.",
      });
    }

    if (!Number.isFinite(Number(amount)) || Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invoice amount must be greater than zero.",
      });
    }

    const parsedDueDate = new Date(dueDate);

    if (Number.isNaN(parsedDueDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid due date.",
      });
    }

    const commission = await Commission.findById(commissionId);

    if (!commission) {
      return res.status(404).json({
        success: false,
        message: "Commission not found.",
      });
    }

    if (commission.status !== "Accepted") {
      return res.status(400).json({
        success: false,
        message: "An invoice can only be generated for an accepted commission.",
      });
    }

    const artist = await Artist.findOne({ user: req.user.id });

    if (!artist || commission.artist.toString() !== artist._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to invoice this commission.",
      });
    }

    const existingInvoice = await Invoice.findOne({
      commission: commission._id,
    });

    if (existingInvoice) {
      return res.status(409).json({
        success: false,
        message: "An invoice already exists for this commission.",
      });
    }

    const invoiceNumber = `AC-${Date.now()}`;

    const invoice = await Invoice.create({
      commission: commission._id,
      artist: artist._id,
      client: commission.client,
      invoiceNumber,
      commissionTitle: commission.title,
      description: commission.description,
      amount: Number(amount),
      dueDate: parsedDueDate,
    });

    return res.status(201).json({
      success: true,
      message: "Invoice generated successfully.",
      invoice,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "An invoice already exists for this commission.",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get invoices belonging to the logged-in artist
export const getArtistInvoices = async (req, res) => {
  try {
    const artist = await Artist.findOne({ user: req.user.id });

    if (!artist) {
      return res.status(404).json({
        success: false,
        message: "Artist profile not found.",
      });
    }

    const invoices = await Invoice.find({
      artist: artist._id,
    })
      .populate("client", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      invoices,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get invoices belonging to the logged-in client
export const getClientInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({
      client: req.user.id,
    })
      .populate("artist", "artistName")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      invoices,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Artist confirms receipt of offline payment
export const markInvoicePaid = async (req, res) => {
  try {
    const artist = await Artist.findOne({ user: req.user.id });

    if (!artist) {
      return res.status(404).json({
        success: false,
        message: "Artist profile not found.",
      });
    }

    const invoice = await Invoice.findOne({
      _id: req.params.id,
      artist: artist._id,
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found.",
      });
    }

    if (invoice.paymentStatus === "Paid") {
      return res.status(400).json({
        success: false,
        message: "This invoice is already marked as paid.",
      });
    }

    invoice.paymentStatus = "Paid";
    invoice.paidAt = new Date();

    await invoice.save();

    return res.status(200).json({
      success: true,
      message: "Payment confirmed successfully.",
      invoice,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updatePaymentMethod = async (req, res) => {
  try {
    const { paymentMethod } = req.body;

    const allowedMethods = ["UPI", "Cash", "Bank Transfer", "Other"];

    if (!allowedMethods.includes(paymentMethod)) {
      return res.status(400).json({
        message: "Please select a valid payment method.",
      });
    }

    const invoice = await Invoice.findOne({
      _id: req.params.id,
      client: req.user.id,
    });

    if (!invoice) {
      return res.status(404).json({
        message: "Invoice not found.",
      });
    }

    if (invoice.paymentStatus === "Paid") {
      return res.status(400).json({
        message:
          "Payment method cannot be changed after payment is marked as paid.",
      });
    }

    invoice.paymentMethod = paymentMethod;

    await invoice.save();

    res.status(200).json({
      message: "Payment method saved successfully.",
      invoice,
    });
  } catch (error) {
    console.error("Update payment method error:", error);

    res.status(500).json({
      message: "Unable to update payment method.",
    });
  }
};
