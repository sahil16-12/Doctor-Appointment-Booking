import { initLayout } from "./layout.js";
import DoctorDashboard from "./dashboard/DoctorDashboard.js";

$(function () {
  const dashboard = new DoctorDashboard();
  dashboard.init(initLayout);
});
