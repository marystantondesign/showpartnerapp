# 16-05 · Running late, set ETA (R3)

Ground rules: redesign branch only. Never commit to or merge into main, never run vercel --prod, never promote or redeploy to production. Pushing to redesign deploys to showpartnerapp-2.vercel.app on its own. No em dashes anywhere in the UI, including as an empty-value placeholder. Copy is gender-neutral (they, not she).

Scope: RunningLateModal (around line 357). Match the modal in r3-running-late.png and design-source/Fix-R3-RunningLate.dc.html.

1. Opens from RUNNING LATE or SET ETA in the Arrivals panel, from SET ETA on a not-arrived table row, and from SET ETA FOR BOTH (group mode).
2. Modal: 500px wide, white background, 16px radius, padding 24px 28px 28px, over a rgba(0,0,0,0.45) backdrop.
3. Header: avatar, "#09 · was due 3:55" label, "Priya Sharma is running late" in Georgia 24px, × close.
4. "New ETA": +10 min, +20 min, +30 min, Pick a time. The selected pill is black and shows the resulting time ("+20 min · 4:15").
5. "Note (optional)" field on #F5F2EE.
6. CANCEL outlined and SAVE ETA black. Saving updates the ETA everywhere (table line, Arrivals panel, Earlier updates in the model modal) and logs the note.
7. Group mode titles the group ("2 models from Prada are running late") and applies the ETA to all of them.
8. No checkbox for other models and no walkthrough warning banner.

Acceptance: setting an ETA from any entry point updates the model everywhere. Report changes, build, commit and push to redesign.
