import z from "zod";

export const customerCreateSchema = z.object({
  fullName: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(9).max(15),
  email: z.string().email().optional().nullable(),
  note: z.string().trim().max(500).optional().nullable(),
});

export const customerUpdateSchema = customerCreateSchema
  .partial()
  .refine((body) => Object.keys(body).length > 0, {
    message: "At least one field is required",
  });
