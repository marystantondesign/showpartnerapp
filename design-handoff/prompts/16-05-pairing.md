# 16-05 · Pairing a model with an assistant (R5, R6)

Ground rules: redesign branch only. Never commit to or merge into main, never run vercel --prod, never promote or redeploy to production. Pushing to redesign deploys to showpartnerapp-2.vercel.app on its own. No em dashes in any copy. Copy is gender-neutral (they, not she).

Scope: PairingPanel in src/views/ProducerIPadView.jsx (around line 177) and handlePair. Match screens/16-home-fixes/r5-pair.png and r6-paired.png, with design-source/Fix-R5-Pair.dc.html and Fix-R6-Paired.dc.html.

Before editing, report the line numbers of PairingPanel, handlePair, and the confirm handler around line 2127.

1. Tapping + PAIR anywhere (Home table cell, Arrivals panel, model modal) keeps you on Home and opens the pairing panel on the right. It never navigates to the Assistants page.
2. Panel header: avatar, "#15 · Look A · arrived 3:44", "Pair Yuki Nakamura" in Georgia 20px, × close.
3. Only the producer's discipline. "Free now · makeup": assistants with no model, longest free first, each row showing name and only their station ("Station 4"). "Finishing soon": busy assistants, soonest first, with "With Amara · about 5 min · Station 7". Rows are radio options, 60px tall, and the selected one gets a #F5F2EE fill and 1.5px #111 inset ring. The longest-free assistant is preselected. Then a "See all 9 makeup assistants" link.
4. Footer: "Lena gets a notification with Yuki's look and where to find them." and a black PAIR YUKI WITH LENA button whose names update with the selection.
5. After pairing (R6): the panel closes back to the default panel, the Not paired count drops (0 here), and the model's row stays in view with a green line "Paired with Lena S · Station 4 · just now". A dark toast across the bottom of the left column says "Yuki Nakamura is paired with Lena Schmidt" over "Lena was notified with Yuki's look and where to find them", with an UNDO button. It disappears after about 6 seconds. UNDO reverts the pairing.
6. Pairing notifies the assistant (use the existing notification mock).

Acceptance: + PAIR opens this panel on Home, pairing updates all counts, and the toast shows with a working UNDO. Report changes, build, commit and push to redesign.
