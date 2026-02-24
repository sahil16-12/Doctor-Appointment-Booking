import BaseDashboard from "./BaseDashboard.js";

export default class PatientDashboard extends BaseDashboard {
  constructor() {
    super("patient", "patient-dashboard");
  }

  render() {
    const p = this.profile;

    // Basic info
    $("#patientName").text(this.safe(p.fullName));
    $("#infoEmail").text(this.safe(p.email));
    $("#infoPhone").text(this.safe(p.phone));

    // Format date
    const dobDate = new Date(p.dob);
    const dobFormatted = dobDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    $("#infoDob").text(dobFormatted);

    // Medical info
    $("#infoAllergies").text(this.safe(p.allergies) || "None reported");
    $("#infoEmergency").text(this.safe(p.emergencyContact) || "Not provided");

    // Member since
    const createdDate = new Date(p.createdAt);
    const monthYear = createdDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
    $("#memberSince").text(monthYear);

    // Last login (dummy data)
    const now = new Date();
    $("#lastLogin").text(
      `Last login today at ${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")} ${now.getHours() >= 12 ? "PM" : "AM"}`,
    );
  }
}
