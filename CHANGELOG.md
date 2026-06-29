# Changelog

## v2.0.1

- **Fixed missing colors on Log Groups search page** — colorization now works on search/filter results within Log Groups.
- **Accurate Background Preview** — fixed blend order and swapped manual RGBA parsing for chroma-js, giving a faithful preview of how colors render on the page.
- **Refactored content script** — split monolithic `utils.ts` into focused modules

## v2.0.0

- **Smarter word matching** — patterns now match whole words only, so "error" won't trigger on "terrorizing". Multiple match patterns per level are supported.
- **Logs Insights** — now supports multiple columns across Logs Insights tables, not just `@message`.
- **Logs Analytics page** support added.
- **New Settings UI** — organized into tabs, with dedicated controls for levels, patterns, foreground/background colors, and a JSON editor for copy/paste.
- **Performance & bundle size** — significantly smaller extension and snappier UI rendering thanks to a leaner component stack.
- **Better coloring** — fixed shade rendering, removed unnecessary background modes, improved CSS injection for multi-column tables.
- **General polish** — icons, restyling, improved URL matching, and better navigation.

## v1.0.2

- Initial Chrome extension release.
- **Colorize log rows** on CloudWatch **Log Groups** and **Log Insights** pages — highlights keywords (error, warn, info, debug) with custom colors, emojis, and labels.
- **Two coloring modes** per section: background (row highlight) or inline label (colored text + emoji).
- **Per-section toggles** — independently enable/disable colorization for Log Groups, Log Insights, and Log Tails.
- **Per-keyword toggles** — individually enable/disable each keyword.
- **Custom colors** — choose foreground and background RGBA colors per keyword via a color picker.
- **Master on/off switch** — globally disable all colorization.
- **Performance modes** — DOM observer (real-time), timer (poll every 3s), or manual (one-time button). Switchable from the Home page.
- **Shaded even rows** — alternating row background in Log Groups tables with dark mode auto-detection.
- **Settings UI** — accordion-based settings page with MUI components, color pickers, and a reset-to-defaults button.
- **Auto-hiding bottom navigation** — Home, Settings, and Tutorial pages.
- **Chrome Manifest V3** with cross-tab settings sync.
