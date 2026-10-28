# 16-04 · Not arrived and the Arrivals panel (R2)

Ground rules: redesign branch only. Never commit to or merge into main, never run vercel --prod, never promote or redeploy to production. Pushing to redesign deploys to showpartnerapp-2.vercel.app on its own. No em dashes anywhere in the UI, including as an empty-value placeholder. Copy is gender-neutral (they, not she).

Scope: the Not arrived table rows and ArrivalsPanel (around line 289). Match r2-not-arrived.png and design-source/Fix-R2-NotArrived.dc.html.

Before editing, report the line numbers of ArrivalsPanel and where eta, arrivedAt and comingFrom live in the mock data.

1. Table rows for not-arrived models, in show-number order: a red line under the name, "Not arrived · ETA 3:55 · from Prada" or "Not arrived · no ETA", and an outlined "SET ETA" pill (32px, 1px #111 border, white) next to the name. Tapping the pill or the row opens the Running late modal (16-05).
2. Arrivals panel content under the toggle bar: "Check in" label with "27 of 30 here", then the check-in search field ("Check in by name or #").
   - Still-expected models grouped by where they're coming from: "From Prada · 2" with a "SET ETA FOR BOTH" pill. Then "No ETA · 1".
   - Each model: avatar, name, "#09 · ETA 3:55", then ARRIVED and RUNNING LATE (SET ETA when there's no ETA).
   - "Just arrived": recently checked-in models, with + PAIR for anyone unpaired.
3. Button styles: ARRIVED is NOT black. It has a #F5F2EE fill, no border, #111 text, 600 weight, is 44px tall and pill-shaped. RUNNING LATE and SET ETA are outlined (1px #CFCAC4).
4. ARRIVED marks the model arrived with the current time, moves them to Just arrived, and updates every count. When the last model arrives, the Not arrived tile disappears (16-02).
5. Add comingFrom to the mock data for not-arrived models.

Acceptance: Not arrived lists models in show order, the panel matches R2, and ARRIVED buttons are not black. Report changes, build, commit and push to redesign.
