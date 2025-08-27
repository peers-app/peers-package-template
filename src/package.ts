import { IPeersPackage } from "peers-sdk";
import { packageId, packageName } from "./consts";

const peersPackage: IPeersPackage = {  
  packageId,
  hasUIBundle: true,
  appNavs: [
    {
      name: packageName,
      iconClassName: "bi bi-list-ul",
      navigationPath: "app"
    }
  ],
};

// Attach to provided `exports` object
(exports as any).exports = peersPackage;