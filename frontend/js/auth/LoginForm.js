import AuthForm from "./AuthForm.js";

export default class LoginForm extends AuthForm {
  async buildPayload() {
    const email = this.$form.find('input[name="email"]').val().trim();
    const password = this.$form.find('input[name="password"]').val();
    const userType = this.$form.find('input[name="userType"]:checked').val();

    if (!email || !password) {
      this.toast.error("Email and password required");
      throw "Validation";
    }
    return { email, password, userType: userType.toUpperCase() };
  }

  async submit(payload) {
    try {
      const { data } = await this.api.post("/api/auth/login", payload);

      console.log("Login Response:", data);

      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("profile", JSON.stringify(data.profile));

      console.log("Session Storage After Login:", {
        token: sessionStorage.getItem("token"),
        profile: JSON.parse(sessionStorage.getItem("profile")),
      });

      this.toast.success("Login successful!");

      setTimeout(() => {
        if (data.profile.userType === "doctor") {
          window.location.href = "doctor-dashboard.html";
        } else {
          window.location.href = "patient-dashboard.html";
        }
      }, 1200);
    } catch (err) {
      this.toast.error(err.message);
    }
  }
}
