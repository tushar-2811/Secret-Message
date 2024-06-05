import { Document } from "mongoose";

export interface Message extends Document{
    content : string;
    createdAt : Date;
}

export interface User extends Document{
    userName : string;
    email : string;
    password : string;
    verifyCode : string;
    verifyCodeExpiry : Date;
    isVerified : boolean;
    isAcceptingMessage : boolean;
    messages : Message[]
}