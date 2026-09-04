# My Package

Replace this file and the `description` in `package.json` with a description of your package.

This template creates an isolated Peers package by default. Provider code is stored as data in
`dist/package.bundle.js` and can run only in the supervised isolated worker. Routes and React UI
remain separate renderer bundles.

## Getting started

Package, contract, and screen IDs are generated in `src/ids.json`. Start by:

1. Updating `package.json` with the package description and author
2. Rewriting this README
3. Building and checking the package:

```bash
npm install
npm run build
npm run lint
```

## Package structure

```text
my-package/
├── build-package.mjs          # Builds the isolated manifest/provider artifact
├── package.json               # Package metadata and peers.packageId
├── src/
│   ├── ids.json               # Package, contract, and screen IDs
│   ├── consts.ts              # Typed renderer exports from ids.json
│   ├── contract.ts            # Renderer-facing contract definition
│   ├── provider-source.js     # Code that may run only in the isolated worker
│   ├── routes.ts              # URL paths, loaded eagerly
│   ├── uis.ts                 # React UI registry, loaded lazily
│   └── ui/
│       └── app.tsx            # Starter screen with shared state
├── webpack.routes.config.js
└── webpack.uis.config.js
```

The build produces:

- `dist/package.bundle.js` — `PEERS_ISOLATED_PACKAGE_V1` manifest and provider source
- `dist/routes.bundle.js` — renderer route metadata
- `dist/uis.bundle.js` — renderer React components

## Development

`npm run dev` watches routes and UI. After changing `build-package.mjs`, `src/ids.json`, or
`src/provider-source.js`, run:

```bash
npm run build:package
```

Reload renderer-only changes with:

```bash
peers ui reload
```

After rebuilding `package.bundle.js`, restart Electron or reinstall the package so its isolated
manifest/provider is loaded.

## Shared UI state

The starter contract exposes a writable `state` observable backed by a group-scoped persistent
variable. `src/ui/app.tsx` consumes it through `createContractConsumer`, so state is reactive and
shared through Peers without starting the provider worker.

Replace the example `clickCount` value with your own small reactive state. For record-oriented
data, declare package-owned tables instead of accumulating records in the state object.

## Adding a table

1. Add the table schema once to `manifest.tables` in `build-package.mjs`.
2. Reference public tables by name in `provides[].tables`.
3. Mirror the public shape in `src/contract.ts`.
4. Use `consumer.tables[tableName]` from the renderer.

Tables omitted from `provides[].tables` remain private to provider tools. Peers derives their
physical identity from the package ID; do not add table IDs or physical names.

## Adding a tool

1. Add the tool's metadata to `provides[].tools` in `build-package.mjs`.
2. Register the matching implementation in `src/provider-source.js`:

```javascript
registerContractTool(CONTRACT_ID, 1, "toolName", function toolName(input) {
  return { result: input };
});
```

Provider source is plain JavaScript. Do not import Node modules, React, or the Peers SDK there.
Use only the guest APIs supplied by the isolated host, such as `registerContractTool`,
`getOwnedTableRecord`, `saveOwnedTableRecord`, and owned persistent-variable helpers.

## Adding a screen

1. Generate a new 25-character Peers ID with `peers tools run new-id`.
2. Add it to `src/ids.json` and export it from `src/consts.ts`.
3. Create the React component under `src/ui/`.
4. Add its route to `src/routes.ts`.
5. Add its `IPeersUI` registration to `src/uis.ts`.

## Runtime boundaries

- Provider code is isolated in Electron.
- Renderer UI is not a security boundary; it should access package data through contracts.
- PWA currently skips isolated providers. Routes and UI can still load, but isolated contract
  providers are unavailable until the PWA host adds an isolated runtime.

See the published Peers package documentation and the `official-packages/isolation-smoke`
reference package for the full artifact and guest API.
