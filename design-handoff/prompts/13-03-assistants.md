# 13-03 · Assistants list spacing and detail (D2)

Scope: IPadAssistantsSection in ProducerIPadView. Use design-source/Docked-Assistants.dc.html as the spec.

List column (440px):
1. Header padding 16px 20px 10px. "Team today" Georgia 22px, with "26 assistants · 2 leads" right-aligned in 12px muted. Real counts.
2. Chips with counts: All 28, Working 21, Free 5, Leads 2 (real counts), 8px gap.
3. If you keep Hair / Makeup / Nails group labels: same 20px inset as the row content, 16px above, 6px below, so they line up with the avatars.
4. List padding 0 8px 16px. Rows min 64px, padding 0 12px, 12px gap, 10px radius, 40px avatar, name 14px weight 500, status 12px under it. Selected row: white with an inset 1.5px #111 border.

Detail pane (padding 24px 32px, 22px gaps), top to bottom:
1. 72px photo, name in Georgia 28px, "Makeup assistant · 4th show with you · on Mei Lin now".
2. Overall card, the most prominent thing: "Overall for Valentino SS26" Georgia 20px, "Private. Only you and the agent see this." 12px muted, 28px stars on the right. Comment textarea under it. Then an Invite back checkbox row (green tint #EEF3EE): "Invite back" bold 14px, "Alexis (agent) gets your recommendation when the show wraps." Checking it queues that recommendation for the agent role; show it in the Agent view's roster for this assistant.
3. Three small stat tiles: Models today, Avg time, Touch-ups.
4. Today's models: each row has model photo, "Name · Look 05", times, photo count if she uploaded any, an optional "Add note" link and small 14px stars (or "Rate" if unrated). A saved note shows as a white card under the row.
5. Her photos: horizontal strip of the photos this assistant uploaded, 96 by 128, captioned by look. Hide the section if none.
6. FLAG AN INCIDENT, outlined in #A33D28.
Ratings and notes stay invisible to assistants.
