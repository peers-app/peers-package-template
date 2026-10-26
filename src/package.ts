import { defineContract, definePackage } from "@peers-app/peers-sdk/define";
import { version } from "../package.json";
import { contractId, contractVersion, packageId, packageName } from "./consts";
import { Items } from "./data/items";
import { addItemTool } from "./tools/add-item.tool";

/**
 * The package's contract: the tables and tools its screen, assistants, and other packages can
 * use. The screen reaches it through `ui/client.ts`.
 */
export const AppContract = defineContract({
  contractId,
  version: contractVersion,
  name: packageName,
  description: "A list shared with the group.",
  tables: [Items],
  tools: [addItemTool],
});

/** The package: the contracts it provides and consumes, and its entry in the Apps launcher. */
export default definePackage((pkg) => {
  pkg.packageId = packageId;
  pkg.version = version;
  pkg.provides(AppContract);
  pkg.appNavs = [{ name: packageName, iconClassName: "bi bi-app", navigationPath: "app" }];
});
