// import { initLayout } from "./layout.js";
// initLayout("patient-dashboard");

// function safe(value) {
//   return value && value !== "" ? value : "Not provided";
// }

// const profile = JSON.parse(sessionStorage.getItem("profile"));
// const token = sessionStorage.getItem("token");

// // Auth guard
// if (!token || !profile || profile.user_type !== "patient") {
//   window.location.href = "../pages/login.html";
// }

// // Fill UI
// document.getElementById("patientName").innerText = safe(profile.full_name);
// document.getElementById("email").innerText = safe(profile.email);
// document.getElementById("phone").innerText = safe(profile.phone);
// document.getElementById("dob").innerText = safe(profile.dob);

// document.getElementById("allergies").innerText = safe(profile.allergies);
// document.getElementById("emergency").innerText = safe(profile.emergency_contact);


/// Jquery VERSION BELOW

import { initLayout } from "./layout.js";
initLayout("patient-dashboard");

function safe(value) {
  return value && value !== "" ? value : "Not provided";
}

$(document).ready(function () {
  const profile = JSON.parse(sessionStorage.getItem("profile"));
  const token = sessionStorage.getItem("token");

  // Auth guard
  if (!token || !profile || profile.user_type !== "patient") {
    window.location.href = "../pages/login.html";
    return;
  }

  // Fill UI
  $("#patientName").text(safe(profile.full_name));
  $("#email").text(safe(profile.email));
  $("#phone").text(safe(profile.phone));
  $("#dob").text(safe(profile.dob));

  $("#allergies").text(safe(profile.allergies));
  $("#emergency").text(safe(profile.emergency_contact));
});
