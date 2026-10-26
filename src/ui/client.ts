import { hostContract } from "@peers-app/peers-sdk";
import { contractId, contractVersion } from "../consts";
import type { AppContract } from "../package";

/**
 * The package's contract on the local host, for its screens. Only its types come from
 * `package.ts`, so no handler code reaches the UI bundle.
 */
export const app = hostContract<typeof AppContract>(contractId, contractVersion);
