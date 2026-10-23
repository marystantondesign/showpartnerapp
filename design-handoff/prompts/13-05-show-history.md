# 13-05 · Show history (H1)

Scope: Show history from the account menu on iPad. Delete the hardcoded list (Resort 2025, Spring / Summer 2025, Fall / Winter 2024). Use design-source/Show-History.dc.html.

Modal 940 by 640, two panes.
Left (320px): "Show history" Georgia 24px, "3 past shows". Rows are buttons: show name in Georgia ("Valentino FW25"), then "November 2025 · Palazzo Visconti, Milan". No role line. Selected row: white with inset 1.5px #111 border. Most recent selected on open.
Right: header with show name, "Fall / Winter 2025 · November 2025 · Palazzo Visconti, Milan", START A NEW SHOW FROM THIS (copies team, venue and partners into a new show draft), and close. Body in two columns:
- Left: Designer (brand and show contact), Models (photo grid, "30 models · 4 you've worked with before"), Artists and assistants (stars, Invited back / Invite back, "All 28").
- Right: Venue (name plus the producer's venue notes), Worked alongside (hair, nails, show production, casting companies with leads), How it went (walkthrough planned vs actual, ready at walkthrough, incidents), Receipts (total and breakdown, kept small).
Use showHistory from src/data/mockData.js and extend it with these fields. Reuse ShowDetail logic for ratings and notes where it fits.
