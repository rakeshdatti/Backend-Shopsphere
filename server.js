import express from 'express'
import cors from "cors"
import ConnectDB from "./config/connectDB.js"
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from "url";

dotenv.config()

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

await ConnectDB()

const app = express()

app.use(cors({
    origin: [
        "http://localhost:5173",
        process.env.FRONTEND_URL
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json())

// // ---------- API ROUTES MUST COME FIRST ----------
// app.get("/", (req, res) => {
//     res.send("Ecommerce API running")
// })

// route modules
import authRoutes from "./src/routes/auth.js";
import productRoutes from "./src/routes/products.js";
import orderRoutes from "./src/routes/orders.js";
import cartRouter from "./src/routes/cart.js"
import PaymentRouter from "./src/routes/payment.js"

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRouter)
app.use("/api/payments", PaymentRouter)


// ---------- STATIC REACT BUILD SERVING ----------
const frontendPath = path.join(__dirname, "dist")  

app.use(express.static(frontendPath));

// Catch-all handler for SPA (React)
app.use((req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});


// ---------- START SERVER ----------
const PORT = process.env.PORT || 5000 
app.listen(PORT, () => {
    console.log(`SERVER RUNNING ON PORT ${PORT}`);
})
