import mongoose from "mongoose"
import { Schema } from "mongoose"

const UserSchema = new Schema({
    name:{
        type:String,
        unique: true,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    },
    role:{
        type: String,
        enum: ["artist", "client"],
        required: true,
    },
    profileImage:{
        type: String,
        default:"",
    },
    bio:{
        type: String,
        default:"",
    },
    artStyle:{
        type: String,
        default:""
    },
},
{
    timestamps: true,
}
)

const User = mongoose.model("User", UserSchema);

export default  User;
