# 07 · Show status link

Screen: design-handoff/screens/4-show-status-link/7-show-status-link.png, source Fix-MobileSheet.dc.html (the file name is old, the content is the status page).

Add a public read-only route (for example /status/:token) that needs no login:
- Show name, "Live · updated [time]" with Refresh.
- A ring with percent fully ready, plus Ready N of 30, Show in, Not arrived.
- By team: Hair, Makeup, Nails, each with "N of 30 done", a stacked bar and a breakdown line, plus a legend.
- Next up: walkthrough, dressing, show times.
- Footer: "Shared by [producer], Makeup Producer. This link stops working when the show ends."
- No model names or photos anywhere on this page.

The producer's Share Status Link button (prompt 03) copies the link and offers the native share sheet so Jen can text it. After the show end time the route shows a simple "This show has ended" page.

Acceptance: the link opens on a phone without logging in, shows only aggregate numbers, and matches the PNG.
