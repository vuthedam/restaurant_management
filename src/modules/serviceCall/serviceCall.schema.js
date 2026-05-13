import z from "zod";

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/);

export const serviceCallCreateSchema = z.object({
  tableId: objectIdSchema,
  tableSessionId: objectIdSchema.optional().nullable(),
  handledBy: objectIdSchema.optional().nullable(),
  type: z.enum([
    "call_staff",
    "request_payment",
    "need_water",
    "clean_table",
    "other",
  ]),
  status: z.enum(["pending", "handling", "completed", "cancelled"]).optional(),
  note: z.string().trim().max(300).optional().nullable(),
});

export const serviceCallUpdateSchema = serviceCallCreateSchema
  .partial()
  .refine((body) => Object.keys(body).length > 0, {
    message: "At least one field is required",
  });
