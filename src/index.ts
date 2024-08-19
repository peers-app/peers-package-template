import { helloWorld, helloWorld2 } from "./tool-examples";

const packageInfo = {
  packageId: '00lzvxswqo8mx6ijlnkksmyb8',

  // TODO set a friendly name.  This is the name that will be displayed in the UI, optional but recommended.
  // name: 'Put your name here',    
};

module.exports = {
  packageInfo,
  toolInstances: [
    helloWorld,
    helloWorld2,
  ],
  assistants: [],
  workflows: [],
  events: [],
}