# 14 · Dark mode fixes

Scope: dark mode bugs in src/views/ProducerIPadView.jsx and src/index.css. Match DK1 and DK2 exactly. Light mode must stay exactly as it is.

Ground rules: redesign branch only. Never commit to or merge into main, never run vercel --prod, never promote or redeploy to production. The redesign deploys on its own to showpartnerapp-2.vercel.app when you push.

Step 1: copy screens/14-dark-mode/ into design-handoff/screens/ and design-source/*.dc.html into design-handoff/design-source/. List them back to me. Open both PNGs and both source files before coding.

Step 2: before editing, report every element that uses the inverse background (--sp-inverse-bg or equivalent) and what color its text and icons use now, with line numbers.

Fixes:
1. Anything on the inverse background uses --sp-inverse-text for text AND icons: the active menu tile and its label, the active filter chip ("All 30"), the menu button when open, black buttons (Start walkthrough, + Pair), the Fully ready card, the selected "next" timeline row. No hardcoded #fff or white on these. In dark these surfaces are #F0EDE8 with #111 text.
2. Menu button in dark (DK2 closed, DK1 open): closed = #242220 background, 1px #F0EDE8 border, #F0EDE8 three-line icon. Open = #F0EDE8 background, #111 X icon. The icon is always visible.
3. Dark mode toggle (DK1): on = track #7A9E7E, knob #F0EDE8 on the right. Off = track --sp-border, knob on the left. It shows "on" whenever dark mode is on, including right after a refresh.
4. Account menu: dividers #2E2B28, not white. Remove the white bars above and below the Dark mode row (a focus or hover style). Hover = a slightly lighter background. Keyboard focus = :focus-visible 2px #F0EDE8 outline, 2px offset.
5. Progress bars: empty track #4A4743 in dark (so it shows on the #242220 cards). "Not started" legend dot #8E8A84.
6. Status chips: keep their background colors, labels #111 in both modes. Not started chip #8E8A84 in dark.
7. Timeline: past rows #8E8A84, upcoming rows #F0EDE8, the next row inverted (#F0EDE8 background, #111 text, amber "in 15 min" #8A6516).
8. Red text in dark (flags, "Not arrived · ETA", Log out): #E8826B.
9. After fixing, check every text and icon color against its background in dark mode and list any pair under 4.5:1 you changed.
10. Separately: the Home table currently shows DONE for every model while the cards say 8 fully ready and 3 not arrived. Make the table read the same per-model status data the cards count, so they agree (DK1/DK2 show the right mix).

Acceptance: in dark mode nothing disappears, the toggle matches the real state, no white lines in the account menu, and the table matches the counts. Report file names and line numbers changed, run the build, commit and push to redesign.
