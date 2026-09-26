import Artwork from "../models/Artwork.js";
import Artist from "../models/ArtistProfile.js";
import cloudinary from "../config/cloudinary.js";

export const createArtwork = async(req,res) => {
    try{
        const artist = await Artist.findOne({ user: req.user.id});

        if(!artist){
            return res.status(404).json({
                success: false,
                message: "Artist Profile not found",
            });
        }

        if(!req.file){
            return res.status(400).json({
                success: false,
                message: "Please upload an image",
            });
        }
        const result = await cloudinary.uploader.upload(req.file.path);

        const artwork = await Artwork.create({ 
            title: req.body.title,
            description: req.body.description,
            category:req.body.category,
            image: result.secure_url,
            artist: artist._id,
        });

        
        
        res.status(201).json({
            success: true,
            message: "Artwork uploaded successfullly",
            artwork,
        });

    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

export const getAllArtworks = async(req,res) => {
    try{
        const artworks = await Artwork.find().populate("artist");

        res.status(200).json({
            success: true,
            count: artworks.length,
            artworks,
        });

    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

export const getArtworkById = async(req,res) => {
    try{
        const { id } = req.params;

        const artwork = await Artwork.findById(id).populate("artist");

        if(!artwork){
            return res.status(404).json({
                success: false,
                message: "Artwork not found",
            });
        }

        res.status(200).json({
            success: true,
            artwork,
        });


    }catch(error){
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

export const getArtworksByArtist = async(req,res) =>{
    try{
        const { artistId } =req.params;

        const artworks = await Artwork.find({
            artist: artistId
        });

        res.status(200).json({
            success: true,
            artworks,
        })
    }catch(error){
        res.status(500).json({
            success:false,
            message: error.message,
        });
    }
}

export const updateArtistArtwork = async(req,res) => {
    try{
        const { id } = req.params;

        const artwork = await Artwork.findById(id);

        if(!artwork){
            return res.status(404).json({
                success: false,
                message: "Artwork not found",
            });
        }

        const artist = await Artist.findOne({ user: req.user.id });

        if(!artist){
            return res.status(404).json({
                success: false,
                message: "Artist Profile not found.",
            });
        }

        if(artwork.artist.toString() !== artist._id.toString()){
            return res.status(403).json({
                success: false,
                message: "You can only update your own artwork"
            });
        }

        const updateArtwork = await Artwork.findByIdAndUpdate(
            id,
            req.body,
            {
                new: true
            }
        );

        res.status(200).json({
            success: true,
            message: "Artwork updated successfully",
            artwork : updateArtwork
        });

    }catch(error){
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

export const deleteArtwork = async(req,res) => {
    try{
        const {id} = req.params;

        const artwork = await Artwork.findById(id);

        if(!artwork){
            return res.status(404).json({
                success: false,
                message: "Artwork not found",
            });
        }

        const artist = await Artist.findOne({ user: req.user.id });

        if(!artist){
            return res.status(404).json({
                success: false,
                message: "Artist Profile not found.",
            });
        }

        if(artwork.artist.toString() !== artist._id.toString()){
            return res.status(403).json({
                success: false,
                message: "You can only delete your own artwork"
            });
        }

        const deleteArtwork = await Artwork.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Artwork deleted successfully",
            artwork : deleteArtwork
        });


    }catch(error){
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}