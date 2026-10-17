# 09 · Arrivals and checking finished models

Screens: design-handoff/screens/3-arrivals-and-checking/, sources Arrive-Checkin, Arrive-Late, Check-iPad, Check-Lead, Check-Touchup, Check-Assistant.

Arrivals (producer iPad, uses the panel from 08):
- C1: tapping the Not arrived chip filters the table and the panel shows Arrivals: "27 of 30 here", search to check in by name or look, still-expected models sorted by ETA with notes, each with Arrived and Running Late. A "Just arrived" section shows newly arrived unpaired models with + Pair.
- C2: Running late modal: new ETA presets (+10, +20, +30, pick a time), optional note, and a red warning if the new ETA is after the walkthrough start ("They'll go straight to the walkthrough and come to makeup after."). Save new ETA.

Ready to check:
- Mark Done on an assistant's phone moves the model's service to a "To check" state (pale green chip #DCE8DD) and into a shared Ready to check queue.
- D1 producer iPad: "To check" filter chip with count, the panel lists waiting models (photo, name, look, assistant, done time) with Looks Good and Touch-up, then a Checked list.
- D2 lead assistant phone: the same queue, titled "[assistant] · [model]". Whoever checks first clears it for everyone (producer, both leads, key artist).
- D3 Touch-up sheet: where (Eyes, Brows, Skin, Lips, Other), one-line fix, Send to [assistant].
- D4 assistant phone: dark banner at the top of Working On ("Touch-up from Aimi · Eyes · time" plus the fix), status chip Touch-up. Mark Done sends it back to the queue.
- Looks Good sets the service to done and logs who checked it.

Acceptance: check in a model, pair them, mark done from the assistant, see them in the queue on the iPad and the lead's phone, send a touch-up, see it on the assistant's phone, mark done again, approve.
