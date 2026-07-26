# My Package

Replace this file with a description of your package. This text appears in the Peers app UI when users browse packages.

---

## Getting Started

Your package IDs have already been generated in `src/consts.ts`. The first thing to do is:

1. Update `package.json` — set `name`, `description`, and `author`
2. Rewrite `README.md` (this file) to describe what your package does
3. Build and verify: `npm run build` then reload the app with `peers ui reload`

## Package Structure

```
my-package/
├── package.json          # Package metadata — name, version, peers.packageId
├── src/
│   ├── consts.ts         # All IDs for this package (packageId, contractId, screenIds, etc.)
│   ├── package.ts        # definePackage() — declares contracts, tools, tables, assistants, nav
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

After rebuilding, reload the app (`cmd | ctrl + r`) to pick up your changes:

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
1. Create `src/data/<table>.ts` with a Zod schema and `ITableDefinition`
2. Import and add to your contract in `src/package.ts`:
   - `main.tables = [{ metaData, schema }]` — declares the table shape in the contract
   - `main.tableDefinitions = [{ metaData, schema }]` — registers the table at runtime

### New Tool (callable by AI or users)
1. Create `src/tools/<tool>.ts` with an `ITool` and `IToolInstance`
2. Import and add to your contract in `src/package.ts`:
   - `main.tools = [toolInstance]` — declares the tool shape in the contract
   - `main.toolInstances = [toolInstance]` — registers the tool at runtime

## Key SDK Interfaces

From `@peers-app/peers-sdk`:

| Interface | Purpose |
|-----------|---------|
| `definePackage` | Entry point — declares contracts, tools, tables, assistants, and nav |
| `PackageBuilder` | Top-level builder passed to the `definePackage` callback |
| `ContractBuilder` | Scoped builder for a single contract (tables, tools, observables) |
| `IPeersUI` | A single React screen (`peersUIId`, `content`, `propsSchema`) |
| `IPeersUIRoute` | Maps a URL path to a UI |
| `ITableDefinition` | Custom SQLite table with Zod schema |
| `ITool` / `IToolInstance` | Function callable by AI or users |

## External Dependencies

These are provided by the Peers runtime — do **not** bundle them:

| Import | Provided as |
|--------|-------------|
| `react` | `React` |
| `zod` | `zod` |
| `@peers-app/peers-sdk` | `PeersSDK` |
| `@peers-app/peers-ui` | `PeersUI` |

They're already declared as externals in the webpack configs.

## Export Pattern

The `package.ts` bundle must export the package definition as a named export:

```typescript
export const packageDefinition = definePackage((pkg) => {
  // ...
});
```

Webpack (`library.type: "commonjs2"`) places this on `module.exports.packageDefinition`. The `PackageLoader` detects that export and uses the contract-based install path to register tools, tables, and assistants. This is already set up in the template.

## Reference

- [peers-app on GitHub](https://github.com/peers-app) — source, docs, and examples
- `~/peers/packages/README.md` — overview of all your installed packages
