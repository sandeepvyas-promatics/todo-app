import express from "express";
import { registerUser, verifyOtp, loginUser, resendOtp, logoutUser, getCurrentUser, forgotPassword, resetPassword} from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { deleteAccount } from "../controllers/authController.js";


const router = express.Router();

router.post("/auth/register", registerUser);
router.post("/auth/verify-otp", verifyOtp);  
router.post("/auth/resend-otp", resendOtp);
router.post("/auth/login", loginUser);
router.post("/auth/logout", logoutUser);
router.get("/auth/me",authMiddleware,getCurrentUser),
router.delete("/auth/delete-account",authMiddleware ,deleteAccount),

router.post("/auth/forgot-password", forgotPassword);
router.post("/auth/reset-password",resetPassword);

export default router;