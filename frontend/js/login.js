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
  const userType = form.querySelector('input[name="userType"]:checked').value;
  const email = form.querySelector('input[type="email"]').value.trim();
  const password = form.querySelector('input[type="password"]').value;
  if (!email || !password) {
    showToast("Please enter both email and password.", "error");
    return;
  }
  try {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, userType }),
    });
    const data = await res.json();
    if (res.ok) {
      // Store JWT and user info in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      showToast("Login successful! Redirecting...", "success");
      setTimeout(() => {
        if (userType === "doctor") {
          window.location.href = "doctor-dashboard.html";
        } else {
          window.location.href = "patient-dashboard.html";
        }
      }, 1200);
    } else {
      showToast(data.message || "Login failed.", "error");
    }
  } catch (err) {
    showToast("Network error. Please try again.", "error");
  }
});
