import z from "zod";

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/);

export const paymentCreateSchema = z.object({
  tableSessionId: objectIdSchema,
  orderId: objectIdSchema.optional().nullable(),
  paidBy: objectIdSchema.optional().nullable(),
  paymentCode: z.string().trim().min(1).toUpperCase(),
  amount: z.number().min(0),
  method: z.enum(["cash", "banking", "momo", "vnpay", "pos"]),
  status: z.enum(["pending", "paid", "failed", "refunded"]).optional(),
  paidAt: z.coerce.date().optional().nullable(),
  transactionId: z.string().trim().optional().nullable(),
});

export const paymentUpdateSchema = paymentCreateSchema
  .partial()
  .refine((body) => Object.keys(body).length > 0, {
    message: "At least one field is required",
  });
