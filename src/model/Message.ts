import mongoose, { Schema } from "mongoose";
import { Message } from "./types/model.types";

export const MessageSchema: Schema<Message> = new Schema({
      content : {
        type : String,
        required : true,
      },
      createdAt : {
        type : Date,
        required : true,
        default : Date.now
      }
})