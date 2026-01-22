import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

// Helper function to generate JWT
const createToken = (id) => {
  if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });
};

// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Sanitize input
  if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ success: false, message: "Invalid input format" });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const token = createToken(user._id);

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        name: user.name,
        email: user.email,
        cartData: user.cartData,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Register user
const registerUser = async (req, res) => {
  const { name, password, email } = req.body;

  try {
    // Check if user already exists
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }

    // Email and password validation
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Invalid email" });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Password should be at least 8 characters",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const role = email === process.env.ADMIN_EMAIL ? "admin" : "user";

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      role
    });

    await newUser.save();

    const token = createToken(newUser._id);

    res.json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        name: newUser.name,
        email: newUser.email,
        cartData: newUser.cartData,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export { loginUser, registerUser };
