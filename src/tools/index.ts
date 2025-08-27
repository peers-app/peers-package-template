import { IToolInstance } from 'peers-sdk';
import { helloWorldToolInstance } from '../tool-examples';

// Export all tool instances for the package
export const toolInstances: IToolInstance[] = [
  helloWorldToolInstance,
];