# 00 · Start here

Read design-handoff/README.md and design-handoff/context.md fully before doing anything.

Then:
1. Create a branch called redesign from main and push it so Vercel builds a preview. Never commit to main.
2. Read src/App.jsx, src/data/mockData.js, src/data/showLooks.js, src/components/BottomSheet.jsx, src/components/BottomNav.jsx, src/views/HomeView.jsx and src/views/StudioView.jsx so you know the current structure.
3. Reply with a short summary of the current architecture (roles, tabs, data shape, where status lives) and anything in the code that conflicts with context.md. Do not change code in this step.

Ground rules for every prompt that follows:
- Before building a screen, open its PNG in design-handoff/screens/ and its source in design-handoff/design-source/. Match layout, spacing, colors and copy from the source. Do not invent layout or content.
- Reuse existing components where they fit. Keep the existing Tailwind tokens and fonts.
- No em dashes in UI copy. Gender-neutral copy.
- Keep it front end only with mock data. Persist with whatever the app already uses.
- After each prompt: run the build, fix errors, commit with a clear message, push to redesign, and tell me what to check on the preview.
