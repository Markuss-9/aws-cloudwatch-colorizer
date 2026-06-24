# AWS CloudWatch Colorizer

A Chrome extension that colorizes keywords in AWS CloudWatch logs — making errors, warnings, info, and debug messages instantly recognizable at a glance.

## Features

- Colorizes **Log Groups**, **Log Insights**, and **Log Analytics** pages.
- **Two display modes**: **Replace** — inline colored labels with emojis; **Background** — full row background shading with even-row opacity.
- **Per-level patterns** — each log level (like error, warn ...) supports multiple match patterns. Uses whole-word matching by default — no false positives on words like "terrorizing".
- **Customizable colors** per level via the extension UI's color picker.
- **Auto Mode** with two performance options: **DOM** (reactive, recommended) and **Timer** (poll-based).
- Per-page and per-level toggles, master on/off switch, and global reset.

## Distribution

Published on [Chrome Web Store](https://chromewebstore.google.com/detail/aws-cloudwatch-colorizer/ncenlceeghmojbnnbleckijobaiikfio)

See [CHANGELOG.md](./CHANGELOG.md) for release history.

## DEV

### Prerequisites

- Node >= 24 (see `.nvmrc`)
- npm

### Setup

```shell
npm install
```

### Development

```shell
npm start
```

Runs the extension popup UI via Vite dev server with HMR.

### Build

```shell
npm run build
```

Produces the production extension in `dist/`. Builds the popup app and content scripts in parallel, then aligns version numbers across manifests.

### Watch mode

```shell
npm run watch
```

Rebuilds on file changes (content scripts only, not the popup).

### Tests

```shell
npm test                  # run once
npm run test:watch        # watch mode
npm run test:ui           # vitest UI dashboard
```

### Type checking

```shell
npm run typecheck
```

### Lint & format

```shell
npm run pretty
```

### Generate test log data

```shell
node generate-test-data.js | aws logs put-log-events \
  --log-group-name my-log-group \
  --log-stream-name my-log-stream \
  --log-events file:///dev/stdin
```

If your shell doesn't support `/dev/stdin`, save to a file first:

```shell
node generate-test-data.js > /tmp/test-events.json
aws logs put-log-events \
  --log-group-name my-log-group \
  --log-stream-name my-log-stream \
  --log-events file:///tmp/test-events.json
```
