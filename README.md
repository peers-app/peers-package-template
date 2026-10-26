# <package-name>

A list shared with the group.

Replace the first paragraph with what your package does: Peers shows it as the package's
description.

Made from the [Peers package template](https://github.com/peers-app/peers-package-template). It
starts as a small shared list: an `Items` table, an `add-item` tool, and a screen that uses both.
Keep the shape and replace the list.

## Commands

```bash
npm run build   # dist/package.bundle.js, routes.bundle.js, and uis.bundle.js
npm test        # the tool and the screen, with no host running
npm run lint
npm run dev     # rebuild on change
```

After a build, load it into the running Peers app and check the exit code: a failed reload
leaves the previous version running.

```bash
peers packages reload <packageId>
peers ui reload
peers ui screenshot   # prints the path of a PNG of the Peers window
```

The package id is `peers.packageId` in `package.json`.

## Layout

```text
src/
├── consts.ts             # ids: package, contract, screen
├── package.ts            # the contract and the package's declaration
├── data/items.ts         # a table: zod schema + defineTable
├── tools/add-item.tool.ts  # a tool: definition + handler
├── ui/client.ts          # the screen's client for the contract
├── ui/app.tsx            # the screen
├── routes.ts             # URL paths, loaded when Peers starts
├── uis.ts                # the screens, loaded when first shown
└── app.test.mjs          # tests
```

`src/package.ts` lists what the package is: the tables, tools, observables, and events of the
contracts it provides, and the contracts it consumes. `peers-package build` turns it into the
manifest Peers reads, and bundles the handlers for the sandbox the package runs in. Screens
call the contract through the host, like any other client.

## Adding things

- **A table:** define it in `src/data/` with `defineTable`. List it in the contract's `tables`
  to share it with the screen and other packages, or on `pkg.tables` to keep it private.
- **A tool:** define it in `src/tools/` with `defineTool` and list it in the contract's `tools`.
  The screen calls it with `useTool(app.tools["name"])`.
- **Shared state:** an observable over a `groupVar` (`defineObservable`), read in the screen
  with `useObservable`.
- **A screen:** make an id with `peers tools run new-id` and add it to `src/consts.ts`, write the
  component in `src/ui/`, then add its route to `src/routes.ts` and its UI to `src/uis.ts`.
- **Another package's contract:** `pkg.consumes(ref)`, then call it from a handler.

Changing a contract after a stable release needs a new contract version; see
[Package lifecycle](https://peers-app.github.io/Packages/package-lifecycle).

## Docs

- [Declaring a package](https://peers-app.github.io/Packages/declaring-a-package): tables,
  tools, events, observables, contracts, building, and testing.
- [Routes and UI](https://peers-app.github.io/Packages/routes-and-ui)
- [Package lifecycle](https://peers-app.github.io/Packages/package-lifecycle): dev, beta, and
  stable versions.
