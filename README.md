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
registerContractTool(CONTRACT_ID, 1, "toolName", async function toolName(input, ctx) {
  await ctx.setOwnedPersistentVar("device", "lastInput", input);
  return { result: input };
});
```

Each handler gets its arguments and a `ctx` with the host functions for that call:
`ctx.getOwnedTableRecord`, `ctx.saveOwnedTableRecord`, the owned persistent-variable helpers,
`ctx.emitContractEvent`, and `ctx.callConsumedTool` for contracts the package consumes. Calls
and event callbacks can run at the same time. Start hooks run concurrently with each other;
calls and event deliveries wait for all hooks to finish, while work a hook starts without
awaiting can overlap later calls. The package orders the state these operations share:
a handler that reads and then writes a row should run that change through a small
queue kept in module state, for example:

```javascript
let changes = Promise.resolve();
function queued(change) {
  const run = changes.then(change, change);
  changes = run.catch(() => undefined);
  return run;
}
```

Time spent waiting in the queue counts against the call's deadline.

Code that should run when the worker starts (subscriptions, timers in privileged mode) goes in
`onWorkerStart(async (ctx) => { ... })`. That `ctx` belongs to no call, so its
`ctx.callConsumedTool` calls are denied, including calls to the package's own contracts. The
worker's startup waits for the hook, and a hook that throws keeps the worker from starting, so
don't await long-running work there.

A call that runs past its deadline (30 seconds by default; a tool's `timeoutMs` can raise it to
120 seconds) is rejected, but its handler keeps running. For longer
work, save a job row, return its ID, and update the row as the work progresses. Once the call
has returned or timed out, its `ctx` can still use owned tables, persistent variables, and
events, but its `ctx.callConsumedTool` calls are denied, so that work can't call other
contracts such as System HTTP.

Provider source is plain JavaScript. Do not import Node modules, React, or the Peers SDK there.
Use only the guest APIs supplied by the isolated host. See
[Package contracts](https://peers-app.github.io/Packages/contracts) for the full guest API.

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
