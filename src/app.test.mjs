// `npm test`: the add-item tool with a fake host, and the screen against a mock host. Nothing
// needs building first; esbuild bundles the source for Node below.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";
import { createElement } from "react";

const require = createRequire(import.meta.url);
const { act, create } = require("react-test-renderer");
const { newid } = require("@peers-app/peers-sdk");
const { runPackageTool } = require("@peers-app/peers-sdk/define");
const { mockHostContract } = require("@peers-app/peers-sdk/testing");
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

/**
 * The package's source, bundled for Node. React and the SDK stay external, so the source, this
 * test, and the mock host share one copy of each. peers-ui's hooks load directly, skipping the
 * browser assets its main entry imports.
 */
async function loadSource() {
  const { outputFiles } = await build({
    stdin: {
      contents: [
        'export { AppContract } from "./package";',
        'export { addItemTool } from "./tools/add-item.tool";',
        'export { AppScreenUI } from "./ui/app";',
      ].join("\n"),
      resolveDir: fileURLToPath(new URL(".", import.meta.url)),
      loader: "ts",
    },
    bundle: true,
    write: false,
    platform: "node",
    format: "cjs",
    external: ["react", "react/jsx-runtime", "@peers-app/peers-sdk", "@peers-app/peers-sdk/*"],
    plugins: [
      {
        name: "peers-ui-hooks",
        setup(builder) {
          builder.onResolve({ filter: /^@peers-app\/peers-ui$/ }, () => ({
            path: require.resolve("@peers-app/peers-ui/dist/hooks"),
          }));
        },
      },
    ],
  });
  const module = { exports: {} };
  new Function("require", "module", "exports", outputFiles[0].text)(
    require,
    module,
    module.exports,
  );
  return module.exports;
}

const { AppContract, addItemTool, AppScreenUI } = await loadSource();

/** Let the mock host's answers, and the reads they cause, land. */
async function settle() {
  await act(async () => {
    for (let i = 0; i < 10; i++) await new Promise((resolve) => setTimeout(resolve, 0));
  });
}

/** Register cleanup before mounting, so a render failure cannot leak the single mock host. */
async function render(t, host) {
  let screen;
  t.after(async () => {
    try {
      await act(async () => screen?.unmount());
    } finally {
      host.dispose();
    }
  });
  await act(async () => {
    screen = create(createElement(AppScreenUI.content));
  });
  await settle();
  return screen;
}

test("add-item saves a trimmed item that isn't done", async () => {
  const saved = [];
  // The host calls the tool makes. `Items(ctx).save` arrives as an owned-table call.
  const ctx = {
    callOwnedTable: async (table, operation, [row]) => {
      saved.push({ table, operation, row });
      return row;
    },
  };
  const item = await runPackageTool(addItemTool, { text: "  Milk " }, ctx);
  assert.equal(item.text, "Milk");
  assert.equal(item.done, false);
  assert.deepEqual(saved, [{ table: "Items", operation: "save", row: item }]);
  await assert.rejects(runPackageTool(addItemTool, { text: "   " }, ctx));
  assert.equal(saved.length, 1);
});

test("the screen lists the items, adds one, checks one off, and removes it", async (t) => {
  const host = mockHostContract(AppContract, {
    tables: { Items: [{ itemId: newid(), text: "Bread", done: false }] },
    // A mock host answers tools with fakes. This one stores the item as add-item does.
    tools: {
      "add-item": ({ text }) => host.tables.Items.save({ itemId: newid(), text, done: false }),
    },
  });
  const screen = await render(t, host);
  const text = () => JSON.stringify(screen.toJSON());
  assert.match(text(), /Bread/);

  const input = () => screen.root.find((node) => node.props["aria-label"] === "New item");
  await act(async () => input().props.onChange({ target: { value: "Milk" } }));
  await act(async () => screen.root.findByType("form").props.onSubmit({ preventDefault() {} }));
  await settle();
  assert.deepEqual(
    host.tables.Items.rows.map((item) => item.text),
    ["Bread", "Milk"],
  );
  assert.match(text(), /Milk/);
  assert.equal(input().props.value, "");

  const bread = screen.root.find((node) => node.props["aria-label"] === "Done: Bread");
  await act(async () => bread.props.onChange());
  await settle();
  assert.equal(host.tables.Items.rows[0].done, true);

  const remove = screen.root.findAllByType("button").find((node) => node.children[0] === "Remove");
  await act(async () => remove.props.onClick());
  await settle();
  assert.deepEqual(
    host.tables.Items.rows.map((item) => item.text),
    ["Milk"],
  );
  assert.doesNotMatch(text(), /Bread/);
});

