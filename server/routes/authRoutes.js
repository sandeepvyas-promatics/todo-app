import express from "express";
import { registerUser, verifyOtp, loginUser, resendOtp, logoutUser} from "../controllers/authController.js";


const router = express.Router();

router.post("/auth/register", registerUser);
router.post("/auth/verify-otp", verifyOtp);  
router.post("/auth/resend-otp", resendOtp);
router.post("/auth/login", loginUser);
router.post("/auth/logout", logoutUser);
//router.post("/auth/refresh", refreshAccessToken);



export default router;