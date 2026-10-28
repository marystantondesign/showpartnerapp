# 16-04 · Needs attention and Waiting for review (R4)

Ground rules: redesign branch only. Never commit to or merge into main, never run vercel --prod, never promote or redeploy to production. Pushing to redesign deploys to showpartnerapp-2.vercel.app on its own. No em dashes in any copy. Copy is gender-neutral (they, not she).

Scope: the Needs attention tile, the Home table for that filter, and the right panel (replace ToCheckPanel, around line 429). Match screens/16-home-fixes/r4-needs-attention.png and design-source/Fix-R4-NeedsAttention.dc.html.

The logic, read this first: the producer can't sign off on a makeup look. Only the key artist or a lead assistant can. When an assistant finishes and asks for review, the app pings the artist and the lead assistants directly. The producer only needs to see that a review was requested and how long ago, so they can go find someone if it's taking too long. So there are no LOOKS GOOD or TOUCH-UP buttons for the producer, and no "To check" status anywhere.

Before editing, report the line numbers of the tiles, ToCheckPanel, handleLooksGood and handleSendTouchup, and anything that renders a "To check" status.

1. Needs attention counts two things: flagged models (flagged by a producer, or paused a long time) and models whose service is waiting for review. The tile count is the total (5 here).
2. Tapping the tile filters the table to those models and switches the right panel to Waiting for review. Other tiles return the default panel.
3. Table: the status chip stays DONE for a service waiting for review. The red or gray line under the name says why: "Flagged by Jen · makeup needs a redo", "Paused 22 min · waiting on lashes", "Makeup done 3:41 · waiting for review".
4. Right panel "Waiting for review" with the count. One white card per request: avatar, name, "#06 · MU: Sofia R · Pinged @ 3:41" (MU, HA or NA for the discipline), then two buttons: PING ARTIST (black) and PING LEAD ASSISTANT (outlined). Each sends that person a reminder ping about this model. Oldest request first.
5. Below that, "Flagged" with the count of items actually listed, then one row per flagged model (avatar, name, reason in red, chevron) that opens the model modal from 16-01. Note: the design label says "Flagged · 2" but lists only Cassidy Martin. Make the label always match the list.
6. Footer copy: "Producer, lead assistants and the artist see this list."
7. Remove the "To check" status and any producer-side Looks good or Touch-up actions from the iPad producer view. Leave the assistant and lead assistant flows alone.
8. Add reviewRequestedAt to the mock services so three models are waiting.

Acceptance: Needs attention shows flagged and waiting-for-review models with the review panel, and the producer can only ping, not approve. Report changes, build, commit and push to redesign.
