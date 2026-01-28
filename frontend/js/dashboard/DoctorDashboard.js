import BaseDashboard from "./BaseDashboard.js";

export default class DoctorDashboard extends BaseDashboard {
  constructor() {
    super("doctor", "doctor-dashboard");
  }

  render() {
    const p = this.profile;

    this.setText("#doctorName", p.full_name);
    this.setText("#email", p.email);
    this.setText("#phone", p.phone);
    this.setText("#specialization", p.specialization);
    this.setText("#license", p.license_number);
    this.setText("#experience", p.years_experience);
  }
}
