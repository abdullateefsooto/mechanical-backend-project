import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
const PORT = process.env.PORT || 5000;


const app = express();
app.use(express.json());
app.use(cors({
  origin: "https://mechanical-frontend-project.vercel.app",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
}));

app.options("*", cors());

app.get("/", (req, res) => {
  res.send("Email Service is Running");
});


app.post("/booking", async (req, res) => {
    const{
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
            <p><strong>Email/Phone:</strong> ${email}</p>
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
        <p><strong>Name:</strong> My name is  ${name}</p>
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




app.listen(PORT, () => {
  console.log(`✅Server is running on port ${PORT}`);
});


