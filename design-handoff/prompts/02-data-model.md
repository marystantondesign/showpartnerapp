# 02 · Data model

Update src/data/mockData.js (and showLooks.js) so the new screens have real data to render. Keep existing exports working or update their callers.

Add or change:
- Roles: add lead_assistant (two of them: Aimi K and Iona). Producer stays role lead (Jen Zambrano). Key artist stays artist (rename the makeup artist to Yadim for the mock).
- Per-service status on each model: services.hair, services.makeup, services.nails, each { status, assistantId, startedAt, pausedAt, elapsedMins }. Statuses: not_started, in_progress, paused, done. Keep a separate flagged boolean for the producer's flag (shown as Revisit on the producer table only).
- Model arrival: arrived (bool), arrivedAt, eta, plus look ('A' | 'B' | 'C' | null).
- Assistant availability derived from pairing: free since time, or finishing in about N minutes. Used to sort the pairing list: free longest first, then soonest to finish.
- Show timeline: [{ id: 'demo', time, label }, { id: 'walkthrough', ... }, { id: 'models_back' }, { id: 'dressing' }, { id: 'show' }] with editable walkthrough time and a walkthroughState: 'upcoming' | 'in_progress' | 'done'.
- Announcements: { id, text, to: 'all_assistants' | 'lead_assistants' | 'artist' | [ids], sentAt, scheduled (bool), sendAt, acks: { got: [ids], unopened: [ids], undelivered: [ids] } }. Seed the 30 and 15 minute walkthrough warnings.
- Looks: [{ id: 'A', name, demo: media, media: [{ id, type: 'photo' | 'video', src, durationSec, area, note, addedBy, addedAt }], areas: [{ id, name, notes, productIds, referenceMediaIds, updatedAt, updatedBy }], capturers: [assistantIds] }].
- Inventory: [{ id, name, category, shade, swatch hex, stock, specialty (bool), holder }].

Use the numbers in the screens so mock data matches them: 30 models, 8 fully ready, hair 14 done / 9 in progress / 2 paused, makeup 17 done / 8 in progress, nails 9 done / 6 in progress, 3 not arrived, 26 assistants. Use the real seed photos already in public/.

Acceptance: the app still builds and existing views still render (they will be replaced in later prompts).
