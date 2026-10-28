# 16-01 · Model modal from Home (R1)

Ground rules: redesign branch only. Never commit to or merge into main, never run vercel --prod, never promote or redeploy to production. Pushing to redesign deploys to showpartnerapp-2.vercel.app on its own. No em dashes anywhere in the UI, including as an empty-value placeholder. Copy is gender-neutral (they, not she).

Scope: src/views/ProducerIPadView.jsx and the model modal component. Match screens/16-home-fixes/r1-model-modal.png and design-source/Fix-R1-ModelModal.dc.html.

Step 1: copy the eight PNGs into design-handoff/screens/16-home-fixes/ and the eight .dc.html files into design-handoff/design-source/, replacing any older copies with the same names. List them back to me. Open r1-model-modal.png and Fix-R1-ModelModal.dc.html before coding.
Step 2: before editing, report the file and line numbers of the modal component, its left and right columns, the "Where they're at" rows, and the Latest card.

1. Tapping any model row on Home opens this modal. It must never blank the screen (the old ModelDetailSheet must not be used on the iPad producer view).
2. Column widths: the modal stays 940 x 640. The left column is now 460px and the right column takes the rest. The left column must never scroll as a whole.
3. Left column, top to bottom:
   - Two cards side by side: model (photo, name, "Model", "#06 · Look B") and the producer's-discipline assistant paired with them (photo, name, "Assistant", "Station 9"). Photos are 128px tall, full card width, 12px radius, object-fit cover. Names are Georgia 22px on one line.
   - If the model has no assistant for the producer's discipline, that card shows a + PAIR button (opens the pairing panel from 16-07).
   - "Where they're at": one 40px row per discipline, producer's discipline first. When nobody is assigned, show "Not paired", never an em dash.
   - "Earlier updates" with 12px of space above it. If the list is long, only this list scrolls.
   - "Past shows with you · N" card pinned at the bottom.
4. Right column: header "3 of 3 done · all done" (or the in-progress summary) with the × button, then the Latest card, then Notes with allergy rows and the outlined + ADD A NOTE button, then the sticky PING ASSISTANT / UPDATE STATUS footer.
5. Bug: the Latest card's chip and text come from different updates (Sofia Andersen shows a "Nails done" chip over "Nails started · Nadia F."). The chip and the text must both describe the same, most recent update.

Acceptance: a model with a long name (Natasha Ivanova, Sofia Andersen) fits on one line, the left column never scrolls as a whole, and the Latest chip matches its text. Report changes, build, commit and push to redesign.
