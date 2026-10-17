# 04 · Assistant and lead assistant on phone

Screens: design-handoff/screens/2-assistant-phone/ and 3-walkthrough-phone/, sources Claim-Now, Claim-Active, Claim-Pick, Ping-Received, Ping-Tracker.

Assistant Home tab replaces the current model list for role assistant:
- Header row: service, show countdown. A dark walkthrough strip when the walkthrough is upcoming ("Walkthrough at 4:00 PM · in 15 min").
- Waiting state: "Waiting for your next model". Below it, "You finished today" listing model name first, then look number, with a Done time chip.
- Working on state (appears automatically when the producer pairs a model): photo, "Now working on · Look 06", name, service status chip and elapsed minutes, a row linking to the assigned look in Studio, a big Mark [service] Done button with the line "Lets Jen, the lead assistants and key artist know your model is ready", then Pause and Lead Check side by side, then a full-width skinny Hand Off button (24px tall, low emphasis, opens nothing yet). Below: the model's other services, read only.
- Mark done: sets status done, records time, creates a notification for producer, lead assistants and artist.
- Lead check: creates a request to both lead assistants.

Lead assistant Home (role lead_assistant): incoming Lead check card (assistant name · model name, look, elapsed), I'll Go and Ask [artist] for a second opinion. First tap claims it and clears it for the other lead. "Other checks" list and "Your model" row below. No explanation text, no station numbers.

Walkthrough on phones:
- Warning: when a scheduled warning sends, show the dark card over the Working On screen: sender line, "Walkthrough in 15 minutes", "At 4:00, the work must pause for the walkthrough. Models should be back around 4:30.", one Got It button (records the ack).
- During: when the producer starts the walkthrough, Home shows the dark "Models are at the walkthrough" card with "Enjoy your break" copy from the source, the model card shows "Paused at N min", and a Coming up list. When the producer taps Models Are Back, the working on state returns and resumes timing.

Acceptance: on a 390x844 viewport, switching profiles shows each state; pairing from the iPad view updates the assistant; Got It updates the producer's ack counts.
