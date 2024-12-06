import z from "zod";

export const addressSchema = z.object({
    addressLine1: z.string().optional(),
    addressLine2: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    postalCode: z.string().optional(),
    country: z.string().optional() 
});

export type AddressType = z.infer<typeof addressSchema>;