import { z } from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .min(10, { message: "Content Must be at least of 10 charcters" })
    .max(300, { message: "Content Must be no longer than 300 characters" }),
});
