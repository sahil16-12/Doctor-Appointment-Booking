import { initLayout } from "./layout.js";
import PatientDashboard from "./dashboard/PatientDashboard.js";

$(function () {
  const dashboard = new PatientDashboard();
  dashboard.init(initLayout);
});
