import mongoose from "mongoose";

const artworkSchema = new mongoose.Schema({
    artist:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Artist",
        required: true,
    },
    title:{
        type: String,
        required: true,
        trim: true,
    },
    description:{
        type:String,
        trim: true,
    },
    image:{
        type:String,
        required: true,
        default:""
    },
    category:{
        type: String,
        required: true,
        trim: true,
        default:"Other",
    },
},
{
    timestamps: true,
}
);

const Artwork = mongoose.model("Artwork", artworkSchema);

export default Artwork;