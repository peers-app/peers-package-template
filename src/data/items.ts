import { defineTable, z, zodPeerId } from "@peers-app/peers-sdk/define";

export const itemSchema = z.object({
  itemId: zodPeerId.describe("Item id."),
  text: z.string().describe("What the item says."),
  done: z.boolean().default(false).describe("Whether it's done."),
});

/** One item on the list. */
export type IItem = z.infer<typeof itemSchema>;

/** The list, shared with everyone in the group. */
export const Items = defineTable({
  name: "Items",
  description: "Items on the list, shared with the group.",
  primaryKeyName: "itemId",
  schema: itemSchema,
});
