import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs';
import dbConnect from "@/lib/db";
import UserModel from "@/model/User";
import { signIn } from "next-auth/react";

export const authOptions: NextAuthOptions = {
    providers : [
        CredentialsProvider({
            id : "credentials",
            name : "Credentials",
            credentials: {
                email : { label: "Email", type: "text"},
                password: { label: "Password", type: "password" }
              },
            async authorize(credentials:any , req):Promise<any>{
                 dbConnect();
                 try {
                    const existingUser = await UserModel.findOne({
                        $or : [
                            {email : credentials.identifier},
                            {userName : credentials.identifier}
                        ]
                    })

                    if(!existingUser){
                        throw new Error("No user found");
                    }

                    if(!existingUser.isVerified){
                        throw new Error("Please Verify Your Account Before Login");
                    }

                    const isPasswordCorrect = await bcrypt.compare(existingUser.password , credentials.password);

                    if(isPasswordCorrect){
                        return existingUser;
                    }else{
                        throw new Error("Incorrect Password");
                    }
                 } catch (error:any) {
                    throw new Error(error);
                 }
            }
        })
    ],
    callbacks : {
        async session({ session, token }) {
            return session;
          },
          async jwt({ token, user}) {
            return token;
          }
    },
    pages : {
        signIn : '/sign-in'
    },
    session : {
        strategy : "jwt"
    },
    secret : process.env.NEXT_AUTH_SECRET
} 
