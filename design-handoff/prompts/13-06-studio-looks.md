# 13-06 · Studio looks (S1 to S5)

Scope: the iPad Studio section. The current version does not match D5, and Share / Request approval only flip a local flag. Rebuild it to S1 to S5 using design-source/Look-*.dc.html, and wire it to the same looks data and approval flow the phone Studio uses (key artist approves, then the look is shared).

Layout: "Studio · Makeup · 3 looks · 30 models" with a Looks / Inventory / Receipts switch. Looks list on the left (280px): thumbnail, models, media, state line (Shared with the team in #3F6B45, Waiting on Yadim in #8A6516, Draft muted), + Add a look. Selected look on the right in a white card.

States (the status bar under the title always says who can see it):
- S1 Shared: "Approved by Yadim at 1:40 · Shared with Aimi K (lead assistant) and 14 assistants on Look A · 11 opened", with See who (list of who opened). Buttons: EDIT LOOK and a ⋯ menu (S1b) holding Duplicate look, Assign models, and Unshare from the team in red. Unshare is never a main button.
- S2 Waiting: "Sent to Yadim for approval at 3:12 · Not opened yet. Only you and Yadim can see it." Buttons: CANCEL REQUEST (red outline), EDIT LOOK.
- S3 Draft: "Draft · Only you can see this. 2 of 5 areas written." Buttons: EDIT LOOK, SEND TO YADIM (black).
Each look shows the demo media and photo strip, then By area rows: area, how-to text, product chips (generic ones tagged GENERIC), reference count.

Editing (S4) and adding (S5):
- Name field, models with Change / Assign models, Add the demo drop area (new looks), area tabs, How to do it textarea.
- Products: search field with results dropdown. First result is always a generic option ("Basic mascara · Generic · any black mascara in the kit"), then brand products, then "Add “query” as a new product". Selected products become removable chips.
- References: real photo and video upload (camera roll and camera), thumbnails with captions and upload progress, plus Paste a link.
- CANCEL and SAVE DRAFT.
Fill all three looks with the content in the source files (areas, products, references).
Inventory and Receipts: reuse the phone Studio content full width. Don't design new layouts.
