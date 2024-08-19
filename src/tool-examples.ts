import { z } from 'zod';
import { createTool, IOFieldType, IOSchemaType } from "peers-sdk";


// input schema as JavaScript object
export const helloWorld = createTool({
  toolId: 'ask-shell-for-new-id',
  name: `hello-world`,
  usageDescription: [
    `This is an example tool that can be used as a starting point to create a custom tool.`,
    `This specifies the input schema as a JavaScript object.`,
  ].join(' '),
  inputSchema: {
    type: IOSchemaType.complex,
    fields: [{ name: 'greetWho', type: IOFieldType.string, optional: true, description: 'Who should be greeted', }],
  },
}, async (args) => {
  const { greetWho } = args; // note that this is untyped
  return `Hello, ${greetWho || 'world'}!`;  
});


// input schema as zod object
const inputSchema = z.object({
  greetWho: z.string().optional().describe('Who should be greeted'),
});
type IInput = z.infer<typeof inputSchema>;

// input schema as JavaScript object
export const helloWorld2 = createTool({
  toolId: 'ask-shell-for-new-id',
  name: `hello-world2`,
  usageDescription: [
    `Identical to hello-world, but with a Zod input schema.`,
    `Specifying the input schema as a Zod object allows for more control over and allows inferring types.`,
  ].join(' '),
}, {
  inputSchema,
  toolFn: async (args: IInput) => {
    const { greetWho } = args; // Note that this is type-checked
    return `Hello, ${greetWho || 'world'}!`;  
  }
});