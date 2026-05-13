import z from "zod";

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/);

export const reviewCreateSchema = z.object({
  tableSessionId: objectIdSchema,
  orderId: objectIdSchema.optional().nullable(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().max(1000).optional().nullable(),
});

export const reviewUpdateSchema = reviewCreateSchema
  .partial()
  .refine((body) => Object.keys(body).length > 0, {
    message: "At least one field is required",
  });
