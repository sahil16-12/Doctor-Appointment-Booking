import { initLayout } from "./layout.js";
import ApiClient from "./core/ApiClient.js";
import ToastManager from "./core/ToastManager.js";
import SignupForm from "./auth/SignupForm.js";

initLayout("signup");

$(function () {
  // Initialize Lucide icons
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }

  // Setup user type toggle
  const toggleBtns = document.querySelectorAll(".toggle-btn");
  const userTypeInput = document.getElementById("userTypeInput");
  const formTitle = document.getElementById("formTitleText");
  const formDesc = document.getElementById("formDescText");
  const patientFields = document.getElementById("patientFields");
  const doctorFields = document.getElementById("doctorFields");

  if (toggleBtns.length && userTypeInput) {
    toggleBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        const type = this.dataset.type;

        // Update active state
        toggleBtns.forEach((b) => b.classList.remove("active"));
        this.classList.add("active");

        // Update hidden input
        userTypeInput.value = type;

        // Update form title and description
        if (type === "patient") {
          formTitle.textContent = "Patient Registration";
          formDesc.textContent =
            "Create your account to book appointments with verified doctors";
          if (patientFields) patientFields.style.display = "block";
          if (doctorFields) doctorFields.style.display = "none";
          // Update required fields
          document
            .querySelectorAll("#patientFields input")
            .forEach((input) => (input.required = true));
          document
            .querySelectorAll("#doctorFields input, #doctorFields select")
            .forEach((input) => (input.required = false));
        } else {
          formTitle.textContent = "Doctor Registration";
          formDesc.textContent =
            "Join our network of verified healthcare professionals";
          if (patientFields) patientFields.style.display = "none";
          if (doctorFields) doctorFields.style.display = "block";
          // Update required fields
          document
            .querySelectorAll("#patientFields input")
            .forEach((input) => (input.required = false));
          document
            .querySelectorAll("#doctorFields input, #doctorFields select")
            .forEach((input) => (input.required = true));
        }

        // Re-initialize icons for dynamic content
        if (typeof lucide !== "undefined") {
          lucide.createIcons();
        }
      });
    });
  }

  // Initialize form handler
  const api = new ApiClient("https://localhost:7168");
  const toast = new ToastManager();
  new SignupForm("#signupForm", api, toast);

  // Enable submit button after form is ready
  const submitBtn = document.getElementById("signupSubmitBtn");
  if (submitBtn) {
    submitBtn.disabled = false;
  }
});
