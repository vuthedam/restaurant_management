import z from "zod";

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/);

export const orderItemCreateSchema = z.object({
  orderId: objectIdSchema,
  menuItemId: objectIdSchema,
  servedBy: objectIdSchema.optional().nullable(),
  name: z.string().trim().min(1).max(150),
  image: z.string().trim().optional().nullable(),
  quantity: z.number().int().min(1).max(100),
  price: z.number().min(0),
  subtotal: z.number().min(0),
  note: z.string().trim().max(300).optional().nullable(),
  status: z
    .enum(["pending", "confirmed", "preparing", "served", "cancelled"])
    .optional(),
});

export const orderItemUpdateSchema = orderItemCreateSchema
  .partial()
  .refine((body) => Object.keys(body).length > 0, {
    message: "At least one field is required",
  });
