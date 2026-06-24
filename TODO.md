# TODO

## Features
- [ ] Add new log levels per section (level name, patterns, colors, emoji)
- [ ] Add/remove patterns per level
- [ ] Add/remove page sections (Log Groups, Log Insights, Log Tails)
- [ ] Import JSON config from clipboard with validation
- [ ] Drag-and-drop reorder levels within a section
- [ ] Search/filter levels across all sections
- [ ] Custom ANSI color codes per level
- [ ] Per-level regex toggle in the UI
- [ ] Keyboard shortcuts for common actions

## UI/UX
- [ ] Toast/notification system for config changes (save feedback)
- [ ] Confirmation dialogs for destructive actions (reset, delete level)
- [ ] Color preset swatches in the color picker for quick selection
- [ ] Loading/ saving indicator when writing to chrome.storage
- [ ] Better responsive layout for the 350×400 popup constraint
- [ ] Keyboard navigation and focus management in accordions
- [ ] Show a preview of how log lines will look

## Bugs
- [ ] State mutation in ControlledAccordions — `let tempSettings = settings` mutates the original object
- [ ] `disabledAccordions` initial state — useEffect captures stale closure on mount
- [ ] SimpleBottomNavigation hover state gets stuck when mouse leaves quickly
- [ ] Accordion expand/collapse flickers when toggling the section switch
- [ ] Color picker resets unsaved color on format cycle
- [ ] `navigate('settings')` uses relative path — breaks when already on a sub-route

## Performance
- [ ] Memoize WordRowSettingColor and WordRowSettingBackground with React.memo
- [ ] Reduce re-renders — settings object changes propagate through the entire tree
- [ ] Debounce chrome.storage writes to avoid rate limiting

## Architecture
- [ ] Extract settings mutation logic into a custom `useSettings` hook
- [ ] Add proper error boundaries per page (currently none)
- [ ] Use React Context or zustand for global settings state
- [ ] Add unit tests for all Settings components
- [ ] Add e2e tests with Playwright

## Content Script
- [ ] Support user-defined custom log levels (currently only error/warn/info/debug)
- [ ] Support custom regex patterns per level from the UI
- [ ] NET performance mode (react to network requests)
- [ ] Improve iframe detection reliability
- [ ] Per-section even-row shading color control

## Chores
- [ ] Update all dependencies to latest compatible versions
- [ ] Add ARIA labels and proper keyboard navigation throughout
- [ ] Audit bundle size with vite-bundle-analyzer
- [ ] Replace inline hardcoded color values with CSS custom properties
