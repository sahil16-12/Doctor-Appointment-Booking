import BaseDashboard from "./BaseDashboard.js";

export default class DoctorDashboard extends BaseDashboard {
  constructor() {
    super("doctor", "doctor-dashboard");
  }

  render() {
    const p = this.profile;

    // Basic info
    $("#doctorName").text(this.safe(p.fullName));
    $("#infoName").text(this.safe(p.fullName));
    $("#infoEmail").text(this.safe(p.email));
    $("#infoPhone").text(this.safe(p.phone));

    // Professional info
    $("#infoSpecialization").text(
      this.safe(p.specialization) || "General Practice",
    );
    $("#infoLicense").text(this.safe(p.licenseNumber) || "LIC-2024-XXXXX");
    $("#infoExperience").text(this.safe(p.yearsExperience) || "5");

    // Dummy rating for display
    $("#doctorRating").text("4.8/5.0");
  }
}
