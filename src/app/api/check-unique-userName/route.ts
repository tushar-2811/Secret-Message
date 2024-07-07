import dbConnect from "@/lib/db";
import UserModel from "@/model/User";
import {z} from 'zod';
import { userNameValidation } from "@/schemas/signUpSchema";


const userNameQuerySchema = z.object({
    userName : userNameValidation
});

export async function GET(request: Request) {
    dbConnect();
    try {
        const {searchParams} = new URL(request.url);
        const queryParams = {
            userName : searchParams.get("userName")
        }

       const parsedUserName = userNameQuerySchema.safeParse(queryParams);

       if(!parsedUserName.success){        
        const userNameErrors = parsedUserName.error.format().userName?._errors || [];
          return Response.json(
            {
                success : false,
                message : userNameErrors?.length > 0 ? userNameErrors.join(', ') : "Invalid query parameters"

            },{status : 400}
          )
       }

       const {userName} = parsedUserName.data;

       const existingVerifiedUser = await UserModel.findOne({
        userName , isVerified : true
       });

       if(existingVerifiedUser){
        return Response.json(
            {
                success : false,
                message : "userName is already taken"
            },{status : 400}
          )
       }

       return Response.json(
        {
            success : true,
            message : "userName is available"
        },{status : 200}
      )
    } catch (error) {
        console.error("Error while checking UserName" , error);
        return Response.json(
            {
                success : false,
                message : "Error while checking userName"
            },
            {status : 400}
        )
    }
}