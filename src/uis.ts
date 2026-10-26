import type { IPeersPackageUIs } from "@peers-app/peers-sdk";
import { AppScreenUI } from "./ui/app";

const uis: IPeersPackageUIs = {
  uis: [AppScreenUI],
};

declare const exportUIs: (uis: IPeersPackageUIs) => void;
exportUIs(uis);
