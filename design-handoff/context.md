# Context for Claude Code

## What Show Partner is
A coordination app for backstage beauty teams at fashion shows. The client is Jen Zambrano, a makeup producer. Research: one producer interview, one agent interview, two artist interviews, and one in-person show observation (Sep 13).

## Personas and devices
| Persona | Code role today | Device | What the app does for them |
|---|---|---|---|
| Producer (Jen) | lead | iPad, landscape, fixed spot | Whole picture at a glance, pairs arriving models with free assistants, sends announcements, runs the walkthrough pause |
| Key Artist (Yadim) | artist | Phone, rarely | Gets pinged to a specific assistant and model, writes and approves looks |
| Lead Assistant (Aimi, Iona) | none yet, add lead_assistant | Phone, while working | Answers lead checks, escalates to the artist, sets up looks in Studio |
| Assistant | assistant | Phone, hands busy | Sees the model they're on and the assigned look, marks done, asks for a lead check, captures demo media |
| Overall show producer, dressing team | none | Any phone, via link | Read-only status numbers, no model names |

## Decisions (from Mary's feedback)
- Assistants do NOT claim models. Jen pairs a model with whichever assistant is free. The assistant's phone updates on its own.
- Status is per service: hair, makeup, nails each have their own status. A producer only controls her own service. Other services are read-only.
- Assistant actions: Mark Done, Pause, Lead Check. Hand Off is a small, rare action. Needs Revisit is removed from assistant actions.
- Mark Done notifies the producer, the lead assistants and the key artist.
- Lead Check pings both lead assistants. Whoever taps I'll Go first takes it. A lead can escalate to the key artist with assistant name plus model name (no station numbers).
- No station or table numbers anywhere. Seating is unordered pop-up tables.
- The pre-show pull is called the walkthrough (not rehearsal). It is an event on the day's timeline with an editable time.
- Walkthrough warnings (30, 15, 5 minutes) are scheduled announcements that send automatically. One response only: Got it.
- Start Walkthrough is different from an announcement: it pauses every in-progress service for the producer's team, stamps the time, switches the countdown to Models Back, and sends the notice. Models Are Back resumes everything.
- Lists show model name first, then look number, because assistants and models know each other by name.
- Copy is gender neutral. Models are not always women.
- No em dashes in UI copy.
- Looks: a show can have 1 to 4 makeup looks. Each look has a demo video, photos, clips, and notes by area (eyes, brows, skin, cheeks, lips, plus custom areas). Each area can link specific products from inventory.
- Anyone can add photos or videos to a look, but specific assistants are given capture duty per look so it doesn't get messy.
- The key artist or a lead assistant sets up looks and decides which model gets which look. When a look changes, assistants see a banner with what changed.
- Show status link: aggregate numbers only, refreshable, expires when the show ends.
- Arrivals: the producer checks models in from the iPad (Arrived or Running late with a new ETA and note). If a new ETA lands after the walkthrough starts, warn that the model goes straight to the walkthrough.
- After Mark Done, the model goes into a shared "Ready to check" list seen by the producer, the lead assistants and the key artist. Whoever checks first clears it for everyone. Looks Good, or Touch-up (area plus a one-line fix) which goes back to the same assistant as a banner on their Working On screen.
- The key artist barely uses the app. Their nav is Home, Studio, Settings. Most interaction is a lock-screen notification with On my way or "[Lead], your call".
- Looks written by a lead assistant go to the key artist to approve before assistants see them. Looks written by the key artist go straight to assistants.
- iPad layout: landscape uses a right panel the producer can drag wider or collapse to a rail. Portrait uses a bottom drawer with two stops. See prompt 08.

## Visual system (keep the app's existing language)
Greige background #F5F2EE, borders #E0DDD8, text #111, secondary text #4A4743 and #6E6A64. Georgia for names and headings, Inter for UI. Status colors: not started #E8E4DF, in progress #D4A853, paused #8A9BB0, done #7A9E7E, flagged #C4614A. Line icons, no emoji. Touch targets 44px minimum except the deliberate small Hand Off button.

## Do not build yet
- The hand-off flow (parked/)
- Real backend, real notifications, real camera access. Mock these convincingly in the UI with local state.

## Open questions for Jen (do not block on these, build the current design)
- Who hands out capture duty, Jen or the lead assistants?
- Do uploads appear for everyone right away, or does a lead or the artist approve them first?
- Who assigns models to looks, and when?
- Would a seat order on arrival help new assistants?
- Should Fully Ready count once all services are done, or only after a check?
- Does the key artist actually approve looks a lead writes, or should those go straight out too?
