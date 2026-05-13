import z from "zod";

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/);

export const reservationCreateSchema = z.object({
  customerId: objectIdSchema.optional().nullable(),
  assignedTableId: objectIdSchema.optional().nullable(),
  confirmedBy: objectIdSchema.optional().nullable(),
  reservationCode: z.string().trim().min(1).toUpperCase(),
  customerName: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(9).max(15),
  guestCount: z.number().int().min(1).max(30),
  reservationDate: z.coerce.date(),
  reservationTime: z.string().trim().min(1),
  reservedUntil: z.coerce.date().optional().nullable(),
  source: z.enum(["website", "phone", "walk_in", "facebook", "zalo"]).optional(),
  status: z
    .enum(["pending", "confirmed", "checked_in", "completed", "cancelled", "no_show"])
    .optional(),
  note: z.string().trim().max(500).optional().nullable(),
});

export const reservationUpdateSchema = reservationCreateSchema
  .partial()
  .refine((body) => Object.keys(body).length > 0, {
    message: "At least one field is required",
  });
