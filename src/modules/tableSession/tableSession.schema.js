import z from "zod";

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/);

export const tableSessionCreateSchema = z.object({
  tableId: objectIdSchema,
  reservationId: objectIdSchema.optional().nullable(),
  customerId: objectIdSchema.optional().nullable(),
  customerName: z.string().trim().max(100).optional().nullable(),
  guestCount: z.number().int().min(1).max(30).optional(),
});

export const tableSessionUpdateSchema = z
  .object({
    customerName: z.string().trim().max(100).optional().nullable(),
    guestCount: z.number().int().min(1).max(30).optional(),
    status: z.enum(["cancelled"]).optional(),
    endedAt: z.coerce.date().optional().nullable(),
  })
  .refine((body) => Object.keys(body).length > 0, {
    message: "At least one field is required",
  });
