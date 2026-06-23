const THEME_INIT_SCRIPT = `(function(){try{var d=document.documentElement;var cm=document.cookie.match(/(?:^|;\\s*)ovation_theme=([^;]*)/);var cv=cm?decodeURIComponent(cm[1]):null;var s=JSON.parse(localStorage.getItem("theme")||"{}");var sv=s&&s.state&&s.state.theme;var t=cv||sv||"system";var isDark=t==="dark"||(t==="system"&&window.matchMedia("(prefers-color-scheme: dark)").matches);d.classList.toggle("dark",isDark);}catch{}})();`;

export const ThemeInitScript = () => (
  <script
    id="theme-init"
    dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }}
  />
);
