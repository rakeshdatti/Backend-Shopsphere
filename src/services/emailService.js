import nodemailer from "nodemailer";
import dotenv from 'dotenv'


dotenv.config()

console.log("EMAIL_USER:", process.env.EMAIL_USER);

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendWelcomeMail = async (email, name,otp) => {
  try {
    
    console.log("Sending email to:", email);
    console.log("Sending email to:", otp);

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Welcome to ShopSphere",
      html: `
        <h2>Hello ${name}</h2>
        <p>Your account created successfully.</p>
        <p>Start shopping now!</p>
        <p>OTP for account verification</p>
        <h3>${otp}</h3>
      `
    });

    console.log("Email sent:", info.response);

  } catch (err) {
       console.error("Email send failed:", err.message);
      throw new Error("Failed to send OTP email. Please check your email address.");
  }
};


const SendResetPasswordMail= async (email,name,resetURL)=>{
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset Request",
    html: `
      <h2>Hello ${name}</h2>
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <a href="${resetURL}">Reset Password</a>
      <p>If you did not request this, please ignore this email.</p>
    `
  })
}

export { sendWelcomeMail, SendResetPasswordMail };