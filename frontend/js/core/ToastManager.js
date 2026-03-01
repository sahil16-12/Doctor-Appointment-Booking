export default class ToastManager {
  constructor(container = "#toastContainer") {
    this.$container = $(container);
    if (!this.$container.length) {
      console.log("⚠️ Toast container not found, creating one");
      this.$container = $('<div id="toastContainer"></div>').appendTo("body");
    } else {
      console.log("✅ Toast container found");
    }
  }

  show(msg, type = "success", timeout = 3000) {
    console.log(`🎨 Showing ${type} toast:`, msg);

    const $toast = $(
      `<div class="toast-message ${type}"><span>${msg}</span></div>`,
    );
    this.$container.append($toast);

    console.log(
      "📍 Toast appended to container, total toasts:",
      this.$container.find(".toast-message").length,
    );

    // Auto dismiss
    setTimeout(() => {
      $toast.addClass("fade-out");
      setTimeout(() => $toast.remove(), 300);
    }, timeout);

    // Click to dismiss
    $toast.on("click", () => {
      $toast.addClass("fade-out");
      setTimeout(() => $toast.remove(), 300);
    });
  }

  success(msg) {
    this.show(msg, "success");
  }

  error(msg) {
    this.show(msg, "error");
  }
}
