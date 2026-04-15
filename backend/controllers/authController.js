const User = require("../models/User");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

// 🔐 Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// 🔥 REGISTER (SEND OTP TO EMAIL)
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, hospital } = req.body;

    // check user exists
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // 🔥 Generate random OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // create user with OTP
    user = await User.create({
      name,
      email,
      password,
      role,
      hospital,
      otp,
      otpExpiry: Date.now() + 5 * 60 * 1000, // 5 min expiry
    });

    // 🔥 Send OTP via email
    await sendEmail(email, otp);

    res.json({ msg: "OTP sent to your email" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: err.message });
  }
};

// 🔥 VERIFY OTP
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    // check OTP match
    if (user.otp !== otp) {
      return res.status(400).json({ msg: "Invalid OTP" });
    }

    // check expiry
    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({ msg: "OTP expired" });
    }

    // mark verified
    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    res.json({ msg: "Account verified successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// 🔥 LOGIN (ONLY VERIFIED USERS)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    if (!user.isVerified) {
      return res.status(400).json({ msg: "Please verify OTP first" });
    }

    if (user.password !== password) {
      return res.status(400).json({ msg: "Invalid password" });
    }

    res.json({
      token: generateToken(user._id),
      user,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};