import {
  createContractConsumer,
  getUserContext,
  type IContractConsumer,
  type IPeersUI,
  waitForHostContractTransport,
  zodAnyObjectOrArray,
} from "@peers-app/peers-sdk";
import { useEffect, useRef, useState } from "react";
import { appScreenId, packageName, stateObservableName } from "../consts";
import { packageContract } from "../contract";

function getClickCount(value: unknown): number {
  if (!value || typeof value !== "object" || !("clickCount" in value)) {
    return 0;
  }
  const count = (value as { clickCount?: unknown }).clickCount;
  return typeof count === "number" ? count : 0;
}

export function AppScreen() {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const consumerRef = useRef<IContractConsumer>();

  useEffect(() => {
    let cancelled = false;
    let consumer: IContractConsumer | undefined;
    let stateSubscription: { dispose(): void } | undefined;

    void Promise.all([waitForHostContractTransport({ timeoutMs: 5_000 }), getUserContext()])
      .then(async ([transport, userContext]) => {
        const dataContextId = userContext.currentlyActiveGroupId() ?? userContext.userId;
        consumer = createContractConsumer(packageContract, transport, { dataContextId });
        await consumer.loadingPromise;
        if (cancelled) {
          consumer.dispose();
          return;
        }

        const state = consumer.observables[stateObservableName];
        setCount(getClickCount(state()));
        stateSubscription = state.subscribe((value) => setCount(getClickCount(value)));
        consumerRef.current = consumer;
        setLoading(false);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : String(err));
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
      stateSubscription?.dispose();
      consumer?.dispose();
      consumerRef.current = undefined;
    };
  }, []);

  const incrementCount = () => {
    const state = consumerRef.current?.observables[stateObservableName];
    if (!state) {
      return;
    }
    state({ clickCount: getClickCount(state()) + 1 });
  };

  return (
    <main className="container py-4" style={{ maxWidth: "760px" }}>
      <h1 className="h3">{packageName}</h1>
      <p className="text-body-secondary">
        The UI bundle runs in the renderer. Shared state is hosted by the isolated package contract
        without starting a provider worker.
      </p>
      <p>Persisted button clicks: {count}</p>
      <button
        className="btn btn-primary"
        disabled={loading || Boolean(error)}
        onClick={incrementCount}
        type="button"
      >
        {loading ? "Loading…" : "Click me"}
      </button>
      {error && <div className="alert alert-danger mt-4">{error}</div>}
    </main>
  );
}

export const AppScreenUI: IPeersUI = {
  peersUIId: appScreenId,
  content: AppScreen,
  propsSchema: zodAnyObjectOrArray,
};
