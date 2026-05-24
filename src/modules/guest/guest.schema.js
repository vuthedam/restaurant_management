import z from "zod";

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/);

export const guestPlaceOrderSchema = z.object({
  qrToken: z.string().trim().min(1),
  items: z
    .array(
      z.object({
        menuItemId: objectIdSchema,
        quantity: z.number().int().min(1).max(100),
        note: z.string().trim().max(300).optional().nullable(),
      }),
    )
    .min(1),
  note: z.string().trim().max(500).optional().nullable(),
});

export const guestReservationSchema = z.object({
  customerName: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(9).max(15),
  guestCount: z.number().int().min(1).max(30),
  reservationDate: z.coerce.date(),
  reservationTime: z.string().trim().min(1),
  note: z.string().trim().max(500).optional().nullable(),
});
