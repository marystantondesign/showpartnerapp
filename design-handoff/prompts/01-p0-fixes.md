# 01 · P0 fixes: bottom sheet

Fix src/components/BottomSheet.jsx. These are bugs, not design changes. Keep the current look.

1. Tablet modal can't scroll: the modal is a flex column with only a max height, and the scroll area is flex-1 without min-h-0, so it never shrinks. Add min-h-0 to the scroll child. Any primary action (for example SEND PING in ModelPicker.jsx) must sit in a pinned footer outside the scroll area, not inside it.
2. Mobile sheet can't be dismissed by swiping: the drag handle is decorative. Add swipe-down-to-dismiss on the handle and the header area (touch and pointer events, follow the finger, dismiss past about 25 percent of the sheet height or on a fast downward flick, otherwise snap back). Do not hijack scrolling inside the content.
3. Make the dimmed area above the sheet a generous tap-to-close target (it is the single-tap alternative to the swipe, required for accessibility). No close button needed on mobile.

Acceptance: on an iPad-size viewport a long model list scrolls and the footer button stays visible. On a phone-size viewport the sheet follows a downward drag, dismisses past the threshold, snaps back otherwise, and tapping the dim area closes it.
