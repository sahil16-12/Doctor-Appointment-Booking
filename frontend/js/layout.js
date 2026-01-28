async function loadHTML(url, fallbackHTML = "") {
  try {
    return await $.get(url);
  } catch (err) {
    console.error(`Failed to load: ${url}`, err);
    return fallbackHTML;
  }
}

function getBasePath() {
  return window.location.pathname.includes("/pages/") ? "../" : "./";
}

function getAuthComponent(pageType) {
  if (pageType === "landing") return "landing";
  if (pageType === "login") return "login";
  if (pageType === "signup") return "signup";
  if (pageType.includes("dashboard")) return "dashboard";
  return null;
}

export async function initLayout(pageType) {
  const $header = $('[data-layout="header"]');
  const $footer = $('[data-layout="footer"]');
  if (!$header.length || !$footer.length) return;

  const basePath = getBasePath();

  const results = await Promise.allSettled([
    loadHTML(`${basePath}components/header.html`),
    loadHTML(`${basePath}components/footer.html`)
  ]);

  const headerHTML =
    results[0].status === "fulfilled" ? results[0].value : "";

  const footerHTML =
    results[1].status === "fulfilled" ? results[1].value : "";



  $header.html(
    headerHTML
      ? headerHTML.replace("{{BASE_PATH}}", basePath)
      : "<div class='navbar'>Sehat</div>"
  );

  $footer.html(
    footerHTML
      ? footerHTML.replace("{{YEAR}}", new Date().getFullYear())
      : "<p>&copy; Sehat</p>"
  );

  const authComponent = getAuthComponent(pageType);
  if (authComponent) {
    const authHTML = await loadHTML(
      `${basePath}components/auth/${authComponent}.html`
    );
  
    $header.find("[data-auth-links]").html(
      authHTML.replace(/{{BASE_PATH}}/g, basePath)
    );
  }
  

  $("#logoutBtn").on("click", () => {
    sessionStorage.clear();
    window.location.href = basePath + "index.html";
  });
}