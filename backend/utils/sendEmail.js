import nodemailer from "nodemailer";

if(!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASS){
    console.log("CRITICAL EMAIL CONFIG WARNING: GMAIL_USER or GMAIL_APP_PASS is missing in .env")
}

const transporter = nodemailer.createTransport({
    host : '64.233.184.108',
    family : 4,
    secure:false,
    port : 587,
    tls: {
        servername: 'smtp.gmail.com',
        rejectUnauthorized: false
    },
    auth : {
        user : process.env.GMAIL_USER,
        pass : process.env.GMAIL_APP_PASS
    },
    pool : true,
    maxConnections : 3,
    maxMessages : 100
})

transporter.verify((error, success) => {
    if (error) {
      console.error('Nodemailer SMTP handshake failed! Check your Gmail App Password.');
      console.error(error.message);
    } else {
      console.log('SMTP Server connected successfully. Ready to transmit system emails.');
    }
})

export const sendEmail = async({to , subject , html})=>{
    const mailOptions = {
        from : process.env.GMAIL_USER,
        to : to.toLowerCase().trim(),
        subject : subject,
        html : html
    };

    try{
        const deliveryReceipt = await transporter.sendMail(mailOptions);
        console.log("Email securely delivered. MessageId: ${deliveryReceipt.messageId}");
        return deliveryReceipt;
    }catch (error) {
        console.error(`Mail delivery execution caught an exception for: ${to}`);
        console.error(error);
        throw new Error('Email delivery processing failed downstream.');
    }
}


export const sendOtpEmail = async (targetEmail, otpCodeCode) => {
    const template = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f9fafb; padding: 40px 20px; text-align: center;">
        <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03); border: 1px solid #f3f4f6;">
          
          <!-- Identity Header Context Block -->
          <h2 style="color: #111827; font-size: 24px; font-weight: 700; margin-top: 0; margin-bottom: 8px; letter-spacing: -0.025em;">
            Password Reset Request
          </h2>
          <p style="color: #4b5563; font-size: 15px; line-height: 1.5; margin-bottom: 24px;">
            We received a request to authorize a password change. Use the verification token below to complete your transition sequence.
          </p>
  
          <!-- Dynamic Action Component Module Display -->
          <div style="margin: 32px 0;">
            <span style="font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 800; color: #059669; background-color: #ecfdf5; padding: 12px 28px; border-radius: 8px; border: 1px dashed #34d399; letter-spacing: 6px; display: inline-block;">
              ${otpCodeCode}
            </span>
          </div>
  
          <!-- Warning / Security Buffer Policy Metadata Footer -->
          <p style="color: #6b7280; font-size: 13px; line-height: 1.5; margin-bottom: 0;">
            This code will expire automatically in <strong>5 minutes</strong>. If you did not execute or prompt this query sequence, you can discard this transaction alert securely.
          </p>
        </div>
      </div>
    `;
  
    return sendEmail({
      to: targetEmail,
      subject: `${otpCodeCode} is your Password Recovery Verification Code`,
      html: template,
    });
};
