import { initLayout } from "./layout.js";
import ApiClient from "./core/ApiClient.js";
import ToastManager from "./core/ToastManager.js";
import LoginForm from "./auth/LoginForm.js";

initLayout("login");

$(function () {
  const api = new ApiClient("http://localhost:5000");
  const toast = new ToastManager();
  new LoginForm("#loginForm", api, toast);
});
