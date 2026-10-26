import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
  {
    commission: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Commission",
      required: true,
      unique: true
    },

    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Artist",
      required: true
    },

    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    invoiceNumber: {
      type: String,
      required: true,
      unique: true
    },

    commissionTitle: {
      type: String,
      required: true
    },

    description: {
      type: String,
      default: ""
    },

    amount: {
      type: Number,
      required: true,
      min: 0
    },

    issueDate: {
      type: Date,
      default: Date.now
    },

    dueDate: {
      type: Date,
      required: true
    },

    paymentMethod: {
    type: String,
    enum: ["UPI", "Cash", "Bank Transfer", "Other"],
    default: null
   },

    paymentStatus: {
      type: String,
      enum: ["Unpaid", "Paid"],
      default: "Unpaid"
    },

    paidAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

const Invoice = mongoose.model("Invoice", invoiceSchema);

export default Invoice;