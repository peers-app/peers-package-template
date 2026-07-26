import { definePackage } from "@peers-app/peers-sdk";
import { version } from "../package.json";
import { contractId, packageId, packageName } from "./consts";

/**
 * Contract-based package definition loaded by the Peers package installer.
 * Webpack (`library.type: "commonjs2"`) places this on `module.exports.packageDefinition`.
 */
export const packageDefinition = definePackage((pkg) => {
  pkg.packageId = packageId;
  pkg.version = version;

  // Main contract -- add tables, tools, and observables here
  const _main = pkg.contract(contractId, 1, packageName);
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
