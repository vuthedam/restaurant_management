import z from "zod";

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/);

export const menuItemCreateSchema = z.object({
  categoryId: objectIdSchema,
  name: z.string().trim().min(2).max(150),
  slug: z.string().trim().min(1).toLowerCase(),
  description: z.string().trim().max(1000).optional().nullable(),
  image: z.string().trim().optional().nullable(),
  images: z.array(z.string().trim()).optional(),
  price: z.number().min(0),
  salePrice: z.number().min(0).optional().nullable(),
  isAvailable: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  preparationTime: z.number().int().min(1).max(180).optional(),
  status: z.enum(["active", "inactive"]).optional(),
});

export const menuItemUpdateSchema = menuItemCreateSchema
  .partial()
  .refine((body) => Object.keys(body).length > 0, {
    message: "At least one field is required",
  });
