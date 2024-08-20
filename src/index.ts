import { helloWorld, helloWorld2 } from "./tool-examples";

// peers requires that you export the package components in this shape
module.exports = {
  toolInstances: [
    helloWorld,
    helloWorld2,
  ],
  assistants: [],
  workflows: [],
  events: [],
}