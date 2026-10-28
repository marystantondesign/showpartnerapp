# 16-07 · Pairing a model with an assistant (R5, R6)

Ground rules: redesign branch only. Never commit to or merge into main, never run vercel --prod, never promote or redeploy to production. Pushing to redesign deploys to showpartnerapp-2.vercel.app on its own. No em dashes anywhere in the UI, including as an empty-value placeholder. Copy is gender-neutral (they, not she).

Scope: PairingPanel (around line 177), handlePair and the pair confirm handler. Match r5-pair.png and r6-paired.png, with design-source/Fix-R5-Pair.dc.html and Fix-R6-Paired.dc.html.

The live app still shows the old "Send to" list (every assistant, "Free" in green, a disabled SELECT AN ASSISTANT button). Replace it with this design.

Before editing, report the line numbers of PairingPanel, handlePair, and the confirm handler.

1. + PAIR (Home table cell, Arrivals panel, model modal) keeps you on Home and opens this panel on the right. It never navigates to the Assistants page. On the Not paired filter it sits under the toggle bar ("Not paired | Timeline").
2. Header: avatar, "#15 · Look A · arrived 3:44", "Pair Yuki Nakamura" in Georgia 20px, × close.
3. Only the producer's discipline:
   - "Free now · makeup": assistants with no model, longest free first, each showing only their station ("Station 4").
   - "Finishing soon": busy assistants, soonest first, with "With Amara · about 5 min · Station 7".
   - Rows are 60px radio options. The selected row gets a #F5F2EE fill and a 1.5px #111 inset ring. The longest-free assistant is preselected.
   - Then a "See all 9 makeup assistants" link.
4. Footer: "Lena gets a notification with Yuki's look and where to find them." and a black PAIR YUKI WITH LENA button, whose names follow the selection.
5. After pairing (R6):
   - If that was the last unpaired model, the Not paired tile disappears and the filter jumps back to Models (16-02). The right panel returns to the default.
   - The table shows every model in show order and scrolls so the just-paired row is in view. That row shows a green line under the name: "Paired with Lena S · Station 4 · just now".
   - A dark toast across the bottom of the left column says "Yuki Nakamura is paired with Lena Schmidt", with "Lena was notified with Yuki's look and where to find them" underneath and an UNDO button. It disappears after about 6 seconds. UNDO reverts the pairing and brings the Not paired tile back.
6. Pairing notifies the assistant (use the existing notification mock).

Acceptance: + PAIR opens this panel on Home, pairing the last unpaired model returns you to Models with the toast, and UNDO works. Report changes, build, commit and push to redesign.
