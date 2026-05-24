import z from "zod";

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/);

export const paymentCreateSchema = z.object({
  tableSessionId: objectIdSchema,
  method: z.enum(["cash", "banking", "momo", "vnpay", "pos"]),
  discount: z.number().min(0).optional(),
});

export const paymentUpdateSchema = z
  .object({
    status: z.enum(["pending", "paid", "failed", "refunded"]).optional(),
    transactionId: z.string().trim().optional().nullable(),
    paidAt: z.coerce.date().optional().nullable(),
  })
  .refine((body) => Object.keys(body).length > 0, {
    message: "At least one field is required",
  });
