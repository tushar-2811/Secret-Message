import dbConnect from "@/lib/db";
import UserModel from "@/model/User";
import bcrypt from 'bcryptjs'
import { sendVerificationEmail } from "@/helper/sendVerificationEmail";

export async function POST(request: Request) {
    await dbConnect();

    try {

        const {email , userName , password} = await request.json();

        // check if userName already exist
        const existingUserVerifiedByUserName = await UserModel.findOne({userName , isVerified : true});

        if(existingUserVerifiedByUserName){
            return Response.json({
                success : false,
                message : "userName is already taken"
            }, {
                status : 400
            })
        }

        // check if email already exist
        const existingUserByEmail = await UserModel.findOne({email});

        const verifyCode = Math.floor(100000 + Math.random()*900000).toString();

        if(existingUserByEmail){
            if(existingUserByEmail.isVerified){
                // user already exist and verified
                return Response.json({
                    success : false,
                    message : "User already exist with email"
                } , {
                    status : 400
                })
            }else{
                // user already exist but not verified
                const hashedPassword = await bcrypt.hash(password , 10);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
                await existingUserByEmail.save();
            }  
            
        }else{
            const hashedPassword = await bcrypt.hash(password , 10 );
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser = new UserModel({
                userName,
                email,
                password : hashedPassword,
                verifyCode,
                verifyCodeExpiry : expiryDate,
                isVerified : false,
                isAcceptingMessage : true,
                messages : []
            })

            await newUser.save();
        }

        // send verification email
       const emailResponse =  await sendVerificationEmail(email , userName , verifyCode);

       if(!emailResponse.success){
        return Response.json({
            success : false,
            message : emailResponse.message
        } , {
            status : 500
        })
       }

       return Response.json({
          success : true,
          message : "User registered successfully , Please verify your email"
       } , {
        status : 201
       })

   
    } catch (error) {
        console.log("error while sign-up" , error);
        return Response.json({
            success : false,
            message : "Error while sign-up"
        }, {
            status : 500
        })
    }

}

