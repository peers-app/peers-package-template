import type { IPeersPackageUIs } from "@peers-app/peers-sdk";
import "./ui/app";
import { AppScreenUI } from "./ui/app";

const uis: IPeersPackageUIs = {
  uis: [AppScreenUI],
};

declare const exportUIs: (uis: IPeersPackageUIs) => void;
exportUIs(uis);
