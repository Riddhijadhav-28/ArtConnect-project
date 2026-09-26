import Commission from "../models/Commission.js";
import Artist from "../models/ArtistProfile.js";

export const createCommission = async (req,res) => {
    try{
        const { artistId, title, description, budget, deadline} = req.body;

        const artist = await Artist.findById(artistId);

        if(!artist){
            return res.status(404).json({
                success: false,
                message: "Artist not found",
            });
        }

        if(!title || !description || !budget || !deadline){
            return res.status(400).json({
                success:false,
                message:"Please fill in all the commission details."
            });
        }

        if(Number(budget) <= 0){
            return res.status(400).json({
                success:false,
                message:"Budget must be greater than 0."
            });
        }

        if(new Date(deadline) <= new Date()){
            res.status(400).json({
                success: false,
                message:"Deadline  must be of future date.",
            });
        }

        const commission = await Commission.create({
            client: req.user.id,
            artist: artist._id,
            title,
            description,
            budget,
            deadline,
        })

        return res.status(201).json({
            success: true,
            message: "Commission request sent successfully",
            commission,
        })

    }catch(error){
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

export const getArtistCommissions = async(req,res) =>{
    try{
        const artist = await Artist.findOne({ user: req.user.id });

        if(!artist){
            return res.status(404).json({
                success: false,
                message: "Artist profile not found",
            });
        }

        const commissions = await Commission.find({
            artist: artist._id
        }).populate("client", "name email");

        res.status(200).json({
            success: true,
            commissions 
        });

    }catch(err){
        return res.status(500).json({
            success: false,
            message: err.message,
        })
    }
}

export const updateCommissionStatus = async(req,res) => {
    try{
        const { id } =  req.params;
        const {status} = req.body;

        const commission = await Commission.findById(id);
        if(!commission){
            return res.status(404).json({
                success: false,
                message: "Commission not found"
            });
        }

        const artist = await Artist.findOne({ user: req.user.id });

        if(!artist){
            return res.status(404).json({
                success: false,
                message: "Artist profile not found",
            });
        }

        if(commission.artist.toString() !== artist._id.toString()){
            return res.status(403).json({
                success: false,
                message: "Not authorized"
            });
        }
        const allowedStatuses = ["Accepted", "Rejected", "Completed"];

        if(!allowedStatuses.includes(status)){
            return res.status(400).json({
                success: false,
                message: "Invalid commission status"
            });
        }

        if(status=== "Rejected" && commission.status!== "Pending"){
            return res.status(400).json({
                success: false,
                message: "Only pending commissions can be rejected"
            })
        }

        if(status=== "Completed" && commission.status!== "Accepted"){
            return res.status(400).json({
                success: false,
                message: "Only accepted commissions can be completed"
            })
        }

        if(status=== "Accepted" && commission.status!== "Pending"){
            return res.status(400).json({
                success: false,
                message: "Only pending commissions can be accepted"
            })
        }

        const updatedCommission = await Commission.findByIdAndUpdate(
            id,
            {status},
            { new: true}
        );

        return res.status(200).json({
            success: true,
            message: "Commission status updated successfully",
            commission: updatedCommission
        });

    }catch(err){
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
}

export const getMyCommissions = async(req,res) =>{
    try{
        const commissions = await Commission.find({
            client: req.user.id
        }).populate("artist");

        res.status(200).json({
            success: true,
            commissions
        })
    }catch(error){
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}