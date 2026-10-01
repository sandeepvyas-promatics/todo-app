import bcrypt from "bcrypt";
import crypto from "crypto";
import User from "../models/User.js";
import sendEmail from "../services/emailService.js";


// FORGOT PASSWORD
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email }).select("+isVerified");

    if (!user) {
      return res.status(404).json({
        message: "User Not Found",
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        message: "Please verify your email first",
      });
    }

    // Check if password reset is temporarily blocked
    if (
      user.passwordResetBlockedUntil &&
      new Date() < user.passwordResetBlockedUntil
    ) {
      return res.status(429).json({
        message: "Too many failed attempts. Please try again later.",
      });
    }

    // Check OTP request cooldown
    if (user.lastPasswordResetOtpAt) {
      const timePassed =
        Date.now() - user.lastPasswordResetOtpAt.getTime();

      const cooldown = 60 * 1000;

      if (timePassed < cooldown) {
        const remainingSeconds = Math.ceil(
          (cooldown - timePassed) / 1000
        );

        return res.status(429).json({
          message: `Please wait ${remainingSeconds} seconds before requesting another OTP`,
        });
      }
    }

    // Generate 6 digit OTP
    const otp = crypto
      .randomInt(100000, 1000000)
      .toString();

    // OTP expires after 10 minutes
    const otpExpiresAt = new Date(
      Date.now() + 10 * 60 * 1000
    );

    // Hash OTP before storing it
    const hashedOtp = await bcrypt.hash(otp, 10);

    // Store reset OTP information
    user.passwordResetOtp = hashedOtp;
    user.passwordResetOtpExpiresAt = otpExpiresAt;
    user.passwordResetAttempts = 0;
    user.passwordResetBlockedUntil = undefined;
    user.lastPasswordResetOtpAt = new Date();

    await user.save();

    console.log("PASSWORD RESET OTP:", otp);

    // Send OTP through your existing email service
    await sendEmail(
      email,
      "Reset your Todo App password",
      `Your password reset OTP is: ${otp}. This OTP will expire in 10 minutes.`
    );

    return res.status(200).json({
      message: "Password reset OTP sent successfully",
    });

  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);

    return res.status(500).json({
      message: "Server Error",
    });
  }
};


export {
  forgotPassword,
};