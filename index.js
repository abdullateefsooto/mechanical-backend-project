

import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

// Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: [
    "http://localhost:5173", // local dev frontend
    "https://mechanical-frontend-project.vercel.app" // live frontend
  ],
  credentials: true,
}));

// --- API Routes ---

// Test route
app.get("/", (req, res) => {
  res.send("Email Service is Running");
});

// Booking route
app.post("/booking", async (req, res) => {
  const {
    name,
    email,
    phone,
    vehicleType,
    serviceRequired,
    message,
    preferredDate,
    preferredTime,
  } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Sooto Booking <${process.env.EMAIL_USER}>"`,
      to: process.env.EMAIL_RECEIVER,
      subject: "New Service Booking",
      html: `
        <h3>New Booking Details</h3>
        <p><strong>Name:</strong> My name is ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Vehicle Type:</strong> ${vehicleType}</p>
        <p><strong>Service Required:</strong> ${serviceRequired}</p>
        <p><strong>Preferred Date:</strong> ${preferredDate}</p>
        <p><strong>Preferred Time:</strong> ${preferredTime}</p>
        <p><strong>Additional Message:</strong> ${message || "none"}</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Booking sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send booking" });
  }
});

// Contact route
app.post("/contact", async (req, res) => {
  const { name, email, phone, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Contact Form <${process.env.EMAIL_USER}>"`,
      to: process.env.EMAIL_RECEIVER,
      subject: "New Contact Message",
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> Myname is ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Message sent successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send message" });
  }
});

// --- Serve frontend in production ---
if (process.env.NODE_ENV === "production") {
  // Serve static files
  app.use(express.static(path.join(__dirname, "frontend/dist")));

  // Wildcard route for React Router (fixes PathError)
  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, "frontend/dist", "index.html"));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
