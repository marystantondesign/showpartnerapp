# 16-06 · Needs attention and Waiting for review (R4)

Ground rules: redesign branch only. Never commit to or merge into main, never run vercel --prod, never promote or redeploy to production. Pushing to redesign deploys to showpartnerapp-2.vercel.app on its own. No em dashes anywhere in the UI, including as an empty-value placeholder. Copy is gender-neutral (they, not she).

Scope: the Needs attention table rows and its panel (replace ToCheckPanel, around line 429). Match r4-needs-attention.png and design-source/Fix-R4-NeedsAttention.dc.html.

The logic, read this first: the producer can't sign off on a makeup look. Only the key artist or a lead assistant can. When an assistant finishes and asks for review, the app pings the artist and the lead assistants directly. The producer only needs to see that a review was requested and how long ago, so they can go find someone. So the producer gets no LOOKS GOOD or TOUCH-UP buttons, and there is no "To check" status anywhere.

Before editing, report the line numbers of ToCheckPanel, handleLooksGood, handleSendTouchup, and anything that renders "To check".

1. Needs attention counts flagged models plus models with a service waiting for review. The table lists them in show-number order (01, 04, 06, 11, 13). The status chip stays DONE for a service waiting for review. The line under the name says why: "Flagged by Jen · makeup needs a redo", "Paused 22 min · waiting on lashes", "Makeup done 3:41 · waiting for review".
2. Panel content under the toggle bar ("Attention" segment):
   - "Waiting for review · 3", then one white card per request, oldest first: avatar, name, "#06 · MU: Sofia R · Pinged @ 3:41" (MU, HA or NA by discipline), then PING ARTIST (black) and PING LEAD ASSISTANT (outlined). Each sends that person a reminder ping about this model.
   - "Flagged · N" where N always equals the number of rows listed. One row per flagged model (avatar, name, reason in red, chevron) that opens the model modal.
   - Footer: "Producer, lead assistants and the artist see this list."
3. Remove "To check" and any producer-side Looks good / Touch-up actions from the iPad producer view. Leave the assistant and lead assistant flows alone.
4. Add reviewRequestedAt to the mock services so three models are waiting.

Acceptance: Needs attention shows flagged and waiting-for-review models in show order, and the producer can only ping, not approve. Report changes, build, commit and push to redesign.
