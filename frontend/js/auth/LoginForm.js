import AuthForm from "./AuthForm.js";

export default class LoginForm extends AuthForm {
  async buildPayload() {
    const email = this.$form.find('input[name="email"]').val().trim();
    const password = this.$form.find('input[name="password"]').val();
    const userType = this.$form.find('input[name="userType"]').val();

    console.log("🔍 Login Form Debug:", {
      email: email,
      passwordLength: password ? password.length : 0,
      userType: userType,
      userTypeUpperCase: userType.toUpperCase(),
    });

    if (!email || !password) {
      this.toast.error("Email and password are required");
      throw "Validation";
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      this.toast.error("Please enter a valid email address");
      throw "Validation";
    }

    return { email, password, userType: userType.toUpperCase() };
  }

  async submit(payload) {
    try {
      console.log("🔐 Attempting login with payload:", {
        ...payload,
        password: "***",
      });

      const { data } = await this.api.post("/api/auth/login", payload);

      console.log("Login successful! Response:", data);

      // Store authentication data
      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("profile", JSON.stringify(data.profile));

      console.log("Session Storage After Login:", {
        token: sessionStorage.getItem("token"),
        profile: JSON.parse(sessionStorage.getItem("profile")),
      });

      this.toast.success(data.message || "Login successful!");

      // Redirect to appropriate dashboard
      setTimeout(() => {
        const userType = (data.profile.userType || "").toUpperCase();
        console.log("Redirecting user with type:", userType);

        if (userType === "DOCTOR") {
          window.location.href = "../pages/doctor-dashboard.html";
        } else if (userType === "PATIENT") {
          window.location.href = "../pages/patient-dashboard.html";
        } else {
          console.error("Unknown user type:", userType);
          this.toast.error("Invalid user type received from server");
        }
      }, 1500);
    } catch (err) {
      console.error("❌ Login error details:", {
        status: err.status,
        message: err.message,
        originalError: err.originalError,
      });

      // Show the actual error message from the server
      const errorMsg = err.message || "Login failed. Please try again.";
      console.log("🚨 Showing error toast:", errorMsg);
      this.toast.error(errorMsg);

      // Re-throw to prevent any unintended side effects
      throw err;
    }
  }
}
