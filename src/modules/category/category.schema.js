import z from "zod";

export const categoryCreateSchema = z.object({
  name: z.string().trim().min(2).max(100),
  slug: z.string().trim().min(1).toLowerCase(),
  sortOrder: z.number().int().min(0).optional(),
  status: z.enum(["active", "inactive"]).optional(),
});

export const categoryUpdateSchema = categoryCreateSchema
  .partial()
  .refine((body) => Object.keys(body).length > 0, {
    message: "At least one field is required",
  });
