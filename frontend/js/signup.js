import { initLayout } from "./layout.js";

initLayout("signup");

document.getElementById("signupForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const userType = form.querySelector('input[name="userType"]:checked').value;
  const fullName = form
    .querySelector('input[placeholder="Full Name"]')
    .value.trim();
  const email = form
    .querySelector('input[placeholder="Email Address"]')
    .value.trim();
  const phone = form
    .querySelector('input[placeholder="Phone Number"]')
    .value.trim();
  const dob = form.querySelector('input[type="date"]').value;
  const password = form.querySelector('input[placeholder="Password"]').value;
  const confirmPassword = form.querySelector(
    'input[placeholder="Confirm Password"]'
  ).value;

  // Patient fields
  const emergencyContact = form
    .querySelector('#patientFields input[placeholder*="Emergency Contact"]')
    .value.trim();
  const allergies = form
    .querySelector('#patientFields input[placeholder*="Allergies"]')
    .value.trim();

  // Doctor fields
  const specialization = form.querySelector("#doctorFields select").value;
  const licenseNumber = form
    .querySelector('#doctorFields input[placeholder*="License Number"]')
    .value.trim();
  const yearsExperience = form.querySelector(
    '#doctorFields input[placeholder*="Years of Experience"]'
  ).value;

  // Toast notification utility
  function showToast(msg, type = "success") {
    const container = document.getElementById("toastContainer");
    const toast = document.createElement("div");
    toast.className = `toast-message ${type}`;
    toast.textContent = msg;
    container.appendChild(toast);

    // Auto remove after 3 seconds
    setTimeout(() => {
      toast.classList.add("fade-out");
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  if (password !== confirmPassword) {
    showToast("Passwords do not match.", "error");
    return;
  }

  const payload = {
    userType,
    fullName,
    email,
    phone,
    dob,
    password,
  };
  if (userType === "patient") {
    payload.emergencyContact = emergencyContact;
    payload.allergies = allergies;
  } else if (userType === "doctor") {
    payload.specialization = specialization;
    payload.licenseNumber = licenseNumber;
    payload.yearsExperience = yearsExperience;
  }

  try {
    const res = await fetch("http://localhost:5000/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (res.ok) {
      showToast("Signup successful! Redirecting to login...", "success");
      setTimeout(() => {
        window.location.href = "login.html";
      }, 1500);
    } else {
      showToast(data.message || "Signup failed.", "error");
    }
  } catch (err) {
    showToast("Network error. Please try again.", "error");
  }
});

// Handle user type switching
const userTypeRadios = document.querySelectorAll('input[name="userType"]');
const patientFields = document.getElementById("patientFields");
const doctorFields = document.getElementById("doctorFields");

userTypeRadios.forEach((radio) => {
  radio.addEventListener("change", function () {
    if (this.value === "patient") {
      patientFields.style.display = "block";
      doctorFields.style.display = "none";
    } else {
      patientFields.style.display = "none";
      doctorFields.style.display = "block";
    }
  });
});
