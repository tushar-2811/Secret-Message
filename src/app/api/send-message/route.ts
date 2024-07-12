import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/db";
import UserModel from "@/model/User";
import { User } from "next-auth";
import { Message } from "@/model/types/model.types";

export async function POST(request: Request){
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

        const {userName , content} = await request.json();
        
        const existingUser = await UserModel.findOne({userName});

        if(!existingUser){
            return Response.json(
                {
                    success : false,
                    message : "User not found"
                },{status : 404}
            )
        }

        // If user is accepting messages or not
        if(!existingUser.isAcceptingMessage){
            return Response.json(
                {
                    success : false,
                    message : `${userName} is not accepting Messages`
                },{status : 403}
            )
        }

        const newMessage = {
            content : content,
            createdAt : new Date()
        }

        existingUser.messages.push(newMessage as Message);
        await existingUser.save();

        return Response.json(
            {
                success : true,
                message : "Message Sent Successfully"
            },{status : 201}
        )

    } catch (error) {
        console.log("Error while sending message" , error);
        return Response.json(
            {
                success : false,
                message : "Internal Server Error, while sending message"
            },{status : 500}
        )
    }
}