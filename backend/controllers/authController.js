import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as userModel from "../models/userModel.js";


const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isValidPhone = (phone) =>
  /^[0-9]{10}$/.test(phone);

const isValidName = (name) =>
  /^[a-zA-Z ]{3,}$/.test(name);

const isValidDate = (date) => !isNaN(Date.parse(date));


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

  // 1. Required fields
  if (!userType || !fullName || !email || !phone || !dob || !password) {
    return res.status(400).json({ message: "All required fields must be filled." });
  }

  // 2. Field validations
  if (!["patient", "doctor"].includes(userType)) {
    return res.status(400).json({ message: "Invalid user type." });
  }

  if (!isValidName(fullName)) {
    return res.status(400).json({ message: "Full name must contain only letters and be at least 3 characters." });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ message: "Invalid email format." });
  }

  if (!isValidPhone(phone)) {
    return res.status(400).json({ message: "Phone must be exactly 10 digits." });
  }

  if (!isValidDate(dob)) {
    return res.status(400).json({ message: "Invalid date of birth." });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters." });
  }

  // 3. Optional field validation
  if (emergencyContact && !isValidPhone(emergencyContact)) {
    return res.status(400).json({ message: "Emergency contact must be 10 digits." });
  }

  if (allergies && allergies.length < 3) {
    return res.status(400).json({ message: "Allergies must be at least 3 characters." });
  }

  if (userType === "doctor") {
    if (specialization && specialization.length < 3) {
      return res.status(400).json({ message: "Specialization must be at least 3 characters." });
    }

    if (licenseNumber && licenseNumber.length < 5) {
      return res.status(400).json({ message: "License number must be at least 5 characters." });
    }

    if (
      yearsExperience &&
      (isNaN(yearsExperience) || yearsExperience < 0 || yearsExperience > 60)
    ) {
      return res.status(400).json({ message: "Years of experience must be between 0 and 60." });
    }
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
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error." });
  }
};


const login = async (req, res) => {
  const { email, password, userType } = req.body;

  if (!email || !password || !userType) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const user = await userModel.findUserByEmail(email);

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // ROLE CHECK
    if (user.user_type !== userType) {
      return res.status(401).json({
        message: `You are registered as ${user.user_type}. Please login as ${user.user_type}.`
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Minimal JWT payload
    const tokenPayload = {
      id: user.id,
      role: user.user_type
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: "2h"
    });

    // Full profile
    let profile;
    if (user.user_type === "patient") {
      profile = await userModel.findPatientByUserId(user.id);
    } else {
      profile = await userModel.findDoctorByUserId(user.id);
    }

    res.status(200).json({
      message: "Login successful.",
      token,
      profile
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error." });
  }
};

export { signup, login };
