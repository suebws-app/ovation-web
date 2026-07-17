export const themeInitScript = `(function () {
  try {
    var d = document.documentElement;
    var cookieMatch = document.cookie.match(/(?:^|;\\s*)ovation_theme=([^;]*)/);
    var cookieValue = cookieMatch ? decodeURIComponent(cookieMatch[1]) : null;
    var stored = JSON.parse(localStorage.getItem("theme") || "{}");
    var storedValue = stored && stored.state && stored.state.theme;
    var theme = cookieValue || storedValue || "system";
    var isDark =
      theme === "dark" ||
      (theme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    d.classList.toggle("dark", isDark);
  } catch {}
})();`;

export const themeInitScriptHash =
  "sha256-OcQvZk1zcWAVVLpD63q9ubc6zT5LIb47HzFS/4TjhVk=";
