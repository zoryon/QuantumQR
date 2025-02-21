import { z } from "zod";

export const formSchema = z.object({
    username: z.string().min(2).max(25),
    password: z.string().min(5).max(60)
});