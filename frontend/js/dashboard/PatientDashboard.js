import BaseDashboard from "./BaseDashboard.js";

export default class PatientDashboard extends BaseDashboard {
  constructor() {
    super("patient", "patient-dashboard");
  }

  render() {
    const p = this.profile;

    this.setText("#patientName", p.full_name);
    this.setText("#email", p.email);
    this.setText("#phone", p.phone);
    this.setText("#dob", p.dob);
    this.setText("#allergies", p.allergies);
    this.setText("#emergency", p.emergency_contact);
  }
}
