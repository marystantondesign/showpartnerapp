# 16-01 · Tapping a model on Home opens the model modal (R1), and fixes the white screen

Ground rules: redesign branch only. Never commit to or merge into main, never run vercel --prod, never promote or redeploy to production. Pushing to redesign deploys to showpartnerapp-2.vercel.app on its own. No em dashes in any copy. Copy is gender-neutral (they, not she).

Scope: src/views/ProducerIPadView.jsx (Home rows) and whatever component you create for the modal. Match screens/16-home-fixes/r1-model-modal.png and design-source/Fix-R1-ModelModal.dc.html exactly. Don't touch the Lineup side panel's behavior.

The bug: tapping any model row on Home (for example Sofia Andersen) turns the whole screen white. Home rows open the old src/components/ModelDetailSheet.jsx (rendered near line 2488). It reads model.assignedArtists and model.statusLog, which the redesign model data no longer has (status now lives in model.services), so it throws at about line 320 and React unmounts the app.

Step 1: copy the six PNGs into design-handoff/screens/16-home-fixes/ and the six .dc.html files into design-handoff/design-source/. List them back to me. Open r1-model-modal.png and Fix-R1-ModelModal.dc.html before coding.
Step 2: before editing, report the file and line numbers for: the Home row onClick, where ModelDetailSheet is rendered, the Lineup model panel inside IPadLineupSection, and where services, notes and past shows live in src/data/mockData.js.

1. Stop using ModelDetailSheet on the iPad producer view. Tapping any Home row opens the new model modal instead. Every model must open without errors, including unpaired and not-arrived models.
2. Modal: 940 x 640, 18px radius, #F5F2EE, centered over a rgba(0,0,0,0.45) backdrop. Tapping the backdrop, the × or Escape closes it. Same size as the Show history modal.
3. Left column (320px, white, 1px #E0DDD8 right border, 24px padding), top to bottom:
   - Two cards side by side, square 12px-radius photos. Left: model name (Georgia 20px), "Model", "#06 · Look B". Right: the producer's-discipline assistant paired with this model, with their photo, name, "Assistant", "Station 9". If unpaired, show a + PAIR button in that slot (opens the pairing panel from 16-05).
   - "Where they're at": one row per discipline, producer's discipline first (Makeup, Hair, Nails for a makeup producer). Each row: discipline, "assistant · time so far" or "paused at 3:38" or "Bianca R is up next", and the status chip.
   - "Earlier updates" with 12px of extra space above it: time and text, newest first.
   - "Past shows with you · 2" card at the bottom, opening Show history filtered to this model.
4. Right column: a header row with "0 of 3 done · makeup in progress, hair paused" and the × button. Then the Latest card (time, status chip, the update text and who sent it). Then Notes, full width: the label, allergy rows tinted #F8E9E5 with ALLERGY in #A33D28, other notes as white cards, then an outlined "+ ADD A NOTE" button (44px tall) that adds a note. Sticky footer: PING ASSISTANT outlined on the left, UPDATE STATUS black on the right.
5. Add station to assistant profiles and any missing allergy, notes, coming-from and past-shows fields to the mock data, so every model fills the modal.
6. Dark mode uses the existing variables (card #242220, borders and text from the variables).

Acceptance: tapping every row on Home opens the modal and never blanks the screen. Report file names and line numbers changed, run the build, commit and push to redesign.
