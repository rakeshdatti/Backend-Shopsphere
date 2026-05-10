
import rateLimit from "express-rate-limit";

export const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 min window
  max: 3,                     // max 3 attempts per IP
  message: { message: "Too many reset attempts. Please try again after 15 minutes." }
});
