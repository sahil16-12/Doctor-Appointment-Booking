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
  console.log("User creation result: ", result);
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
  console.log("Find user by email result: ", rows);
  return rows[0];
};


const findPatientByUserId = async (userId) => {
  const [rows] = await db.execute(
    `
    SELECT 
      u.id,
      u.user_type,
      u.full_name,
      u.email,
      u.phone,
      u.dob,
      u.created_at,
      p.emergency_contact,
      p.allergies
    FROM users u
    JOIN patients p ON p.user_id = u.id
    WHERE u.id = ?
    `,
    [userId]
  );

  return rows[0];
};

const findDoctorByUserId = async (userId) => {
  const [rows] = await db.execute(
    `
    SELECT 
      u.id,
      u.user_type,
      u.full_name,
      u.email,
      u.phone,
      u.dob,
      u.created_at,
      d.specialization,
      d.license_number,
      d.years_experience
    FROM users u
    JOIN doctors d ON d.user_id = u.id
    WHERE u.id = ?
    `,
    [userId]
  );

  return rows[0];
};


export { createUser, createPatient, createDoctor, findUserByEmail, findPatientByUserId, findDoctorByUserId };
