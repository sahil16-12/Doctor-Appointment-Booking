import { initLayout } from "./layout.js";

initLayout("login");

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

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.target;
  const email = form.querySelector('input[type="email"]').value.trim();
  const password = form.querySelector('input[type="password"]').value;
  const userType = form.querySelector('input[name="userType"]:checked').value;

  if (!email || !password) {
    showToast("Please enter both email and password.", "error");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password,userType }),
    });

    const data = await res.json();

    if (!res.ok) {
      showToast(data.message || "Login failed.", "error");
      return;
    }

    const profile = data.profile;

    if (!profile || !profile.user_type) {
      showToast("Invalid profile received. Contact support.", "error");
      return;
    }

    // Store token + full profile
    sessionStorage.setItem("token", data.token);
    sessionStorage.setItem("profile", JSON.stringify(profile));

    showToast("Login successful! Redirecting...", "success");

    setTimeout(() => {
      if (profile.user_type === "doctor") {
        window.location.href = "doctor-dashboard.html";
      } else if (profile.user_type === "patient") {
        window.location.href = "patient-dashboard.html";
      } else {
        showToast("Unknown user type.", "error");
      }
    }, 1200);
  } catch (err) {
    console.error(err);
    showToast("Network error. Please try again.", "error");
  }
});
