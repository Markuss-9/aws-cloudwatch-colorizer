# TODO

## Features
- [ ] Import JSON config from clipboard with validation
- [ ] Per-level regex toggle in the UI
- [ ] Keyboard shortcuts for common actions

## UI/UX
- [ ] Toast/notification system for config changes (save feedback)

## Performance
- [ ] Reduce re-renders — settings object changes propagate through the entire tree
- [ ] Debounce chrome.storage writes to avoid rate limiting

## Architecture
- [ ] Extract settings mutation logic into a custom `useSettings` hook
- [ ] Add proper error boundaries per page (currently none)
- [ ] Use React Context or zustand for global settings state

## Content Script
- [ ] Support custom regex patterns per level from the UI
- [ ] Per-section even-row shading color control

## Chores
- [ ] Add ARIA labels and proper keyboard navigation throughout
- [ ] Audit bundle size with vite-bundle-analyzer
