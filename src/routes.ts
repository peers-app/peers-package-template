import { registerPeersUIRoute } from "peers-sdk";
import { packageId, appScreenId } from "./ids";

registerPeersUIRoute({
  packageId,
  peersUIId: appScreenId,
  path: `package-nav/${packageId}/app`,
  uiCategory: 'screen',
});