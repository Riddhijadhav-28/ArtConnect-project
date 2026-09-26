import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req,res,next) => {
    try{
        const authHeader = req.header("Authorization");

        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(401).json({
                success: false,
                message:"Access Denied. No valid token provided."
            });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");

        if(!user){
            return res.status(401).json({
                success:false,
                message:"User not found."
            });
        }

        req.user = user;

        next();
    }catch(err){
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token."
        });
    }
}

export const isArtist = (req,res,next) => {
    if(req.user.role !== "artist"){
        return res.status(403).json({
            success: false,
            message: "Only artists can access this feature.",
        });
    }

    next();
}

export const isClient = (req,res,next) => {
    if(req.user.role !== "client"){
        return res.status(403).json({
            success: false,
            message: "Only clients can access this feature.",
        });
    }

    next();
}
