# PseudoRun

PseudoRun is an IGCSE Pseudocode editor and simulator for Computer Science students. This repository is organised as an npm-workspaces monorepo containing the web application, browser extensions, a Windows desktop client, Firebase Cloud Functions, and shared libraries.

## Structure

| Path | Description |
| --- | --- |
| `apps/web` | Main web application (Vite + React + TypeScript). |
| `apps/extension-firefox` | Firefox browser extension. |
| `apps/extension-edge` | Microsoft Edge (Chromium) browser extension. |
| `apps/windows-desktop` | Windows desktop client (.NET / Visual Studio solution). |
| `functions` | Firebase Cloud Functions (TypeScript). |
| `packages/core` | Shared core library (pseudocode lexer, parser, interpreter, validator, utils). |

## Prerequisites

- Node.js 18+
- npm 8+ (workspaces support)
- Visual Studio 2022 or the .NET SDK (for the Windows desktop app only)

## Getting started

Install all workspace dependencies from the repository root:

```
npm install
```

## Common commands

Run from the repository root.

| Command | Description |
| --- | --- |
| `npm run dev` | Start the web app dev server (`@pseudorun/web`). |
| `npm run build:web` | Build the web app to `apps/web/dist`. |
| `npm run build:ext:firefox` | Build the Firefox extension. |
| `npm run build:ext:edge` | Build the Edge extension. |
| `npm run build:extensions` | Build both browser extensions. |
| `npm run build:all` | Build the web app and both extensions. |
| `npm run build:functions` | Build Firebase Cloud Functions. |
| `npm run typecheck` | Run `typecheck` in any workspace that defines it. |

### Windows desktop

Open `apps/windows-desktop/PseudoRun.sln` in Visual Studio, or build from the CLI:

```
dotnet build apps/windows-desktop/PseudoRun.sln
```

## Apps at a glance

- **apps/web** - The primary editor and simulator UI. Deployed to Firebase Hosting / Vercel / Netlify.
- **apps/extension-firefox** - Firefox extension wrapping the editor for in-browser use.
- **apps/extension-edge** - Edge extension equivalent to the Firefox build.
- **apps/windows-desktop** - Native Windows client built on .NET.
- **functions** - Server-side Firebase Cloud Functions (admin tooling, email, etc.).
- **packages/core** - Shared library for pseudocode parsing and execution logic (used by web app and extensions).

## Deployment

- Firebase Hosting reads `firebase.json` (publishes `apps/web/dist`).
- Vercel reads `vercel.json` (builds `@pseudorun/web`, publishes `apps/web/dist`).
- Netlify reads `netlify.toml` (same build + publish directory).

## CI/CD and Publishing

- **Web app**: Vercel auto-deploys on every push to `main`.
- **Windows desktop**: GitHub Actions (`windows-desktop.yml`) builds and publishes on changes to `apps/windows-desktop/**`.
- **Extensions**: GitHub Actions (`publish-extensions.yml`) builds and publishes Firefox and Edge extensions on changes to `apps/extension-*/**` or `packages/core/**`.

### Publishing Browser Extensions

The `publish-extensions.yml` workflow auto-updates AMO (Firefox) and Microsoft Edge Add-ons on relevant pushes to `main`. Initial publication requires manual submission via the web stores.

#### Secrets Required

Set these in GitHub repo → **Settings** → **Secrets and variables** → **Actions**:

- `FIREFOX_JWT_ISSUER` and `FIREFOX_JWT_SECRET`: From https://addons.mozilla.org/en-US/developers/addon/api/key/
- `EDGE_PRODUCT_ID`, `EDGE_API_KEY`, `EDGE_CLIENT_ID`: From Microsoft Edge Add-ons API setup

To trigger extension publishing, push changes to extension code or `packages/core` to `main`.

## Documentation

App-specific documentation lives alongside each workspace, e.g. `apps/web/docs/` contains admin setup guides, Firestore rules notes, and the IGCSE pseudocode reference material.

## License

MIT
