import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async(req,res)=>{
    try{
        const {name, email, password, role }= req.body;

        if(!name|| !email|| !password|| !role){
            return res.status(400).json({
                success:false,
                message:"Please fill all the required fields."
            })
        }

        if(!["artist", "client"].includes(role)){
            return res.status(400).json({
                success:false,
                message:"Invalid user role."
            })
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role
        });

        return res.status(201).json({
            message: "User Registered successfully",
            success: true,
            user:{
                id: user._id,
                name:user.name,
                email:user.email,
                role:user.role,
                profileImage:user.profileImage
            }
        });


    }catch(err){
        return res.status(500).json({
            success:false,
            message: err.message
        });
    }
};

export const login = async(req,res) => {
    try{
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({
                success: false,
                message:"Please enter email and password."
            });
        }

        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({
                success: false,
                message: "Invalid Email"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(400).json({
                success: false,
                message: "Invalid Password"
            })
        }

        const token = jwt.sign({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        },
        process.env.JWT_SECRET,{ expiresIn: "7d"}
        );

        return res.status(200).json({
            success: true,
            message: "Login Successful",
            token,
            user:{
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profileImage: user.profileImage
            }
        })

    }catch(err){
        return res.status(500).json({
            success:false,
            message: err.message,
        });
    }
}