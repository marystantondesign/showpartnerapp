# 16-03 · Running late, set ETA (R3)

Ground rules: redesign branch only. Never commit to or merge into main, never run vercel --prod, never promote or redeploy to production. Pushing to redesign deploys to showpartnerapp-2.vercel.app on its own. No em dashes in any copy. Copy is gender-neutral (they, not she).

Scope: RunningLateModal in src/views/ProducerIPadView.jsx (around line 357). Match the modal in screens/16-home-fixes/r3-running-late.png and design-source/Fix-R3-RunningLate.dc.html. Ignore the screen behind the modal; 16-02 defines it, and its ARRIVED buttons are not black.

Before editing, report the line numbers of RunningLateModal and where onRunningLate saves the new ETA.

1. Opens from RUNNING LATE or SET ETA in the Arrivals panel, from SET ETA on a not-arrived table row, and from SET ETA FOR BOTH (group mode).
2. Modal: 500px wide, white (#fff) background, 16px radius, padding 24px 28px 28px, over the same 0.45 backdrop.
3. Header: model avatar, "#09 · was due 3:55" label, "Priya Sharma is running late" in Georgia 24px, × close.
4. "New ETA": +10 min, +20 min, +30 min, Pick a time. The selected pill is black and shows the resulting time ("+20 min · 4:15"). Pick a time opens a time picker.
5. "Note (optional)" text field on #F5F2EE.
6. Buttons: CANCEL outlined, SAVE ETA black (1 : 1.6 widths). Saving updates the model's ETA everywhere (table line, Arrivals panel, Earlier updates in the model modal) and logs the note.
7. In group mode the title names the group ("2 models from Prada are running late") and saving applies the ETA to everyone in it.
8. No checkbox for other models and no walkthrough warning banner. Both were removed from this design.

Acceptance: setting an ETA from any entry point updates the model everywhere. Report changes, build, commit and push to redesign.
