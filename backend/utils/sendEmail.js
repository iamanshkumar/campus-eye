import {Resend} from "resend";

if(!process.env.RESEND_API_KEY){
    console.log("CRITICAL: RESEND_API_KEY is missing in .env");
}

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOtpEmail = async(targetEmail , otpCode)=>{
    try{
        const data = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: targetEmail,
            subject: 'Reset Your Password - OTP Verification',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #333333; text-align: center;">Password Reset Request</h2>
          <p style="font-size: 16px; color: #555555;">Your verification code is valid for <strong>5 minutes</strong>.</p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #007bff; background-color: #f8f9fa; padding: 10px 20px; border-radius: 4px; border: 1px dashed #007bff;">
              ${otpCode}
            </span>
          </div>
        </div>
      `

        });

        console.log("Email sent successfully via Resend HTTPS API!", data.id);
        return data;
    }catch(err){
        console.error(" Resend API Error:", err);
        throw new Error('Failed to deliver verification email.');
    }
}