import db from "../config/db.js";

const createUser = async (user) => {
  const [result] = await db.execute(
    `INSERT INTO users (user_type, full_name, email, phone, dob, password) VALUES (?, ?, ?, ?, ?, ?)`,
    [
      user.userType,
      user.fullName,
      user.email,
      user.phone,
      user.dob,
      user.passwordHash,
    ]
  );
  return result.insertId;
};

const createPatient = async (userId, emergencyContact, allergies) => {
  await db.execute(
    `INSERT INTO patients (user_id, emergency_contact, allergies) VALUES (?, ?, ?)`,
    [userId, emergencyContact, allergies]
  );
};

const createDoctor = async (
  userId,
  specialization,
  licenseNumber,
  yearsExperience
) => {
  await db.execute(
    `INSERT INTO doctors (user_id, specialization, license_number, years_experience) VALUES (?, ?, ?, ?)`,
    [userId, specialization, licenseNumber, yearsExperience]
  );
};

const findUserByEmail = async (email) => {
  const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [
    email,
  ]);
  return rows[0];
};

export { createUser, createPatient, createDoctor, findUserByEmail };
