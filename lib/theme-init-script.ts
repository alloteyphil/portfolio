/**
 * Inline before hydration so `html.dark` matches next-themes + system preference (reduces flash).
 * Keep logic aligned with `ThemeProvider` (`defaultTheme="system"`).
 */
export const themeInitScript = `
(function(){
  try {
    var t = localStorage.getItem('theme');
    var dark = false;
    if (t === 'dark') dark = true;
    else if (t === 'light') dark = false;
    else dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.toggle('dark', dark);
  } catch (e) {}
})();
`.trim();
