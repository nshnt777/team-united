import z from "zod";

export const teamSchema = z.object({
    name: z.string(),
    description: z.string().optional(),
    hobbyId: z.number()
});

export type Team = z.infer<typeof teamSchema>;