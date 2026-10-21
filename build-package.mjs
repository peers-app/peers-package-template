import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = dirname(fileURLToPath(import.meta.url));
const [packageJsonText, idsText, providerSource] = await Promise.all([
  readFile(join(packageRoot, "package.json"), "utf8"),
  readFile(join(packageRoot, "src", "ids.json"), "utf8"),
  readFile(join(packageRoot, "src", "provider-source.js"), "utf8"),
]);

const packageJson = JSON.parse(packageJsonText);
const ids = JSON.parse(idsText);

function assertPeerId(value, label) {
  if (typeof value !== "string" || !/^[A-Za-z0-9]{25}$/.test(value)) {
    throw new Error(`${label} must be a 25-character alphanumeric Peers ID`);
  }
}

assertPeerId(ids.packageId, "packageId");
assertPeerId(ids.contractId, "contractId");
assertPeerId(ids.screenId, "screenId");

if (packageJson.peers?.packageId !== ids.packageId) {
  throw new Error("package.json peers.packageId must match src/ids.json");
}

const artifact = {
  manifest: {
    packageId: ids.packageId,
    version: packageJson.version,
    // Handlers take (args, ctx) and calls run concurrently.
    guestApi: 2,
    tables: [],
    provides: [
      {
        contractId: ids.contractId,
        version: 1,
        name: ids.packageName,
        description: `Shared state for ${ids.packageName}.`,
        tools: [],
        observables: [
          {
            name: ids.stateObservableName,
            description: "Shared application state.",
            valueType: "object",
            writable: true,
            persistentVar: {
              scope: "group",
              name: ids.stateObservableName,
              defaultValue: {},
            },
          },
        ],
      },
    ],
    consumes: [],
    appNavs: [
      {
        name: ids.packageName,
        iconClassName: "bi bi-app",
        navigationPath: "app",
      },
    ],
  },
  providerSource,
};

const distDir = join(packageRoot, "dist");
await mkdir(distDir, { recursive: true });
await writeFile(
  join(distDir, "package.bundle.js"),
  `PEERS_ISOLATED_PACKAGE_V1\n${JSON.stringify(artifact)}\n`,
  "utf8",
);

console.info(`[${packageJson.name}] Built isolated package ${ids.packageId}`);
