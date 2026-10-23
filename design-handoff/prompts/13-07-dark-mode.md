# 13-07 · Dark mode and contrast (DK1)

Scope: ProducerIPadView.jsx and src/index.css. The toggle already adds the dark class to <html>; the iPad view hardcodes every color, so nothing changes. Use design-source/Dark-Home.dc.html.

1. Report the line 14 constants and every hardcoded hex color in ProducerIPadView with line numbers, plus the phone's existing dark values (dark: classes in ListView, SettingsView, HomeView and .dark rules in index.css) as a light to dark table.
2. In index.css define variables on :root and redefine under .dark: --sp-bg #F5F2EE / #1A1816, --sp-surface #FFFFFF / #242220, --sp-border #E0DDD8 / #2E2B28, --sp-rail #ECE8E3 / #211F1D, --sp-text #111111 / #F0EDE8, --sp-muted #4A4743 / #B5B0AA, --sp-muted-2 #6E6A64 / #8E8A84, --sp-inverse-bg #111111 / #F0EDE8, --sp-inverse-text #FFFFFF / #111111, --sp-red-text #A33D28 / #E8826B, --sp-green-text #3F6B45 / #9DC3A1, --sp-amber-text #8A6516 / #E3BE6E.
3. Point every neutral in ProducerIPadView at the variables, including overlays (account menu, notifications, share modal, model panel, show history, Studio).
4. Black things invert in dark (active menu tile, black buttons, Fully ready card) so they still stand out.
5. Status chips keep their background colors and #111 labels in both modes. Not started chip in dark: #8E8A84.
6. Dark mode survives a refresh.
Acceptance: toggling Dark mode changes every iPad screen with no white panels left, all text passes WCAG AA, and light mode looks the same as before.
