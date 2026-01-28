import AuthService from "../core/AuthService.js";

export default class BaseDashboard {
  constructor(role, layoutType) {
    this.role = role;
    this.layoutType = layoutType;
    this.profile = null;
  }

  initLayout(initLayoutFn) {
    initLayoutFn(this.layoutType);
  }

  initAuth() {
    this.profile = AuthService.requireRole(this.role);
    if (!this.profile) return false;
    return true;
  }

  safe(value) {
    return value && value !== "" ? value : "Not provided";
  }

  setText(selector, value) {
    $(selector).text(this.safe(value));
  }

  // Template method pattern
  init(initLayoutFn) {
    this.initLayout(initLayoutFn);
    if (!this.initAuth()) return;
    this.render();
  }

  // to be implemented by child
  render() {
    throw new Error("render() must be implemented by child dashboard");
  }
}
