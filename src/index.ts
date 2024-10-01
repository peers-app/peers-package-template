import { IPeersPackage } from "peers-sdk";
import { helloWorld, helloWorld2 } from "./tool-examples";

const peersPackage: IPeersPackage = {
  toolInstances: [
    helloWorld,
    helloWorld2,
  ],
};

// peers requires that you export the package components in this way
module.exports = peersPackage;