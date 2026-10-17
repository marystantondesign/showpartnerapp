# 03 · Producer iPad, one screen

Screens: design-handoff/screens/1-producer-ipad/ (5 PNGs) and the matching Main, Producer-Mgmt, Producer-Compose, Producer-Confirm, Producer-Walkthrough sources.

Build a landscape iPad layout for role lead (use the existing useIsTablet hook). One screen, no select-then-next flows.

Left column:
- Metrics row: a dark Fully Ready card, then one card per service with a big "N / 30 done", a stacked bar (done, in progress, paused) and a legend line under it with counts. Never run the numbers together.
- Filter chips: All, Needs attention, Not arrived, Not paired, Ready.
- Model table: look number, photo, name with a sub-line (arrival time, ETA in red if not arrived, flagged note), Hair, Makeup, Nails chips, and the producer's own service assistant. Rows are not buttons. If a model has arrived and has no assistant for the producer's service, show a solid black "+ Pair" pill button in that column, visually unlike the status chips.

Right panel (360px), swaps content:
- Default: Today timeline (demo, walkthrough highlighted with countdown, models back, dressing, show) with a "Push walkthrough time" link; Announcements with ack progress ("22 got it · 3 haven't opened · 1 not delivered"); buttons Start Walkthrough · Pause All Work and New Announcement. No call button.
- Pairing (tap + Pair): model header, "Send to" list of assistants sorted free longest first then soonest to finish, radio select, "Send [model] to [assistant]". No station numbers.
- New announcement: To chips (All assistants, Lead assistants, the artist, Select people), quick messages (Models are back, Dressing in 10, Final touch-ups now), free text, Scheduled list with Edit and Skip for the auto warnings, Send button disabled until there is a message.
- Start walkthrough: confirm modal "Start the walkthrough?" with the copy in Producer-Confirm source, Not yet / Start walkthrough.
- Walkthrough in progress: dark timer card (elapsed, models back time, Change time), every status chip shows Paused, acks for the walkthrough notice, buttons Models Are Back · Resume Work and New Announcement.

Top bar: show name, service and current time, Share Status Link button (wire to prompt 07), avatar.

Acceptance: all five states reachable on the preview at 1180x820, numbers match the mock, pairing updates the table and the assistant's home.
