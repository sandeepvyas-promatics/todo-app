import bcrypt from "bcrypt";
import crypto from "crypto";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import sendEmail from "../services/emailService.js"

const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "1h",
    }
  );
};
const registerUser = async (req, res) => {
  try {
    console.log("REGISTER REQUEST:", {
  name: req.body.name,
  email: req.body.email,
  });

    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    const otp = crypto.randomInt(100000, 1000000).toString(); 
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    const registrationExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)
    //2 *60 * 1000
    const hashedOtp = await bcrypt.hash(otp, 10);
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("OTP:", otp);
    const user = await User.create({  
      name,
      email,
      password : hashedPassword,
      verificationOtp: hashedOtp,
      verificationOtpExpiresAt: otpExpiresAt,
      registrationExpiresAt: registrationExpiresAt,
    });

    await sendEmail(
      email,
      "Verify your Todo App account",
      `Your verification OTP is: ${otp}. This OTP will expire in 10 minutes.`
    );

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
      },
  });
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        message: "User is already verified",
      });
    }

    if (
      !user.verificationOtp ||
      !user.verificationOtpExpiresAt
    ) {
      return res.status(400).json({
        message: "OTP not found",
      });
    }

    if (new Date() > user.verificationOtpExpiresAt) {
      return res.status(400).json({
        message: "OTP has expired",
      });
    }

    const isOtpValid = await bcrypt.compare(
      otp,
      user.verificationOtp
    );

    if (!isOtpValid) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    user.isVerified = true;
    user.verificationOtp = undefined;
    user.verificationOtpExpiresAt = undefined;
    user.registrationExpiresAt = undefined;

    await user.save();

    res.json({
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error("OTP VERIFICATION ERROR:", error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        message: "Please verify your email first",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user._id);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
const resendOtp = async(req,res)=>{
    try{
      const {email}= req.body;
      const user = await User.findOne({ email });
      if(!user){
        return res.status(404).json({
          message:"User Not Found",
        });
      }
      if (user.isVerified){
        return res.status(404).json({
          message:"User is already verified",
        });
      }
      if (user.lastOtpResendAt) {
        const timePassed =
          Date.now() - user.lastOtpResendAt.getTime();

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
      const otp = crypto.randomInt(100000,1000000).toString();
      const otpExpiresAt = new Date (Date.now() + 10 * 60 * 1000);
      const hashedOtp = await bcrypt.hash(otp,10);

      user.verificationOtp = hashedOtp;
      user.verificationOtpExpiresAt = otpExpiresAt;
      user.lastOtpResendAt = new Date();

      await user.save();

      console.log("Resend Otp:", otp);

      await sendEmail(
        email,
        "Verify your Todo App account",
        `Your new verification OTP is: ${otp}. This OTP will expire in 10 minutes.`
      );
      res.json({
        message: "New Otp sent Successfully"
      });
    }catch(error){
      console.log("RESEND OTP ERROR:", error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

export { registerUser,verifyOtp,loginUser,resendOtp };