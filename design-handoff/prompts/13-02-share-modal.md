# 13-02 · Share the status link (D6)

Scope: the Share status link modal in ProducerIPadView (around the old "Share status link" component) and the button that opens it. Replace the modal with D6. Use design-source/Docked-Share.dc.html as the spec.

Shell: dim rgba(0,0,0,.45). Dialog 820px wide, #F5F2EE, 18px radius, two columns: left flexible, right 280px. No header bar, no X. Closes with DONE or by tapping the dim.

Left column, padding 26px 28px, 20px gaps:
1. "Share the status link", Georgia 26px. Under it in 13px #4A4743: "For the show producer, other teams, dressing. They see numbers only, no names or photos."
2. Link field 48px, 10px radius, 1px #CFCAC4, white, ellipsis. Black COPY button beside it, which shows COPIED for 2 seconds. Use the real status URL for this show (the token StatusLinkView reads), not abc123.
3. Label "TEXT IT TO". Name input 150px, Phone number input filling the rest, SEND outlined (1px #111). All 48px, 10px radius.
4. Label "ALREADY HAS IT". Rows 52px min with bottom border: "Marco · Show producer" in 14px, "Texted 1:05 PM · opened 6 times" in 12px muted, underlined Resend on the right. Sending adds a row.
5. Footer: "The link stops working at 7:00 PM, an hour after the show." 12px muted, "Turn off now" underlined in #A33D28 (confirms first, then disables the link), DONE outlined.

Right column, #E8E4DF, padding 22px 18px: label "WHAT THEY SEE", then a 220 by 440 phone frame (6px #111 border, 22px radius) showing a mini version of the real public status page from StatusLinkView's data: show name, live dot with "updated" time, readiness donut with Ready / Show in / Not arrived, Hair, Makeup, Nails bars with counts, then "Walkthrough 4:00 · Dressing 5:00 · Show 6:00". No names or photos.
