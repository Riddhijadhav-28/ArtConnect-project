import mongoose from "mongoose";

const commissionSchema = new mongoose.Schema({
    client:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    artist:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Artist",
        required: true,
    },
    title:{
        type: String,
        required: true,
        trim: true,
    },
    description:{
        type: String,
        required: true,
        trim: true,
    },
    budget:{
        type: Number,
        required: true,
    },
    deadline:{
        type: Date,
    },
    status:{
        type: String,
        enum: ["Pending", "Accepted", "Rejected", "Completed"],
        default: "Pending",
    },
},
{
    timestamps: true,
}
);

const Commission = mongoose.model("Commission", commissionSchema);

export default Commission;