export default class AuthForm {
  constructor(formSelector, api, toast) {
    this.$form = $(formSelector);
    if (!this.$form.length) {
      console.error("❌ Form not found with selector:", formSelector);
      throw new Error("Form not found");
    }

    console.log("✅ Form found:", formSelector);
    this.api = api;
    this.toast = toast;
    this.$submit = this.$form.find('[type="submit"]');

    if (!this.$submit.length) {
      console.warn("⚠️ Submit button not found in form");
    } else {
      console.log("✅ Submit button found");
    }

    this.bindEvents();
  }

  bindEvents() {
    console.log("🔗 Binding form submit event");
    this.$form.on("submit", (e) => this.onSubmit(e));
    console.log("✅ Form submit event bound");
  }

  async onSubmit(e) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    // Prevent double submission
    if (this.$submit.prop("disabled")) {
      console.log("Form already submitting, ignoring...");
      return false;
    }

    console.log("📝 Form submit started");
    this.disable();

    try {
      const payload = await this.buildPayload();
      console.log("✅ Payload built successfully");
      await this.submit(payload);
      console.log("✅ Submit completed successfully");
    } catch (err) {
      console.error("❌ Form submission error:", err);
      // Error is already handled and displayed by child class
      // Don't clear form on error - user should be able to fix and retry
    } finally {
      this.enable();
      console.log("🔓 Form re-enabled");
    }

    return false;
  }

  disable() {
    this.$submit.prop("disabled", true);
  }
  enable() {
    this.$submit.prop("disabled", false);
  }

  async buildPayload() {
    throw "Not implemented";
  }
  async submit(payload) {
    throw "Not implemented";
  }
}
