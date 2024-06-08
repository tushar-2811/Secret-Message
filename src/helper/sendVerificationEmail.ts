import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";

import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email: string,
    userName: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Verification Code | Secret Message',
            react: VerificationEmail({username : userName , otp : verifyCode}),
        });
        return {
            success: true,
            message: "Verification Email sent successfully"
        }

    } catch (error) {
        console.log("Error while sending verification email", error);
        return {
            success: false,
            message: "Failed to send Verification Email"
        }
    }
}