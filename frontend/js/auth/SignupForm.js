import AuthForm from "./AuthForm.js";

export default class SignupForm extends AuthForm {

  constructor(formSelector, api, toast) {
    super(formSelector, api, toast);
    this.$patient = $("#patientFields");
    this.$doctor = $("#doctorFields");
    this.bindUserTypeSwitch();
  }

  bindUserTypeSwitch() {
    this.$form.find('input[name="userType"]').on("change", e => {
      const val = e.target.value;
      this.$patient.toggle(val === "patient");
      this.$doctor.toggle(val === "doctor");
    });
  }

  async buildPayload() {
    const f = (s) => this.$form.find(s).val()?.trim() ?? "";
    const userType = this.$form.find('input[name="userType"]:checked').val();

    const payload = {
      userType,
      fullName: f('input[placeholder="Full Name"]'),
      email: f('input[placeholder="Email Address"]'),
      phone: f('input[placeholder="Phone Number"]'),
      dob: f('input[type="date"]'),
      password: f('input[placeholder="Password"]')
    };

    const confirm = f('input[placeholder="Confirm Password"]');
    if (payload.password !== confirm) {
      this.toast.error("Passwords do not match");
      throw "Validation";
    }

    if (userType === "patient") {
      payload.emergencyContact = f('#patientFields input[placeholder*="Emergency"]');
      payload.allergies = f('#patientFields input[placeholder*="Allergies"]');
    } else {
      payload.specialization = f('#doctorFields select');
      payload.licenseNumber = f('#doctorFields input[placeholder*="License"]');
      payload.yearsExperience = f('#doctorFields input[placeholder*="Years"]');
    }

    return payload;
  }

  async submit(payload) {
    try {
      await this.api.post("/api/auth/signup", payload);
      this.toast.success("Signup successful! Redirecting...");
      setTimeout(() => window.location.href = "login.html", 1500);
    } catch (err) {
      this.toast.error(err.message);
    }
  }
}
