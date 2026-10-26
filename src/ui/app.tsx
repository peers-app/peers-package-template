import { type IPeersUI, zodAnyObjectOrArray } from "@peers-app/peers-sdk";
import { useRows, useTool } from "@peers-app/peers-ui";
import { useState } from "react";
import { appScreenId, packageName } from "../consts";
import type { IItem } from "../data/items";
import { app } from "./client";

/** The starter screen: the group's list. Each change reaches every open copy through the table. */
export function AppScreen() {
  const [pageSize, setPageSize] = useState(100);
  const { rows: items, error, loading } = useRows(app.tables.Items, {}, { pageSize });

  return (
    <main className="container py-4" style={{ maxWidth: "760px" }}>
      <h1 className="h3">{packageName}</h1>
      <AddItemForm />
      {error && <div className="alert alert-danger mt-3">Couldn't load the list.</div>}
      <ul className="list-group mt-3">
        {items.map((item) => (
          <ItemRow key={item.itemId} item={item} />
        ))}
      </ul>
      {items.length >= pageSize && (
        <button
          className="btn btn-link"
          type="button"
          disabled={loading}
          onClick={() => setPageSize((size) => size + 100)}
        >
          Show more
        </button>
      )}
    </main>
  );
}

/** Adds an item through the `add-item` tool, as an assistant would. */
function AddItemForm() {
  const [text, setText] = useState("");
  const add = useTool(app.tools["add-item"], { onSuccess: () => setText("") });

  return (
    <form
      className="d-flex gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        void add.run({ text });
      }}
    >
      <input
        className="form-control"
        placeholder="Add an item"
        aria-label="New item"
        value={text}
        disabled={add.pending}
        onChange={(event) => setText(event.target.value)}
      />
      <button className="btn btn-primary" type="submit" disabled={add.pending || !text.trim()}>
        Add
      </button>
      {add.error && <div className="text-danger align-self-center">Couldn't add that.</div>}
    </form>
  );
}

/** One item: check it off or remove it, with the table's own save and delete. */
function ItemRow({ item }: { item: IItem }) {
  const save = useTool(app.tables.Items.save);
  const remove = useTool(app.tables.Items.delete);
  const pending = save.pending || remove.pending;

  return (
    <li className="list-group-item d-flex align-items-center gap-2">
      <input
        className="form-check-input mt-0"
        type="checkbox"
        aria-label={`Done: ${item.text}`}
        checked={item.done}
        disabled={pending}
        onChange={() => void save.run({ ...item, done: !item.done })}
      />
      <span className="flex-grow-1" style={{ textDecoration: item.done ? "line-through" : "none" }}>
        {item.text}
      </span>
      <button
        className="btn btn-sm btn-outline-secondary"
        type="button"
        disabled={pending}
        onClick={() => void remove.run(item.itemId)}
      >
        Remove
      </button>
      {save.error && <span className="text-danger">Couldn't save that item.</span>}
      {remove.error && <span className="text-danger">Couldn't remove that item.</span>}
    </li>
  );
}

export const AppScreenUI: IPeersUI = {
  peersUIId: appScreenId,
  content: AppScreen,
  propsSchema: zodAnyObjectOrArray,
};
