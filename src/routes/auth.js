import express from 'express';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";                          
import User from '../models/User.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { sendWelcomeMail, SendResetPasswordMail } from '../services/emailService.js';
import { generateOTP } from '../utils/generatorOTP.js';
import { isValidEmail } from "../utils/validateEmail.js";
import crypto from "crypto";
import { forgotPasswordLimiter } from '../utils/rateLimitor.js';
import axios from 'axios';

const router = express.Router();


router.get('/', (req, res) => {
  res.send('Auth route');
});


// REGISTER
router.post("/register", async (req, res) => {
    try {
        console.log(req.body);
        const { name, email, password } = req.body;

        if (!isValidEmail(email)) {
            return res.status(400).json({ message: "Invalid email address format." });
        }

        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ message: "Password must be a 8 character with letters and numbers" });
        }

        const existingUser = await User.findOne({ where: { email } });  // ← FIXED
        if (existingUser)
            return res.status(400).json({ message: "User already exits" });

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const otp = generateOTP();
        console.log("otp for verification", otp);

        const user = await User.create({
            name,
            email,
            password: hashPassword,
            otp,
            otpExpiry: new Date(Date.now() + 10 * 60 * 1000)  
        });

        console.log("calling send");
        await sendWelcomeMail(email, name, otp);

        res.status(201).json({
            message: "OTP sent to email",
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// LOGIN
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });  // ← FIXED
        if (!user)
            return res.status(400).json({ message: "Invalid credentials" });

        if (!user.isVerified) {
            return res.status(400).json({ message: "Please verify you email first" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            token,
            user: { id: user.id, name: user.name, email: user.email }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// PROFILE
router.get("/profile", authMiddleware, async (req, res) => {
    res.json(req.user);
});


// VERIFY OTP
router.post("/verify-otp", async (req, res) => {
    try {
        console.log("verify otp");
        const { email, otp } = req.body;

        const user = await User.findOne({ where: { email } });  // ← FIXED

        if (!user) {
            return res.status(400).json({ message: "user not found" });
        }

        console.log(user.otp);
        console.log(otp);

        if (user.otp !== otp) {
            return res.status(400).json({ message: "Invalid otp" });
        }

        user.isVerified = true;
        user.otp = null;
        user.otpExpiry = null;
        await user.save();

        res.json({ message: "Account created successfully" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// FORGOT PASSWORD
router.post("/forgot-password", async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ where: { email } });  // ← FIXED

        if (!user) {
            return res.status(404).json({ message: "If that email exists, a reset link was sent." });
        }

        const rawToken = crypto.randomBytes(32).toString("hex");
        const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpiry = new Date(Date.now() + 3600000);  // ← FIXED: wrap in new Date()
        await user.save();

        const resetURL = `${process.env.FRONTEND_URL}/reset-password/${rawToken}`;
        await SendResetPasswordMail(user.email, user.name, resetURL);

        res.json({ message: 'If that email exists, a reset link was sent.' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// RESET PASSWORD
router.post("/reset-password/:token", forgotPasswordLimiter, async (req, res) => {
    try {
        const { password } = req.body;

        console.log("new password", password);
        console.log("token", req.params.token);

        const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
        console.log("hashed token", hashedToken);

        const user = await User.findOne({
            where: {
                resetPasswordToken: hashedToken,
                resetPasswordExpiry: { [Op.gt]: new Date() }  // ← FIXED: $gt → Op.gt
            }
        });

        console.log("user found for reset", user);

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ message: "Password must be a 8 character with letters and numbers" });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        user.resetPasswordToken = null;
        user.resetPasswordExpiry = null;
        await user.save();

        res.json({ message: "Password reset successful, you can login with your new password now" });

    } catch (error) {  
        res.status(500).json({ message: error.message });
    }
});


// AI CHAT
router.post("/api/chat", async (req, res) => {
    const { message } = req.body;
    console.log("message received", message);
    console.log("🔥 CHAT API HIT");

    if (!process.env.HF_API_KEY) {
        return res.status(500).json({ reply: "AI service not configured. Missing API key." });
    }

    const prompt = `You are a shopping assistant.\nUser: ${message}`;

    try {
        const response = await axios.post(
            "https://router.huggingface.co/hf-inference/models/mistralai/Mistral-7B-Instruct-v0.2",
            { inputs: prompt },
            {
                headers: {
                    Authorization: `Bearer ${process.env.HF_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        console.log("HF API Response:", response.data);
        const reply = response.data?.[0]?.generated_text || "No response";
        res.json({ reply });

    } catch (err) {
        console.error("HF ERROR:", err.response?.status, err.message);

        if (err.response?.status === 401) return res.status(401).json({ reply: "Invalid API key." });
        if (err.response?.status === 404) return res.status(404).json({ reply: "Model not found." });
        if (err.response?.status === 429) return res.status(429).json({ reply: "Rate limited. Try again later." });

        res.status(500).json({ reply: "AI service failed. Check backend logs." });
    }
});

export default router;