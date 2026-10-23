# 13-01 · Menu sizing and focus

Scope: the menu button and docked menu column in src/views/ProducerIPadView.jsx. Match design-handoff M3, M4 and any D screen.

1. Menu button: 44px tall, 12px radius, 1px #111 border, 18px icon, padding 0 14px 0 12px. Closed: white, three-line icon. Open: #111, white X. Not a large square.
2. Menu column: 96px wide, background #ECE8E3, 1px right border #E0DDD8, padding 12px 0, items centered with 4px gap.
3. Items: 76px wide, min 64px tall, 14px radius, 22px icon over the label with 6px gap. Label Inter 11px, sentence case (Home, Assistants, Lineup, Studio, Settings), no uppercase, no letter spacing. Active: #111 tile inset in the column, aria-current="page", not a full-width strip.
4. Top bar Status Link button label is "STATUS LINK", with the link icon.
5. Apply the focus rule from 13-00.
6. A round dark floating button appears at the right edge on Lineup and Studio, covering content. Tell me what it is and where it comes from before changing it. If it is a dev or feedback tool, hide it from this view.

Acceptance: every section shows the 96px menu with rounded tiles, the 44px button, and no blue rings.
