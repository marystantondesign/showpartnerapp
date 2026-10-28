# 16-08 · Two color bugs

Ground rules: redesign branch only. Never commit to or merge into main, never run vercel --prod, never promote or redeploy to production. Pushing to redesign deploys to showpartnerapp-2.vercel.app on its own. No em dashes anywhere in the UI, including as an empty-value placeholder. Copy is gender-neutral (they, not she).

Scope: src/views/ProducerIPadView.jsx only. Confirm the line numbers below before editing.

1. Count tiles: the first tile's count is hardcoded '#fff' (around line 2369), so when another tile is selected the count is white on white. Use the normal text color when unselected and the inverse text color when selected, same as the other tiles.
2. Dark mode on Assistants: the selected filter chip (around line 1119) and selected incident-type chip (around line 1259) use TX as the background with hardcoded '#fff' text. In dark mode TX is light, so the label vanishes. Use 'var(--sp-inverse-text)'. Search for any other selected state that pairs a TX background with '#fff' text, fix those too, and list them.

Acceptance: the Models count is visible in every state, and selected chips on Assistants are readable in light and dark mode. Report changes, build, commit and push to redesign.
