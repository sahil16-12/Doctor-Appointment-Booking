function createNavLink(href, label) {
  return `<a href="${href}">${label}</a>`;
}

export function initLayout(pageType) {
  const headerEl = document.querySelector('[data-layout="header"]');
  const footerEl = document.querySelector('[data-layout="footer"]');

  if (!headerEl || !footerEl) return;

  const currentPath = window.location.pathname;
  const isInPagesFolder = currentPath.includes('/pages/');
  const basePath = isInPagesFolder ? '../' : './';

  let authLinks = "";

  if (pageType === "landing") {
    authLinks =
      createNavLink(`${basePath}pages/login.html`, "Login") +
      `<a href="${basePath}pages/signup.html" class="signup-btn">Sign Up</a>`;
  } else if (pageType === "login") {
    authLinks = `<a href="signup.html" class="signup-btn">Sign Up</a>`;
  } else if (pageType === "signup") {
    authLinks = createNavLink("login.html", "Login");
  }

  headerEl.innerHTML = `
    <div class="navbar">
      <a href="${basePath}index.html" class="logo">Sehat</a>
      <nav class="nav-links">
        ${authLinks}
      </nav>
    </div>
  `;

  footerEl.innerHTML = `
    <div class="footer-inner">
      <p>&copy; ${new Date().getFullYear()} Sehat. All rights reserved.</p>
    </div>
  `;
}