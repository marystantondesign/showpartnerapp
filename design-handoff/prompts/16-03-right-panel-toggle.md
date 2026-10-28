# 16-03 · Right panel toggle (R2, R2b, R4, R5)

Ground rules: redesign branch only. Never commit to or merge into main, never run vercel --prod, never promote or redeploy to production. Pushing to redesign deploys to showpartnerapp-2.vercel.app on its own. No em dashes anywhere in the UI, including as an empty-value placeholder. Copy is gender-neutral (they, not she).

Scope: the right panel container on the producer iPad Home. Match the top of the panel in r2-not-arrived.png, r2b-timeline-tab.png, r4-needs-attention.png and r5-pair.png.

Right now tapping Needs attention, Not arrived or Not paired leaves the panel on the timeline and announcements. Each filter needs its own panel, and you still need to get back to the timeline quickly.

Before editing, report the line numbers of the panel state (panel === 'default' | 'arrivals' | 'to_check' | 'pairing'), DefaultPanel, and the collapse button.

1. When the filter is Not arrived, Needs attention or Not paired, the top of the right panel is a toggle bar instead of a title:
   - A segmented control (12px radius, #ECE8E3 track, 3px padding, 40px segments, selected segment white with a light shadow and 600 weight). Left segment: "Arrivals" / "Attention" / "Not paired" with a count badge (black when selected, #D9D4CE when not). Right segment: "Timeline".
   - To its right, the collapse button: 44px square, 12px radius, 1px #E0DDD8 border, white, chevron pointing right. It collapses the panel to the rail, same as today's collapse button.
2. The left segment shows that filter's panel (16-04, 16-06 and 16-07). The Timeline segment shows the default content: the Today timeline, Push walkthrough time, Announcements, and the START WALKTHROUGH / NEW ANNOUNCEMENT buttons (r2b-timeline-tab.png). The table keeps its filter either way.
3. Selecting a filter tile opens its panel on the left segment. Selecting Models or Ready shows the default panel with no toggle bar.
4. Labels stay on one line (white-space: nowrap).

Acceptance: on each of the three filters you can switch between that filter's panel and Timeline in one tap, and the chevron collapses the panel. Report changes, build, commit and push to redesign.
