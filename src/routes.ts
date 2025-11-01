// ATTENTION: Keep the routes bundle as small as possible since all routes for all packages have to be preloaded before any UI can render.
//            Avoid importing unnecessary code, particularly components.  This should be completely decoupled from your UI bundle.

import type { IPeersPackageRoutes, IPeersUIRoute } from "@peers-app/peers-sdk";
import { appScreenId, packageId } from "./consts";

const appScreenRoute: IPeersUIRoute = {
  packageId,
  peersUIId: appScreenId,
  path: `package-nav/${packageId}/app`,
  uiCategory: 'screen',
};

const routes: IPeersPackageRoutes = {
  routes: [
    appScreenRoute
  ]
};

declare const exportRoutes: (routes: IPeersPackageRoutes) => void;
exportRoutes(routes);
