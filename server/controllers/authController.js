import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { logError } from "../utils/logger.js";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Check existing user
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create user
    const user = new User({
      username,
      email,
      password: hashedPassword
    });
    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      userId: user._id,
      username: user.username,
      token
    });
  } catch (error) {
    logError("Registration Error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      userId: user._id,
      username: user.username,
      token
    });
  } catch (error) {
    logError("Login Error:", error);
    res.status(500).json({ error: "Login failed" });
  }
};