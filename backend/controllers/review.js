import Review from "../models/Review.js";
import Commission from "../models/Commission.js";
import Artist from "../models/ArtistProfile.js";

export const createReview = async(req,res) => {
    try{
        const { artistId, rating, comment} = req.body;

        const artist = await Artist.findById(artistId);

        if(!artist){
            return res.status(404).json({
                success: false,
                message: "Artist not found"
            });
        }

        const completedCommission = await Commission.findOne({ 
            client: req.user.id,
            artist: artistId,
            status: "Completed",
         });

         if(!completedCommission){
            return res.status(403).json({
                success: false,
                message: "You can only review artists after a completed commission."
            });
         }

         const existingReview = await Review.findOne({
            client: req.user.id,
            artist: artistId,
         });

         if(existingReview){
         return res.status(400).json({
            success: false,
            message:"You have already reviewed this artist." 
         });
        }

        if(!rating || rating< 1 || rating>5){
            return res.status(400).json({
                success: false,
                message: "Rating must be between 1 and 5."
            });
        }

        if(!comment || comment.trim() === ""){
            return res.status(400).json({
                success: false,
                message: "Please enter a review comment."
            })
        }
        
        const review = await Review.create({
            client: req.user.id,
            artist: artistId,
            rating,
            comment
        });

        return res.status(201).json({
            success: true,
            message: "Review added successfully",
            review
        });

    }catch(err){
        return res.status(500).json({
            success: true,
            message: err.message,
        });
    }
};

export const getArtistReviews = async(req,res) =>{
    try{
        const { artistId } = req.params;

        const reviews = await Review.find({
            artist: artistId
        }).populate("client", "name");

        return res.status(200).json({
            success: true,
            reviews
        });

    }catch(err){
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}
