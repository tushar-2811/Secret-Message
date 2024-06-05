import mongoose , {Schema} from "mongoose";
import { User } from "./types/model.types";
import { MessageSchema } from "./Message";

const userSchema:Schema<User> = new Schema({
     userName : {
        type : String,
        required : [true , "userName is required"],
        trim : true,
        umique : true
     },
     email : {
        type : String,
        required : [true , "email is required"],
        unique : true,
        match : [/.+\@.+\..+/ , "Please provide a valid email address"]
     },
     password : {
        type : String,
        required : [true , "password is required"],
     },
     verifyCode : {
        type : String,
        required : [true , "verifyCode is required"],
     },
     verifyCodeExpiry : {
        type : Date,
        required : [true , "verifyCodeExpiry is required"],
     },
     isVerified : {
        type : Boolean,
        default : false
     },
     isAcceptingMessage : {
        type : Boolean,
        default : true
     },
     messages : [MessageSchema]

});

const UserModel = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>("User" , userSchema));

export default UserModel;

