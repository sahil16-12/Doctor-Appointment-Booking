// ================================================
// LANDING PAGE ANIMATIONS
// ================================================

(function () {
  "use strict";

  // ==================== TYPING ANIMATION ====================
  class TypingAnimation {
    constructor(element, texts, speed = 50) {
      this.element = element;
      this.texts = texts;
      this.speed = speed;
      this.textIndex = 0;
      this.charIndex = 0;
      this.isDeleting = false;
      this.isPaused = false;
    }

    start() {
      this.type();
    }

    type() {
      const currentText = this.texts[this.textIndex];

      if (this.isDeleting) {
        this.element.textContent = currentText.substring(0, this.charIndex - 1);
        this.charIndex--;
      } else {
        this.element.textContent = currentText.substring(0, this.charIndex + 1);
        this.charIndex++;
      }

      let typeSpeed = this.speed;

      if (this.isDeleting) {
        typeSpeed /= 2;
      }

      if (!this.isDeleting && this.charIndex === currentText.length) {
        // Pause at end
        typeSpeed = 2000;
        this.isDeleting = true;
      } else if (this.isDeleting && this.charIndex === 0) {
        this.isDeleting = false;
        this.textIndex = (this.textIndex + 1) % this.texts.length;
        typeSpeed = 500;
      }

      setTimeout(() => this.type(), typeSpeed);
    }
  }

  // ==================== WAVEFORM ANIMATION ====================
  class WaveformAnimation {
    constructor(containerId, barCount = 32) {
      this.container = document.getElementById(containerId);
      this.barCount = barCount;
      this.bars = [];
      this.init();
    }

    init() {
      if (!this.container) return;

      // Create bars
      for (let i = 0; i < this.barCount; i++) {
        const bar = document.createElement("div");
        bar.className = "waveform-bar";
        bar.style.height = "4px";
        this.container.appendChild(bar);
        this.bars.push(bar);
      }

      this.animate();
    }

    animate() {
      setInterval(() => {
        this.bars.forEach((bar, index) => {
          const height = Math.random() * 70 + 30; // Random height between 30% and 100%
          const opacity = Math.random() * 0.4 + 0.6; // Random opacity for variety

          bar.style.height = `${height}%`;
          bar.style.opacity = opacity;
        });
      }, 120);
    }
  }

  // ==================== FEATURE DEMO SWITCHER ====================
  class FeatureDemoSwitcher {
    constructor() {
      this.featureItems = document.querySelectorAll(".feature-item");
      this.demoTitle = document.getElementById("demoTitle");
      this.demoDescription = document.getElementById("demoDescription");
      this.demoContent = document.getElementById("demoContent");
      this.currentFeatureIndex = 0;

      this.demos = {
        0: this.getBookingDemo(),
        1: this.getSpecialistsDemo(),
        2: this.getRemindersDemo(),
      };

      this.init();
    }

    init() {
      if (!this.featureItems.length) return;

      // Add click listeners
      this.featureItems.forEach((item, index) => {
        item.addEventListener("click", () => this.switchFeature(index));
      });

      // Show first demo
      this.showDemo(0);
    }

    switchFeature(index) {
      // Update active state
      this.featureItems.forEach((item) => item.classList.remove("active"));
      this.featureItems[index].classList.add("active");

      // Show corresponding demo
      this.showDemo(index);
      this.currentFeatureIndex = index;
    }

    showDemo(index) {
      const demo = this.demos[index];

      if (this.demoTitle) this.demoTitle.textContent = demo.title;
      if (this.demoDescription)
        this.demoDescription.textContent = demo.description;
      if (this.demoContent) {
        this.demoContent.innerHTML = demo.content;
        lucide.createIcons(); // Reinitialize icons after content change
      }
    }

    getBookingDemo() {
      return {
        title: "Quick Appointment Booking",
        description: "Book appointments with top doctors in real-time",
        content: `
          <div class="booking-demo">
            <div class="demo-card-inner">
              <h4 class="demo-card-title">Your Upcoming Appointments</h4>
              <div class="appointment-card">
                <div class="card-info">
                  <h4>Next Appointment</h4>
                  <p>Dr. Amit Verma - Cardiologist</p>
                  <small style="color: var(--text-gray); font-size: 0.75rem;">Tomorrow at 10:00 AM • City Hospital</small>
                </div>
                <span class="status-badge confirmed">Confirmed</span>
              </div>
              <div class="appointment-card">
                <div class="card-info">
                  <h4>Follow-up</h4>
                  <p>Dr. Sneha Patel - Dermatologist</p>
                  <small style="color: var(--text-gray); font-size: 0.75rem;">Mar 15 at 2:00 PM • Wellness Clinic</small>
                </div>
                <span class="status-badge pending">Pending</span>
              </div>
            </div>

            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-header">
                  <i data-lucide="calendar-check" class="stat-icon"></i>
                  <span class="stat-label">Total Visits</span>
                </div>
                <p class="stat-value">12</p>
                <p class="stat-subtitle">This year</p>
              </div>
              
              <div class="stat-card">
                <div class="stat-header">
                  <i data-lucide="clock" class="stat-icon"></i>
                  <span class="stat-label">Avg Wait Time</span>
                </div>
                <p class="stat-value">5m</p>
                <p class="stat-subtitle">At clinic</p>
              </div>
            </div>
          </div>
        `,
      };
    }

    getSpecialistsDemo() {
      return {
        title: "Browse Verified Specialists",
        description: "Connect with top-rated doctors across all specialties",
        content: `
          <div class="specialists-demo">
            <div class="demo-card-inner">
              <h4 class="demo-card-title">Available Doctors Near You</h4>
              <div class="doctor-card">
                <div class="card-info">
                  <h4>Cardiology</h4>
                  <p>Dr. Amit Verma, MD</p>
                  <small style="color: var(--text-gray); font-size: 0.75rem;">⭐ 4.9 (250 reviews) • 20+ years exp.</small>
                </div>
                <span class="status-badge confirmed">Available</span>
              </div>
              <div class="doctor-card">
                <div class="card-info">
                  <h4>Dermatology</h4>
                  <p>Dr. Sneha Patel, MBBS</p>
                  <small style="color: var(--text-gray); font-size: 0.75rem;">⭐ 4.8 (180 reviews) • 15+ years exp.</small>
                </div>
                <span class="status-badge confirmed">Available</span>
              </div>
              <div class="doctor-card">
                <div class="card-info">
                  <h4>Orthopedics</h4>
                  <p>Dr. Rahul Sharma, MS</p>
                  <small style="color: var(--text-gray); font-size: 0.75rem;">⭐ 4.7 (145 reviews) • 12+ years exp.</small>
                </div>
                <span class="status-badge pending">Busy</span>
              </div>
            </div>

            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-header">
                  <i data-lucide="users" class="stat-icon"></i>
                  <span class="stat-label">Doctors</span>
                </div>
                <p class="stat-value">500+</p>
                <p class="stat-subtitle">Verified specialists</p>
              </div>
              
              <div class="stat-card">
                <div class="stat-header">
                  <i data-lucide="star" class="stat-icon"></i>
                  <span class="stat-label">Avg Rating</span>
                </div>
                <p class="stat-value">4.8</p>
                <p class="stat-subtitle">Patient reviews</p>
              </div>
            </div>
          </div>
        `,
      };
    }

    getRemindersDemo() {
      return {
        title: "Smart Reminder System",
        description: "Never miss an appointment with automated notifications",
        content: `
          <div class="reminders-demo">
            <div class="demo-card-inner">
              <h4 class="demo-card-title">Active Reminders</h4>
              <div class="reminder-card reminder-pulse">
                <div class="card-info">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <div class="reminder-dot"></div>
                    <h4>Appointment Tomorrow</h4>
                  </div>
                  <p>Dr. Amit Verma - Cardiologist</p>
                  <small style="color: var(--text-gray); font-size: 0.75rem;">Reminder sent via SMS & Email</small>
                </div>
                <i data-lucide="bell" style="color: var(--accent-green); width: 20px; height: 20px;"></i>
              </div>
              <div class="reminder-card">
                <div class="card-info">
                  <h4>Follow-up Reminder</h4>
                  <p>Dr. Sneha Patel - Dermatologist</p>
                  <small style="color: var(--text-gray); font-size: 0.75rem;">Scheduled for Mar 14</small>
                </div>
                <i data-lucide="clock" style="color: var(--text-gray); width: 20px; height: 20px;"></i>
              </div>
              <div class="reminder-card">
                <div class="card-info">
                  <h4>Medication Reminder</h4>
                  <p>Take prescribed medication</p>
                  <small style="color: var(--text-gray); font-size: 0.75rem;">Daily at 9:00 AM & 9:00 PM</small>
                </div>
                <i data-lucide="pill" style="color: var(--accent-blue); width: 20px; height: 20px;"></i>
              </div>
            </div>

            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-header">
                  <i data-lucide="bell" class="stat-icon"></i>
                  <span class="stat-label">Reminders</span>
                </div>
                <p class="stat-value">86</p>
                <p class="stat-subtitle">This month</p>
              </div>
              
              <div class="stat-card">
                <div class="stat-header">
                  <i data-lucide="check-circle" class="stat-icon"></i>
                  <span class="stat-label">Success Rate</span>
                </div>
                <p class="stat-value">98%</p>
                <p class="stat-subtitle">Kept appointments</p>
              </div>
            </div>
          </div>
        `,
      };
    }
  }

  // ==================== INITIALIZATION ====================
  function init() {
    // Wait for DOM to be ready
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initAll);
    } else {
      initAll();
    }
  }

  function initAll() {
    // Initialize typing animation
    const typingElement = document.getElementById("typingText");
    if (typingElement) {
      const texts = ["Instantly!", "Securely!", "Anytime!"];
      const typingAnim = new TypingAnimation(typingElement, texts, 100);
      typingAnim.start();
    }

    // Initialize feature demo switcher
    const demoSwitcher = new FeatureDemoSwitcher();

    // Initialize Lucide icons
    if (typeof lucide !== "undefined") {
      lucide.createIcons();
    }
  }

  // Start initialization
  init();
})();
