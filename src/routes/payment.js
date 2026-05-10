import express from "express";
import Stripe from "stripe";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-06-20",
});

router.post("/payment-intent", authMiddleware, async (req, res) => {
    try {
        console.log("payment req", req.body);
        const { amount } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ message: "Invalid amount" });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(Number(amount) * 100),
            currency: "usd",
            automatic_payment_methods: { enabled: true },
            metadata: { userId: String(req.user.id) }  // ← only change
        });

        console.log(paymentIntent);
        res.json({ clientSecret: paymentIntent.client_secret });

    } catch (e) {
        console.error("Stripe FULL ERROR:", e);
        res.status(500).json({
            message: e.message,
            type: e.type,
            stack: e.stack
        });
    }
});

export default router;