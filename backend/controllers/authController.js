import bcrypt from "bcrypt";
import crypto from "crypto";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import sendEmail from "../services/emailService.js";
import mongoose from "mongoose";
import Todo from "../models/Todo.js";

// Generate Access Token
const generateAccessToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "15m",
    }
  );
};
// REGISTER USER
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

    const otpExpiresAt = new Date(
      Date.now() + 10 * 60 * 1000
    );

    const registrationExpiresAt = new Date(
      Date.now() + 24 * 60 * 60 * 1000
    );

    const hashedOtp = await bcrypt.hash(otp, 10);
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("OTP:", otp);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      verificationOtp: hashedOtp,
      verificationOtpExpiresAt: otpExpiresAt,
      registrationExpiresAt,
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
// VERIFY OTP
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

    if (user.verificationBlockedUntil && new Date() < user.verificationBlockedUntil) {
      return res.status(429).json({
        message: "Too many failed attempts. Please try again later.",
      });
    }

    if (!user.verificationOtp || !user.verificationOtpExpiresAt) {
      return res.status(400).json({
        message: "OTP not found",
      });
    }

    if (new Date() > user.verificationOtpExpiresAt) {
      return res.status(400).json({
        message: "OTP has expired",
      });
    }

    const isOtpValid = await bcrypt.compare(otp, user.verificationOtp);

    if (!isOtpValid) {
      user.verificationAttempts += 1;

      if (user.verificationAttempts >= 5) {
        user.verificationBlockedUntil = new Date(
          Date.now() + 15 * 60 * 1000
        );
      }

      await user.save();

      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    user.isVerified = true;
    user.verificationOtp = undefined;
    user.verificationOtpExpiresAt = undefined;
    user.verificationAttempts = 0;
    user.verificationBlockedUntil = undefined;
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
// LOGIN USER
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+isVerified");
    console.log("LOGIN USER FROM DATABASE:", {
  email: user?.email,
  isVerified: user?.isVerified,
});

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

    const accessToken = generateAccessToken(user._id);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
      path: "/",
    });
    console.log("api is calling")

    res.json({
      message: "Login successful",
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
// LOGOUT USER
const logoutUser = (req, res) => {
  try {
    res.clearCookie("accessToken", {
      httpOnly: true,
      path: "/",
    });

    return res.status(200).json({
      message: "Logout successful",
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: "Server Error",
    });
  }
};
// RESEND OTP
const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User Not Found",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        message: "User is already verified",
      });
    }

    if ( user.verificationBlockedUntil && new Date() < user.verificationBlockedUntil) {
      return res.status(429).json({
        message: "Too many failed attempts. Please try again later.",
      });
    }

    if (user.lastOtpResendAt) {
      const timePassed = Date.now() - user.lastOtpResendAt.getTime();
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

    const otp = crypto.randomInt(100000, 1000000).toString();

    const otpExpiresAt = new Date( Date.now() + 10 * 60 * 1000 );

    const hashedOtp = await bcrypt.hash(otp, 10);

    user.verificationOtp = hashedOtp;
    user.verificationOtpExpiresAt = otpExpiresAt;
    user.lastOtpResendAt = new Date();
    user.verificationAttempts = 0;
    user.verificationBlockedUntil = undefined;

    await user.save();

    console.log("Resend OTP:", otp);

    await sendEmail(
      email,
      "Verify your Todo App account",
      `Your new verification OTP is: ${otp}. This OTP will expire in 10 minutes.`
    );

    res.json({
      message: "New OTP sent successfully",
    });
  } catch (error) {
    console.error("RESEND OTP ERROR:", error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
//getCurrentUser
const getCurrentUser = async (req,res)=>{
  try{
    const user= await User.findById(req.user.userId).select("name email isVerified");
    if(!user){
      return res.status(404).json({
        message:"User Not Found",
      });
    }
    return res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
      },
    });
  }catch(error){
    console.error("GET CURRENT USER ERROR: ",error);
    return res.status(500).json({
      message:"Server Error",
    });
  }
};
// DELETE ACCOUNT
const deleteAccount = async(req,res)=>{
    const session = await mongoose.startSession();
    try {
        let accountNotFound = false;

        await session.withTransaction(async()=>{
            const user = await User.findById(req.user.userId).session(session);
            console.log("USER BEFORE DELETION:", user);
            if (!user){
                accountNotFound = true;
                return;
            }
            await Todo.deleteMany({
                user: req.user.userId,
            }).session(session);
            const result = await User.deleteOne({
              _id: user._id,
            }).session(session);
            console.log("USER DELETION RESULT:", result);
            
        })

        if (accountNotFound){
            return res.status(404).json({
                message :"user not found"
            })
        }
        res.clearCookie("accessToken",{
            httpOnly : true,
            path:"/"
        })
        return res.status(200).json({
            message:"Account and all the todos deleted"
        });
    }catch(err){
        console.log(err);
        return res.status(500).json({
            message : "Server Error"
        });
    }finally{
        await session.endSession();
    }
}

export {
  registerUser,
  verifyOtp,
  loginUser,
  resendOtp,
  logoutUser,
  getCurrentUser,
  deleteAccount,
};