import { FieldType, type IContractDefinition } from "@peers-app/peers-sdk";
import ids from "./ids.json";

/** Public contract used by this package's renderer. */
export const packageContract = {
  contractId: ids.contractId,
  version: 1,
  name: ids.packageName,
  description: `Shared state for ${ids.packageName}.`,
  tables: [],
  tools: [],
  observables: [
    {
      name: ids.stateObservableName,
      description: "Shared application state.",
      valueType: FieldType.object,
      writable: true,
    },
  ],
  events: [],
} satisfies IContractDefinition;
