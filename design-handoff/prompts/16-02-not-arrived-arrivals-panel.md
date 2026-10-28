# 16-02 · Not arrived filter opens the Arrivals panel (R2)

Ground rules: redesign branch only. Never commit to or merge into main, never run vercel --prod, never promote or redeploy to production. Pushing to redesign deploys to showpartnerapp-2.vercel.app on its own. No em dashes in any copy. Copy is gender-neutral (they, not she).

Scope: the Home count tiles, the Home table rows, and ArrivalsPanel in src/views/ProducerIPadView.jsx (around line 289). Match screens/16-home-fixes/r2-not-arrived.png and design-source/Fix-R2-NotArrived.dc.html.

Before editing, report the file and line numbers for the count tiles' onClick, ArrivalsPanel, and where model eta and arrival are stored.

1. Tapping the "Not arrived" tile filters the table to models who haven't arrived AND switches the right panel to the Arrivals panel. Tapping any other tile returns the right panel to the default (timeline and announcements).
2. Table rows for not-arrived models: the line under the name is red, "Not arrived · ETA 3:55 · from Prada" (or "Not arrived · no ETA"). Add a "SET ETA" outlined pill (32px, 1px #111 border, white) beside the name. Tapping it, or the row, opens the Running late modal (16-03).
3. Arrivals panel (340px, white): "Arrivals" with "27 of 30 here", then a check-in search field ("Check in by name or #").
   - Group still-expected models by where they're coming from: "From Prada · 2" with a "SET ETA FOR BOTH" pill that opens the Running late modal for the whole group. Then "No ETA · 1".
   - Each model: avatar, name, "#09 · ETA 3:55", then two buttons: ARRIVED and RUNNING LATE (SET ETA when there's no ETA yet).
   - "Just arrived": recently checked-in models, with + PAIR for anyone not paired.
4. Button styles, important: the ARRIVED buttons are NOT black. Use the R2 panel style: #F5F2EE fill, no border, #111 text, 600 weight, 44px tall, pill. RUNNING LATE and SET ETA are outlined (1px #CFCAC4). The background of r3-running-late.png still shows black ARRIVED buttons. Ignore that and follow R2.
5. ARRIVED marks the model arrived with the current time, moves them to Just arrived, and updates every count (ring, tiles, table).
6. Add a comingFrom field to the mock data for not-arrived models so the grouping works.

Acceptance: Not arrived filters the table and shows the Arrivals panel, and ARRIVED buttons match R2. Report changes, build, commit and push to redesign.
