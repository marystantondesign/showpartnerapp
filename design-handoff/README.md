# Show Partner redesign: handoff for Claude Code

Repo: github.com/marystantondesign/showpartnerapp (React + Vite + Tailwind, mock data, no backend).
Live link: showpartnerapp.vercel.app. Do not touch main. Work on a branch called redesign so Vercel gives it its own preview URL.

## How to use this folder

1. Put this folder in the repo root as design-handoff/ (add it to the commit so it travels with the branch).
2. Give Claude Code prompts/00-start-here.md first. It sets up the branch and reads the context.
3. Then run the prompts in order, one at a time. Review the Vercel preview after each before moving on.

| Prompt | What it builds |
|---|---|
| 00-start-here | Branch, context, ground rules |
| 01-p0-fixes | Bottom sheet scroll and swipe-to-dismiss |
| 02-data-model | Per-service status, pairing, timeline, announcements, looks |
| 03-producer-ipad | Producer one-screen iPad view, pairing, announcements, walkthrough |
| 04-assistant-phone | Assistant home, working on, lead check, walkthrough states |
| 05-studio-assistant | Studio: looks, look detail, viewer, capture and upload |
| 06-studio-authoring | Studio: set up looks, write areas, inventory products, assign looks |
| 07-status-link | Read-only show status page for the overall producer |

## What's in here

- context.md: personas, decisions, glossary, what not to build, open questions
- screens/: 2x PNG renders of every approved screen, grouped by flow (see screens/INDEX.md)
- design-source/: the HTML source of each screen, for exact spacing, colors and copy
- parked/: the hand-off flow. Keep the small Hand Off button, but do not build this flow yet.
