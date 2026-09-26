import mongoose from "mongoose";

const artistSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    },
    artistName: {
        type: String,
        required: true,
        trim: true,
    },
    bio: {
        type: String,
        required: true,
    },
    profileImage: {
        type: String,
        default: "",
    },
    genres: [
        {
            type: String,
        },
    ],
    socialLinks: {
        instagram: String,
        twitter: String,
        website: String,
    },
      
},
{
    timestamps: true,
});

const Artist = mongoose.model("Artist", artistSchema );

export default Artist;