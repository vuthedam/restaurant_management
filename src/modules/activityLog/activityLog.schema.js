import z from "zod";

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/);

export const activityLogCreateSchema = z.object({
  userId: objectIdSchema.optional().nullable(),
  entityId: objectIdSchema,
  action: z.string().trim().min(1).max(100),
  entityType: z.enum([
    "user",
    "customer",
    "table",
    "category",
    "menu_item",
    "reservation",
    "table_session",
    "order",
    "order_item",
    "payment",
    "service_call",
    "review",
  ]),
  description: z.string().trim().max(500).optional().nullable(),
});

export const activityLogUpdateSchema = activityLogCreateSchema
  .partial()
  .refine((body) => Object.keys(body).length > 0, {
    message: "At least one field is required",
  });
