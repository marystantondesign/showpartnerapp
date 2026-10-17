# 06 · Studio authoring (key artist or lead assistant)

Screens: design-handoff/screens/6-studio-authoring/ (A1 to A5 plus A3b), sources Author-Looks, Author-Look, Author-Area, Author-Inventory, Author-Assign, Author-Changed. Only roles artist and lead_assistant see these entry points.

- A1 Set up looks: "How many makeup looks today?" segmented 1 to 4, name each look (optional nickname), Next: Write Look A.
- A2 Write a look: link to captured media, Areas list showing written notes or "No notes yet" in red, "+ Add an area", a row for "Models getting Look A" (opens A4), Share With Assistants (empty areas stay hidden).
- A3 Write one area: notes textarea with a dictation mic button (use the Web Speech API if available, otherwise hide the mic), Products from inventory (swatch, product, shade, stock line, remove), "+ Add from inventory", References grid from the look's media with checkboxes, items already tagged with this area suggested first. Save.
- A3b Inventory picker sheet: search, category chips, rows with swatch, name, shade, stock (out of stock in red, specialty items say who holds them), checkboxes, Add N to [area].
- A4 Who gets which look: filter chips with counts including "Not set" in red, each model row with an A / B / C segmented toggle. Saving updates each assistant's Working On screen.
- A5 When a look changes after sharing, assistants see a dark banner on that look ("Look A updated · time", who changed which area and how, See what changed) and the area shows its updated time.

Acceptance: an artist or lead can create looks, write areas with products and references, assign models, and an assistant sees the result and the change banner.
