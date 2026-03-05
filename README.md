# My Package

Replace this file with a description of your package. This text appears in the Peers app UI when users browse packages.

---

## Getting Started

Your package IDs have already been generated in `src/consts.ts`. The first thing to do is:

1. Update `package.json` — set `name`, `description`, and `author`
2. Rename `README.md` (this file) to describe what your package does
3. Build and verify: `npm run build` then reload the app with `peers ui reload`

## Package Structure

```
my-package/
├── package.json          # Package metadata — name, version, peers.packageId
├── src/
│   ├── consts.ts         # All IDs for this package (packageId, screenIds, etc.)
│   ├── package.ts        # IPeersPackage — registers tools, tables, assistants, nav
│   ├── routes.ts         # IPeersPackageRoutes — maps URL paths to screens
│   ├── uis.ts            # IPeersPackageUIs — exports React components
│   └── ui/
│       └── app.tsx       # Default "Hello World" screen — replace with your UI
├── dist/                 # Built bundles (generated — do not edit)
│   ├── package.bundle.js
│   ├── routes.bundle.js
│   └── uis.bundle.js
└── webpack.*.config.js   # Build configs (one per bundle)
```

## Build Commands

```bash
npm run build   # Build all three bundles (run this after any code change)
npm run dev     # Watch mode — rebuilds automatically on file save
```

After rebuilding, reload the app to pick up your changes:

```bash
peers ui reload
```

## Adding Features

### New Screen
1. Add a screen ID to `src/consts.ts`
2. Create a React component in `src/ui/`
3. Export an `IPeersUI` from the component file
4. Add an `IPeersUIRoute` in `src/routes.ts`
5. Add the UI to `src/uis.ts`

### New Table (Persistent Data)
1. Add a table ID to `src/consts.ts`
2. Create `src/data/<table>.ts` with a Zod schema and `ITableDefinition`
3. Import and add to `tableDefinitions` in `src/package.ts`

### New Tool (callable by AI or users)
1. Add a tool ID to `src/consts.ts`
2. Create `src/tools/<tool>.ts` with an `ITool` and `IToolInstance`
3. Import and add to `toolInstances` in `src/package.ts`

## Key SDK Interfaces

From `@peers-app/peers-sdk`:

| Interface | Purpose |
|-----------|---------|
| `IPeersPackage` | Main package definition |
| `IPeersUI` | A single React screen (`peersUIId`, `content`, `propsSchema`) |
| `IPeersUIRoute` | Maps a URL path to a UI |
| `ITableDefinition` | Custom SQLite table with Zod schema |
| `ITool` / `IToolInstance` | Function callable by AI or users |

## External Dependencies

These are provided by the Peers runtime — do **not** bundle them:

| Import | Provided as |
|--------|-------------|
| `react` | `React` |
| `@peers-app/peers-sdk` | `PeersSDK` |
| `zod` | `zod` |

They're already declared as externals in the webpack configs.

## Export Pattern

The `package.ts` bundle must export via:

```typescript
(exports as any).exports = peersPackage;
```

This is already set up in the template — don't change it.

## Reference

- [peers-app on GitHub](https://github.com/peers-app) — source, docs, and examples
- `~/peers/packages/README.md` — overview of all your installed packages
