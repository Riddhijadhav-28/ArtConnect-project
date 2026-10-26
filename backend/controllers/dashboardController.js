import Artist from "../models/ArtistProfile.js";
import Artwork from "../models/Artwork.js";
import Commission from "../models/Commission.js";
import Review from "../models/Review.js";

export const getArtistDashboard = async(req,res) =>{
    try{
        const artist = await Artist.findOne({ user: req.user.id });
        if(!artist){
            return res.status(404).json({
                success: false,
                message: "Artist profile not found"
            });
        }

        const totalArtworks = await Artwork.countDocuments({ artist: artist._id });

        const totalCommissions = await Commission.countDocuments({ artist: artist._id });

        const pendingCommissions = await Commission.countDocuments({ 
            artist: artist._id,
            status: "Pending"
        });

        const acceptedCommissions = await Commission.countDocuments({
            artist: artist._id,
            status: "Accepted"
        });

        const rejectedCommissions = await Commission.countDocuments({
            artist: artist._id,
            status: "Rejected"
        });

        const completedCommissions = await Commission.countDocuments({
            artist: artist._id,
            status: "Completed"
        });


        const totalReviews = await Review.countDocuments({ artist: artist._id });

        const averageRating = await Review.aggregate([
            {
                $match: {
                    artist: artist._id
                }
            },
            {
                $group:{
                    _id: "$artist",
                    averageRating:{ 
                        $avg:"$rating"
                    }
                }
            }
        ]);

        const avgRating = averageRating.length>0 ? averageRating[0].averageRating : 0;

        const recentCommissions = await Commission.find({
            artist: artist._id
        }).populate("client", "name email")
        .sort({ createdAt: -1 }).limit(5);

        const recentReviews = await Review.find({
            artist: artist._id
        }).populate("client", "name").sort({ createdAt: -1 }).limit(5);

        return res.status(200).json({
            success: true,
            dashboard: {
                totalArtworks,
                totalCommissions,
                pendingCommissions,
                acceptedCommissions,
                rejectedCommissions,
                completedCommissions,
                totalReviews,
                averageRating: avgRating,
                recentCommissions,
                recentReviews
            }
        });
        
    }catch(err){
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

export const getClientDashboard = async(req,res) => {   
    try{
        const totalCommissions = await Commission.countDocuments({ client: req.user.id});

        const pendingCommissions = await Commission.countDocuments({
            client: req.user.id,
            status: "Pending"
        });

        const acceptedCommissions = await Commission.countDocuments({
            client: req.user.id,
            status: "Accepted"
        });

        const rejectedCommissions = await Commission.countDocuments({
            client: req.user.id,
            status: "Rejected"
        });

        const completedCommissions = await Commission.countDocuments({
            client: req.user.id,
            status: "Completed"
        });
        
        const recentCommissions = await Commission.find({
            client: req.user.id
        }).populate("artist", "artistName").sort({ createdAt: -1}).limit(5);

        return res.status(200).json({
            success: true,
            dashboard: {
                totalCommissions,
                pendingCommissions,
                acceptedCommissions,
                rejectedCommissions,
                completedCommissions,
                recentCommissions
            }
        })

    }catch(err){
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}
