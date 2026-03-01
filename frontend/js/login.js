import { initLayout } from "./layout.js";
import ApiClient from "./core/ApiClient.js";
import ToastManager from "./core/ToastManager.js";
import LoginForm from "./auth/LoginForm.js";

initLayout("login");

$(function () {
  console.log("🚀 Login page initializing...");

  // Initialize Lucide icons
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }

  // Setup user type toggle
  const toggleBtns = document.querySelectorAll(".toggle-btn");
  const userTypeInput = document.querySelector('input[name="userType"]');

  if (toggleBtns.length && userTypeInput) {
    console.log(
      "✅ User type toggle found, initial value:",
      userTypeInput.value,
    );
    toggleBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        toggleBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        userTypeInput.value = btn.dataset.type;
        console.log("👤 User type changed to:", userTypeInput.value);
      });
    });
  }

  // Initialize form handler
  console.log("🔧 Initializing API Client and Toast Manager...");
  const api = new ApiClient("https://localhost:7168");
  const toast = new ToastManager();

  console.log("📝 Initializing Login Form...");
  const loginForm = new LoginForm("#loginForm", api, toast);
  console.log("✅ Login Form initialized:", loginForm);

  // Prevent any accidental form reset
  const form = document.getElementById("loginForm");
  if (form) {
    form.addEventListener("reset", (e) => {
      console.warn("⚠️ Form reset prevented!");
      e.preventDefault();
      return false;
    });
  }

  // Enable submit button after form is ready
  const submitBtn = document.getElementById("loginSubmitBtn");
  if (submitBtn) {
    submitBtn.disabled = false;
    console.log("✅ Submit button enabled");
  }

  console.log("🎉 Login page initialization complete!");
});
