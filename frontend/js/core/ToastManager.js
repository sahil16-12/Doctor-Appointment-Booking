export default class ToastManager {
    constructor(container = "#toastContainer") {
      this.$container = $(container);
      if (!this.$container.length) {
        this.$container = $('<div id="toastContainer"></div>').appendTo("body");
      }
    }
  
    show(msg, type = "success", timeout = 3000) {
      const $toast = $(`<div class="toast-message ${type}">${msg}</div>`);
      this.$container.append($toast);
  
      setTimeout(() => {
        $toast.addClass("fade-out");
        setTimeout(() => $toast.remove(), 300);
      }, timeout);
    }
  
    success(msg) { this.show(msg, "success"); }
    error(msg) { this.show(msg, "error"); }
  }
  