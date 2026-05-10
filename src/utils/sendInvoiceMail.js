import nodemailer from "nodemailer";
import generateInvoicePDF  from "./generateInvoice.js";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,   // ← changed MAIL_USER to EMAIL_USER
    pass: process.env.EMAIL_PASS,   // ← changed MAIL_PASS to EMAIL_PASS
  },
});

export const sendInvoiceMail = async (order, user) => {
  const pdfBuffer = await generateInvoicePDF(order, user);

  await transporter.sendMail({
    from: `"ShopSphere" <${process.env.EMAIL_USER}>`,  // ← fixed
    to: user.email,
    subject: `Your Order Invoice #${String(order.id).padStart(8, '0')}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        <h2 style="color: #4f46e5;">Order Placed Successfully! 🎉</h2>
        <p>Hi <strong>${user.name || "Customer"}</strong>,</p>
        <p>Thank you for your order. Please find your invoice attached.</p>
        <table style="width:100%; border-collapse:collapse; margin-top:16px;">
          <tr style="background:#f5f5f5;">
            <td style="padding:8px; border:1px solid #ddd;"><strong>Order ID</strong></td>
            <td style="padding:8px; border:1px solid #ddd;">#${String(order.id).padStart(8, '0').toUpperCase()}</td>
          </tr>
          <tr>
            <td style="padding:8px; border:1px solid #ddd;"><strong>Total</strong></td>
            <td style="padding:8px; border:1px solid #ddd;">Rs.${order.total?.toFixed(2)}</td>
          </tr>
          <tr style="background:#f5f5f5;">
            <td style="padding:8px; border:1px solid #ddd;"><strong>Payment</strong></td>
            <td style="padding:8px; border:1px solid #ddd;">${order.paymentMethod?.toUpperCase()}</td>
          </tr>
        </table>
        <p style="margin-top:20px; color:#888; font-size:13px;">— ShopSphere Team</p>
      </div>
    `,
    attachments: [
      {
        filename: `invoice_${String(order.id).padStart(8, '0').toUpperCase()}.pdf`,
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  });

  console.log("✅ Invoice mail sent to:", user.email);
};