import z from "zod";

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/);

export const tableSessionCreateSchema = z.object({
  tableId: objectIdSchema,
  reservationId: objectIdSchema.optional().nullable(),
  customerId: objectIdSchema.optional().nullable(),
  createdBy: objectIdSchema,
  customerName: z.string().trim().max(100).optional().nullable(),
  guestCount: z.number().int().min(1).max(30).optional(),
  status: z
    .enum(["active", "waiting_payment", "paid", "closed", "cancelled"])
    .optional(),
  startedAt: z.coerce.date().optional(),
  endedAt: z.coerce.date().optional().nullable(),
});

export const tableSessionUpdateSchema = tableSessionCreateSchema
  .partial()
  .refine((body) => Object.keys(body).length > 0, {
    message: "At least one field is required",
  });
