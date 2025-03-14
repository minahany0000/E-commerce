import nodemailer from "nodemailer";
import appError from "../utils/appError.js";
import fs from "fs"; // Import fs to read file

const sendEmail = async (to, subject, html, pdfPath) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `"Minaa" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
            attachments: pdfPath ? [
                {
                    filename: "invoice.pdf",
                    path: pdfPath,
                    contentType: "application/pdf"
                }
            ] : []
        };

        const info = await transporter.sendMail(mailOptions);


        return true;
    } catch (error) {
        console.error("Email sending error:", error);
        return false;
    }
};

export default sendEmail;
