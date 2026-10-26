import { AccessLevel, defineTool, newid, z } from "@peers-app/peers-sdk/define";
import { Items, itemSchema } from "../data/items";

/** Add an item to the list. The screen calls it, and so can an assistant or another package. */
export const addItemTool = defineTool({
  name: "add-item",
  usageDescription: "Add an item to the list.",
  accessLevel: AccessLevel.Writer,
  inputSchema: z.object({
    text: z.string().trim().min(1).describe("What the item says."),
  }),
  outputSchema: itemSchema,
  handler: async ({ text }, ctx) => Items(ctx).save({ itemId: newid(), text }),
});
