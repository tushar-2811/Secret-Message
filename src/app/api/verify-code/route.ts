import dbConnect from "@/lib/db";
import UserModel from "@/model/User";
import { verifySchema } from "@/schemas/verifySchema";

export async function POST(request: Request) {
     await dbConnect();
      try {
        const {code , userName} = await request.json();
        const decodedUserName = decodeURIComponent(userName);

       
        const parsedCode = verifySchema.safeParse({code});

        if(!parsedCode.success){
            const verifyCodeErrors = parsedCode.error.format().code?._errors || [];

            return Response.json(
                {
                    success : false,
                    message : verifyCodeErrors?.length > 0 ? verifyCodeErrors.join(', ') : "Invalid code"
                },{status : 400}
            )
        }

        const existingUnVerifiedUser = await UserModel.findOne({
            userName : decodedUserName
        })

        // user not found
        if(!existingUnVerifiedUser){
            return Response.json(
                {
                    success : false,
                    message : "User not found"
                },{status : 400}
            )
        }
        // user is already verified
        if(existingUnVerifiedUser.isVerified){
            return Response.json(
                {
                    success : false,
                    message : "User already Verified"
                },{status : 400}
            )
        }

        const isCodeValid = code === existingUnVerifiedUser.verifyCode;
        const isCodeNotExpired = new Date(existingUnVerifiedUser.verifyCodeExpiry) > new Date();

        if(isCodeValid && isCodeNotExpired){
            existingUnVerifiedUser.isVerified = true;
            await existingUnVerifiedUser.save();

            return Response.json(
                {
                    success : true,
                    message : "Verification is Completed."
                },{status : 201}
            )
        }else if(!isCodeNotExpired){
            return Response.json(
                {
                    success : false,
                    message : "Verification Code has Expired , Please SignUp again"
                },{status : 400}
            )
        }else{
            return Response.json(
                {
                    success : false,
                    message : "Incorrect Verification Code"
                },{status : 400}
            )
        }


      } catch (error) {
        console.error('Error while verifying code',error);
        return Response.json(
            {
                success : false,
                message : "Error while Verifying code"
            },{status : 400}
        )
      }
}