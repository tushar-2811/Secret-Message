import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/db";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request){
    await dbConnect();
    try {
        const session = await getServerSession(authOptions);
        const user = session?.user as User;
        
        if(!session || !session.user){
            return Response.json(
                {
                    success : false,
                    message : "Not Authenticated"
                },{status : 401}
            )
        }

        const userId = new mongoose.Types.ObjectId(user._id);

        const User = await UserModel.aggregate([
            {
                $match : {
                    _id : userId
                }
            },
            {
                $unwind : '$messages'
            },
            {
                $sort : {'$messages.createdAt' : -1}
            },
            {
                $group : {
                    _id : '$_id',
                    messages : {
                        $push : '$messages'
                    }
                }
            }
        ])

        if(!User || User.length === 0){
            return Response.json(
                {
                    success : false,
                    message : "User Not Found"
                },{status : 404}
            )
        }

        return Response.json(
            {
                success : true,
                message : "All messages of User",
                messages : User[0].messages
            },{status : 201}
        )


        
    } catch (error) {
        console.log("failed to get-messages" , error);
        return Response.json(
            {
                success : false,
                message : "Internal Server Error, failed to get messages"
            },{status : 500}
        )
    }
}