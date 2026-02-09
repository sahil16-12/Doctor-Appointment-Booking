import { initLayout } from "./layout.js";
import ApiClient from "./core/ApiClient.js";
import ToastManager from "./core/ToastManager.js";
import SignupForm from "./auth/SignupForm.js";

initLayout("signup");

$(function () {
  const api = new ApiClient("https://localhost:7168");
  const toast = new ToastManager();
  new SignupForm("#signupForm", api, toast);
});
