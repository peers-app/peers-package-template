import { registerPeersUIRoute } from "peers-sdk";
import { packageId, appScreenId } from "./consts";

registerPeersUIRoute({
  packageId,
  peersUIId: appScreenId,
  path: `package-nav/${packageId}/app`,
  uiCategory: 'screen',
});