# 05 · Studio for assistants

Screens: design-handoff/screens/5-studio-assistant/ (S1 to S7), sources Studio-Home, Look-Detail, Look-Viewer, Look-Add, Look-Camera, Look-Roll, Look-Upload, Look-Added. Replace the current StudioView for assistants.

- S1 Looks: one card per look with cover, name, model count, media summary, who is capturing it. The look card for the assistant's current model is outlined. If the assistant has capture duty, that's shown on the card line ("Capturing: you, Lena S").
- S2 Look detail: back, look name, model count, "[model] gets this look · captured by ...", a 360px media area showing the demo with play button and "1 / N", a thumbnail strip (video thumbs get a play badge, new items a NEW badge), Add Photo or Video button, then areas with notes and media counts. Empty areas are hidden.
- S3 Viewer: tapping the demo or any thumbnail opens a full-screen black viewer: close, "2 of 10", media fills the middle, video controls with scrubber, area tag, "Added by [name] · time", note, swipe between items with page dots.
- S4 Add sheet: two options, Take Photo or Video and Choose from Camera Roll.
- S5a Camera: mock a full-screen camera (use a still image), Photo/Video toggle, recording timer, Look label, last-capture thumbnail with count, Done. Use a file input with capture attribute where supported, but the mock must work without a real camera.
- S5b Camera roll: grid picker with numbered multi-select, video durations, Next (N). Use a real file input under the hood if easy, otherwise mock.
- S6 Tag: previews, "What does it show?" chips (Full look, Eyes, Brows, Skin, Cheeks, Lips) applied to all, optional note, Add N to Look A.
- S7 Added: back on the look, new items first with NEW, area counts updated, a toast with upload progress above the nav.

Acceptance: the whole loop works on the preview with mock media and the added items persist in local state.
