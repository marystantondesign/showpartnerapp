# 10 · Key artist phone

Screens: design-handoff/screens/6-key-artist/ (K1 to K5), sources Artist-*.dc.html. Role artist (Yadim). Nav is only Home, Studio, Settings.

- K1 Notification: when a lead taps "Ask [artist] for a second opinion", the artist gets a notification: "Second opinion: [assistant] · [model]", "[lead] is asking about [look] [area]", with On my way and "[lead], your call". Use the Notification API if permission is granted, otherwise an in-app banner. Mock it if needed.
- K2 Home: the same request as a dark card (On my way, [lead], your call), then three quick numbers (makeup done, to check, time to dressing), then Earlier.
- K3 At the station: after On my way, a large model photo, model, look, assistant, the lead's note, Looks Good, Touch-up (same sheet as prompt 09) and Open [look]. A line confirms the lead and assistant know the artist is coming. "[lead], your call" sends the decision back to the lead.
- K4 Approve a look: looks written by a lead show as "Waiting on you" with each area and who wrote it. Approve · Share with assistants, or Suggest a change (back to the lead).
- K5 Write a look: same editor as A2 but for the artist. Share with assistants goes straight out with no approval step.

Acceptance: from the lead's phone, escalate a lead check, see it on the artist's phone, tap On my way, approve the model. A lead-written look waits for the artist; an artist-written look goes straight to assistants.
