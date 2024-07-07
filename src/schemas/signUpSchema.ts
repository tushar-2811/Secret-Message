import {z} from 'zod';

export const userNameValidation =  z
                .string()
                .min(2 , "userName must be of atleast 2 characters")
                .max(20 , "userName must be no more than 20 characters")
                .regex( /^[a-zA-Z0-9]+$/ , "userName must not contain any special character")


export const signUpSchema = z.object({
    userName : userNameValidation,
    email : z.string().email({message : "Invalid email address"}),
    password : z.string().min(6 , "password must be of atleast 6 characters")
})