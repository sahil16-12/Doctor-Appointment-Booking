import AuthForm from "./AuthForm.js";

export default class SignupForm extends AuthForm {
  constructor(formSelector, api, toast) {
    super(formSelector, api, toast);
    this.$patient = $("#patientFields");
    this.$doctor = $("#doctorFields");
    this.$doctorRequired = this.$doctor.find("select, input");
    this.bindUserTypeSwitch();
    this.updateConditionalFields(
      this.$form.find('input[name="userType"]:checked').val(),
    );
  }

  bindUserTypeSwitch() {
    this.$form.find('input[name="userType"]').on("change", (e) => {
      const userType = e.target.value;
      this.updateConditionalFields(userType);
    });
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
    const userType = this.$form.find('input[name="userType"]:checked').val();

    const payload = {
      userType: userType.toUpperCase(), // Convert to PATIENT or DOCTOR
      fullName: f('input[name="fullName"]'),
      email: f('input[name="email"]'),
      phone: f('input[name="phone"]'),
      dob: f('input[name="dob"]'),
      password: f('input[name="password"]'),
    };

    const confirm = f('input[name="confirmPassword"]');
    if (payload.password !== confirm) {
      this.toast.error("Passwords do not match");
      throw "Validation";
    }

    if (userType === "patient") {
      payload.emergencyContact = f('input[name="emergencyContact"]') || null;
      payload.allergies = f('input[name="allergies"]') || null;
    } else {
      payload.specialization = f('select[name="specialization"]');
      payload.licenseNumber = f('input[name="licenseNumber"]');
      const yearsStr = f('input[name="yearsExperience"]');
      payload.yearsExperience = yearsStr ? parseInt(yearsStr, 10) : null;
    }

    return payload;
  }

  async submit(payload) {
    try {
      console.log("Signup Payload:", payload);
      await this.api.post("/api/auth/signup", payload);
      this.toast.success("Signup successful! Redirecting...");
      setTimeout(() => (window.location.href = "login.html"), 1500);
    } catch (err) {
      console.error("Signup Error:", err);
      this.toast.error(err.message);
    }
  }
}
