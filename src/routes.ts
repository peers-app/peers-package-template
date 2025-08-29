// ATTENTION: Keep the routes bundle as small as possible since all routes have to be preloaded before the UI can render.
//            Avoid importing unnecessary code, particularly components.  This should be completely decoupled from your UI bundle.

import { IPeersPackageRoutes, IPeersUIRoute } from "peers-sdk";
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