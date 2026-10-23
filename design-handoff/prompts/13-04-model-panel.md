# 13-04 · Model panel from Lineup and Home (L1, L2)

Scope: replace the thin bottom sheet that opens from Lineup, and the ModelDetailSheet that opens from Home rows on iPad, with one shared side panel. Use design-source/Model-Lineup.dc.html and Model-Home.dc.html.

Opening it:
- Lineup: tap a tile. The panel (400px) opens on the right and the grid reflows to fewer columns so every photo stays whole at 3:4. Never cover, crop or dim the grid. Selected tile gets a black ring (0 0 0 3px #F5F2EE, 0 0 0 6px #111). Tapping another tile switches the panel.
- Home: tap a model's name or row. The panel (380px) takes the right column's place (timeline and announcements) while open, and closing brings them back.
- Lineup tiles show the walk number (01, 02...) as the badge.

Panel, top to bottom:
1. 120px wide 3:4 photo, name Georgia 24px, "Look 06 · walks 6th · Look B", "Arrived 2:52", and an "0 of 3 done" bar (done, in progress, paused segments). Close button.
2. Latest update card, most prominent: left border in the status color, "LATEST · 3:38" with the status chip, and the update text with who sent it.
3. "Where she's at": Hair, Makeup, Nails rows with who and how long, plus status chip.
4. Notes: allergies as a tinted row (#F8E9E5) with "ALLERGY" in #A33D28, then other notes like "Coming from Prada".
5. Earlier updates, newest first.
6. "Past shows with you · 2" with show names, opening Show history filtered to this model.
7. Sticky footer: PING ASSISTANT outlined, UPDATE STATUS black.
Add allergies, coming-from and past-shows fields to the mock model data where missing.
