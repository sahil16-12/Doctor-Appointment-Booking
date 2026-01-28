export default class AuthForm {
    constructor(formSelector, api, toast) {
      this.$form = $(formSelector);
      if (!this.$form.length) throw new Error("Form not found");
  
      this.api = api;
      this.toast = toast;
      this.$submit = this.$form.find('[type="submit"]');
  
      this.bindEvents();
    }
  
    bindEvents() {
      this.$form.on("submit", (e) => this.onSubmit(e));
    }
  
    async onSubmit(e) {
      e.preventDefault();
      this.disable();
      try {
        const payload = await this.buildPayload();
        await this.submit(payload);
      } catch (err) {
        console.error(err);
      } finally {
        this.enable();
      }
    }
  
    disable() { this.$submit.prop("disabled", true); }
    enable() { this.$submit.prop("disabled", false); }
  
    async buildPayload() { throw "Not implemented"; }
    async submit(payload) { throw "Not implemented"; }
  }
  