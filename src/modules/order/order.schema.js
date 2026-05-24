import z from "zod";

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/);

export const staffOrderSchema = z.object({
  tableId: objectIdSchema,
  customerName: z.string().trim().max(100).optional().nullable(),
  guestCount: z.number().int().min(1).max(30).optional(),
  discount: z.number().min(0).optional(),
  note: z.string().trim().max(500).optional().nullable(),
  items: z
    .array(
      z.object({
        menuItemId: objectIdSchema,
        quantity: z.number().int().min(1).max(100),
        note: z.string().trim().max(300).optional().nullable(),
      })
    )
    .min(1, "Cần ít nhất 1 món"),
});

export const orderUpdateSchema = z
  .object({
    confirmedBy: objectIdSchema.optional().nullable(),
    servedBy: objectIdSchema.optional().nullable(),
    status: z
      .enum(["pending", "confirmed", "preparing", "served", "completed", "cancelled"])
      .optional(),
    discount: z.number().min(0).optional(),
    paymentStatus: z.enum(["pending", "paid", "failed", "refunded"]).optional(),
    note: z.string().trim().max(500).optional().nullable(),
  })
  .refine((body) => Object.keys(body).length > 0, {
    message: "At least one field is required",
  });
