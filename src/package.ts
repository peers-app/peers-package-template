import { definePackage } from "@peers-app/peers-sdk";
import { version } from "../package.json";
import { contractId, packageId, packageName } from "./consts";

const packageDefinition = definePackage((pkg) => {
  pkg.packageId = packageId;
  pkg.version = version;
  pkg.versionTag = "dev";

  // Main contract -- add tables, tools, and observables here
  const _main = pkg.contract(contractId, 1, packageName, "dev");
  // _main.tables = [...];
  // _main.tools = [...];
  // _main.toolInstances = [...];
  // _main.tableDefinitions = [...];

  pkg.appNavs = [
    {
      name: packageName,
      iconClassName: "bi bi-list-ul",
      navigationPath: "app",
    },
  ];
});

(exports as any).packageDefinition = packageDefinition;
