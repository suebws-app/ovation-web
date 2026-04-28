(function () {
  try {
    var d = document.documentElement;
    var t = JSON.parse(localStorage.getItem("theme") || "{}");
    var v = t && t.state && t.state.theme;
    if (
      v === "dark" ||
      (v !== "light" && matchMedia("(prefers-color-scheme:dark)").matches)
    ) {
      d.classList.add("dark");
    }
  } catch (e) {}
})();
