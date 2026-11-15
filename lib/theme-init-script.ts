/**
 * Inline before hydration so `html.dark` matches next-themes + system preference (reduces flash).
 * Keep logic aligned with `ThemeProvider` (`defaultTheme="system"`).
 *
 * Also sets `html.motion-ok` when the visitor has not asked for reduced motion. All entrance and
 * looping animation in globals.css is gated on that class, so without JS (or with reduced motion)
 * every page renders in its final state.
 */
export const themeInitScript = `
(function(){
  try {
    var root = document.documentElement;
    var t = localStorage.getItem('theme');
    var dark = false;
    if (t === 'dark') dark = true;
    else if (t === 'light') dark = false;
    else dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.classList.toggle('dark', dark);
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) root.classList.add('motion-ok');
  } catch (e) {}
})();
`.trim();
