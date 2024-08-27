// src/services/mailer.service.ts

import nodemailer from "nodemailer";

// Load environment variables
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // For Gmail, you typically use 'smtp.gmail.com'
  port: 587, // Gmail uses port 587 for TLS
  secure: false, // Use `true` for port 465, `false` for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendAcknowledgementEmail = async (
  to: string,
  fullName: string
) => {
  const mailOptions = {
    from: `"Fynder.ai - Indus Valley Technologies" <${process.env.EMAIL_USER}>`,
    to: to,
    subject: "Thank you for your feedback!",
    text: `Dear ${fullName},

Thank you for submitting your feedback. We value your input and are working on it. We will get back to you soon.

Best regards,
Team Fynder.ai`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Acknowledgement email sent to ${to}`);
  } catch (error: any) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send acknowledgement email");
  }
};
