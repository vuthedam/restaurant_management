import z from "zod";

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/);

export const orderCreateSchema = z.object({
  tableSessionId: objectIdSchema,
  tableId: objectIdSchema,
  confirmedBy: objectIdSchema.optional().nullable(),
  servedBy: objectIdSchema.optional().nullable(),
  orderNumber: z.string().trim().min(1).toUpperCase(),
  orderSource: z.enum(["qr", "staff", "admin"]).optional(),
  status: z
    .enum(["pending", "confirmed", "preparing", "served", "completed", "cancelled"])
    .optional(),
  subtotal: z.number().min(0).optional(),
  discount: z.number().min(0).optional(),
  finalAmount: z.number().min(0).optional(),
  paymentStatus: z.enum(["pending", "paid", "failed", "refunded"]).optional(),
  note: z.string().trim().max(500).optional().nullable(),
});

export const orderUpdateSchema = orderCreateSchema
  .partial()
  .refine((body) => Object.keys(body).length > 0, {
    message: "At least one field is required",
  });
