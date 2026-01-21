import { initLayout } from "./layout.js";
initLayout("doctor-dashboard");



function safe(value) {
    return value && value !== "" ? value : "Not provided";
  }
  
  const profile = JSON.parse(sessionStorage.getItem("profile"));
  const token = sessionStorage.getItem("token");
  
  // Auth guard
  if (!token || !profile || profile.user_type !== "doctor") {
    window.location.href = "../pages/login.html";
  }
  
  // Fill UI
  document.getElementById("doctorName").innerText = safe(profile.full_name);
  document.getElementById("email").innerText = safe(profile.email);
  document.getElementById("phone").innerText = safe(profile.phone);
  
  document.getElementById("specialization").innerText = safe(profile.specialization);
  document.getElementById("license").innerText = safe(profile.license_number);
  document.getElementById("experience").innerText = safe(profile.years_experience);