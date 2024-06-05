import {z} from 'zod';

export const signInSchema = z.object({
    identifier : z.string(),
    password : z.string().min(6 , "password must be of atleast 6 characters")
})