test("failed writes keep the item and the draft, and show their errors", async (t) => {
  const host = mockHostContract(AppContract, {
    tables: { Items: [{ itemId: newid(), text: "Bread", done: false }] },
    onCall: (call) => {
      if (["save", "delete", "run"].includes(call.operation)) throw new Error("offline");
    },
  });
  const screen = await render(t, host);
  const input = () => screen.root.find((node) => node.props["aria-label"] === "New item");
  await act(async () => input().props.onChange({ target: { value: "Milk" } }));
  await act(async () => screen.root.findByType("form").props.onSubmit({ preventDefault() {} }));
  await settle();
  assert.match(JSON.stringify(screen.toJSON()), /Couldn't add that/);
  assert.equal(input().props.value, "Milk");

  await act(async () =>
    screen.root.find((node) => node.props["aria-label"] === "Done: Bread").props.onChange(),
  );
  await settle();
  assert.match(JSON.stringify(screen.toJSON()), /Couldn't save that item/);
  const remove = screen.root.findAllByType("button").find((node) => node.children[0] === "Remove");
  await act(async () => remove.props.onClick());
  await settle();
  assert.match(JSON.stringify(screen.toJSON()), /Couldn't remove that item/);
  assert.equal(host.tables.Items.rows[0].done, false);
});

test("the screen can show items beyond the first page", async (t) => {
  const host = mockHostContract(AppContract, {
    tables: {
      Items: Array.from({ length: 101 }, (_, index) => ({
        itemId: newid(),
        text: `Item ${index + 1}`,
        done: false,
      })),
    },
  });
  const screen = await render(t, host);
  assert.doesNotMatch(JSON.stringify(screen.toJSON()), /Item 101/);
  const more = screen.root.findAllByType("button").find((node) => node.children[0] === "Show more");
  await act(async () => more.props.onClick());
  await settle();
  assert.match(JSON.stringify(screen.toJSON()), /Item 101/);
});

test("pending adds protect the draft and pending item writes disable both actions", async (t) => {
  let finish;
  const host = mockHostContract(AppContract, {
    tables: { Items: [{ itemId: newid(), text: "Bread", done: false }] },
    onCall: (call) => {
      if (["save", "run"].includes(call.operation)) {
        return new Promise((resolve) => {
          finish = resolve;
        });
      }
    },
    tools: {
      "add-item": ({ text }) => host.tables.Items.save({ itemId: newid(), text, done: false }),
    },
  });
  const screen = await render(t, host);
  const input = () => screen.root.find((node) => node.props["aria-label"] === "New item");
  await act(async () => input().props.onChange({ target: { value: "Milk" } }));
  await act(async () => screen.root.findByType("form").props.onSubmit({ preventDefault() {} }));
  await settle();
  assert.equal(input().props.disabled, true);
  await act(async () => finish());
  await settle();
  assert.equal(input().props.disabled, false);

  const checkbox = () => screen.root.find((node) => node.props["aria-label"] === "Done: Bread");
  await act(async () => checkbox().props.onChange());
  await settle();
  const remove = screen.root.findAllByType("button").find((node) => node.children[0] === "Remove");
  assert.equal(checkbox().props.disabled, true);
  assert.equal(remove.props.disabled, true);
  await act(async () => finish());
  await settle();
  assert.equal(checkbox().props.disabled, false);
  assert.equal(host.tables.Items.rows[0].done, true);
});
