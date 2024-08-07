import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User";
import dbConnect from "@/lib/db";
import { User } from "next-auth";


// toggle the accepting messages status
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

        const userId = user._id;
        const {acceptMessages} = await request.json();

        const updatedUser = await UserModel.findByIdAndUpdate(userId , {
            isAcceptingMessage : acceptMessages
        }, {new : true});

        if(!updatedUser){
            return Response.json(
                {
                    success : false,
                    message : "failed to update user status to accept messages"
                },{status : 401}
            )
        }

        return Response.json(
            {
                success : true,
                message : "Message acceptance status updated successfully"
            },{status : 201}
        )
    
      } catch (error) {
        console.log("failed to update user status for accepting messages" , error);
        return Response.json(
            {
                success : false,
                message : "failed to update user status for accepting messages"
            },{status : 500}
        )
      }
}



// checking if current user is accepting messages or not
export async function GET(request: Request) {
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

        const userId = user._id;
        

        const existingUser = await UserModel.findById(userId);

        if(!existingUser){
            return Response.json(
                {
                    success : false,
                    message : "user not found"
                },{status : 404}
            )
        }

        return Response.json(
            {
                success : true,
                isAcceptingMessages : existingUser.isAcceptingMessage,
                message : "Message acceptance status "
            },{status : 201}
        )
    
      } catch (error) {
        console.log("failed to get user status for accepting messages" , error);
        return Response.json(
            {
                success : false,
                message : "failed to get user status for accepting messages"
            },{status : 500}
        )
      }
}