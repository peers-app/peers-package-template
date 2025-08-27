import { IPeersPackage } from "peers-sdk";
import { packageId } from "./ids";
import { toolInstances } from "./tools";

const peersPackage: IPeersPackage = {
  packageId,
  hasUIBundle: true,
  appNavs: [
    {
      name: "<package-name>",
      iconClassName: "bi bi-list-ul",
      navigationPath: "app"
    }
  ],
  toolInstances,
};

// Attach to provided `exports` object
(exports as any).exports = peersPackage;