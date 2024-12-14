import { IPeersPackage } from "peers-sdk";
import { helloWorld, helloWorld2 } from "./tool-examples";

const peersPackage: IPeersPackage = {
  assistants: [],
  toolInstances: [
    helloWorld,
    helloWorld2,
  ],
  workflows: [],
  events: [],
  UIs: [],
};

// peers requires that you export the package components in this way
module.exports = peersPackage;