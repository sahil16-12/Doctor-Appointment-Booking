import AuthForm from "./AuthForm.js";

export default class SignupForm extends AuthForm {
  constructor(formSelector, api, toast) {
    super(formSelector, api, toast);
    this.$patient = $("#patientFields");
    this.$doctor = $("#doctorFields");
    this.$doctorRequired = this.$doctor.find("select, input");
    this.userTypeInput = document.getElementById("userTypeInput");
    this.updateConditionalFields(this.userTypeInput?.value || "patient");
  }

  updateConditionalFields(userType) {
    const isDoctor = userType === "doctor";
    this.$patient.toggle(!isDoctor);
    this.$doctor.toggle(isDoctor);
    this.$doctorRequired.prop("disabled", !isDoctor);
    this.$doctorRequired.prop("required", isDoctor);
  }

  async buildPayload() {
    const f = (s) => this.$form.find(s).val()?.trim() ?? "";
    const userType =
      this.userTypeInput?.value ||
      this.$form.find('input[name="userType"]').val();

    // Helper to extract only digits from phone numbers
    const extractDigits = (str) => str.replace(/\D/g, "");

    const phoneRaw = f('input[name="phone"]');
    const phoneDigits = extractDigits(phoneRaw);

    // Validate phone number
    if (phoneDigits.length !== 10) {
      this.toast.error("Phone number must be exactly 10 digits");
      throw "Validation";
    }

    // Validate email format
    const email = f('input[name="email"]');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      this.toast.error("Please enter a valid email address");
      throw "Validation";
    }

    // Validate full name
    const fullName = f('input[name="fullName"]');
    if (fullName.length < 3) {
      this.toast.error("Full name must be at least 3 characters");
      throw "Validation";
    }
    if (!/^[a-zA-Z ]+$/.test(fullName)) {
      this.toast.error("Full name can only contain letters and spaces");
      throw "Validation";
    }

    // Validate date of birth
    const dobStr = f('input[name="dob"]');
    if (!dobStr) {
      this.toast.error("Date of birth is required");
      throw "Validation";
    }

    const payload = {
      userType: userType.toUpperCase(), // Convert to PATIENT or DOCTOR
      fullName: fullName,
      email: email,
      phone: phoneDigits, // Send only digits
      dob: dobStr,
      password: f('input[name="password"]'),
    };

    const confirm = f('input[name="confirmPassword"]');
    if (payload.password !== confirm) {
      this.toast.error("Passwords do not match");
      throw "Validation";
    }

    // Validate password length
    if (payload.password.length < 6) {
      this.toast.error("Password must be at least 6 characters long");
      throw "Validation";
    }

    if (userType === "patient") {
      const emergencyRaw = f('input[name="emergencyContact"]');
      const emergencyDigits = emergencyRaw ? extractDigits(emergencyRaw) : "";

      // Validate emergency contact if provided
      if (emergencyDigits && emergencyDigits.length !== 10) {
        this.toast.error("Emergency contact must be exactly 10 digits");
        throw "Validation";
      }

      payload.emergencyContact = emergencyDigits || null;

      const allergies = f('input[name="allergies"]');
      // Validate allergies if provided - must be at least 3 characters
      if (allergies && allergies.length < 3) {
        this.toast.error("Allergies description must be at least 3 characters");
        throw "Validation";
      }
      payload.allergies = allergies || null;
    } else {
      const specialization = f('select[name="specialization"]');
      const licenseNumber = f('input[name="licenseNumber"]');
      const yearsStr = f('input[name="yearsExperience"]');

      // Validate required doctor fields
      if (!specialization) {
        this.toast.error("Please select a specialization");
        throw "Validation";
      }
      if (!licenseNumber) {
        this.toast.error("License number is required");
        throw "Validation";
      }
      if (!yearsStr) {
        this.toast.error("Years of experience is required");
        throw "Validation";
      }

      const years = parseInt(yearsStr, 10);
      if (isNaN(years) || years < 0 || years > 60) {
        this.toast.error("Years of experience must be between 0 and 60");
        throw "Validation";
      }

      payload.specialization = specialization;
      payload.licenseNumber = licenseNumber;
      payload.yearsExperience = years;
    }

    return payload;
  }

  async submit(payload) {
    try {
      console.log("📝 Attempting signup with payload:", {
        ...payload,
        password: "***",
      });

      const { data } = await this.api.post("/api/auth/signup", payload);

      console.log("✅ Signup successful! Response:", data);

      this.toast.success(
        data.message || "Signup successful! Redirecting to login...",
      );

      setTimeout(() => (window.location.href = "../pages/login.html"), 1500);
    } catch (err) {
      console.error("❌ Signup error details:", {
        status: err.status,
        message: err.message,
        originalError: err.originalError,
      });

      // Show the actual error message from the server
      const errorMsg = err.message || "Signup failed. Please try again.";
      console.log("🚨 Showing error toast:", errorMsg);
      this.toast.error(errorMsg);

      // Re-throw to prevent any unintended behavior
      throw err;
    }
  }
}
