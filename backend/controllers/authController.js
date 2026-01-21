import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as userModel from "../models/userModel.js";

const signup = async (req, res) => {
  const {
    userType,
    fullName,
    email,
    phone,
    dob,
    password,
    emergencyContact,
    allergies,
    specialization,
    licenseNumber,
    yearsExperience,
  } = req.body;

  if (!userType || !fullName || !email || !phone || !dob || !password) {
    return res
      .status(400)
      .json({ message: "All required fields must be filled." });
  }
  try {
    const existingUser = await userModel.findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered." });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const userId = await userModel.createUser({
      userType,
      fullName,
      email,
      phone,
      dob,
      passwordHash,
    });
    if (userType === "patient") {
      await userModel.createPatient(
        userId,
        emergencyContact || null,
        allergies || null
      );
    } else if (userType === "doctor") {
      await userModel.createDoctor(
        userId,
        specialization || null,
        licenseNumber || null,
        yearsExperience || null
      );
    }
    res.status(201).json({ message: "User registered successfully." });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

const login = async (req, res) => {
  const { email, password, userType } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }
  try {
    const user = await userModel.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }
    if (userType && user.user_type !== userType) {
      return res.status(401).json({ message: "User type mismatch." });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }
    // JWT payload
    const payload = {
      id: user.id,
      userType: user.user_type,
      fullName: user.full_name,
      email: user.email,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET || "secretkey", {
      expiresIn: "2h",
    });
    res.status(200).json({
      message: "Login successful.",
      token,
      user: payload,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

export { signup, login };
