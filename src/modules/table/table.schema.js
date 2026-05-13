import z from "zod";

export const tableCreateSchema = z.object({
  name: z.string().trim().min(1).max(50),
  code: z.string().trim().min(1).toUpperCase(),
  qrToken: z.string().trim().min(1),
  capacity: z.number().int().min(1).max(30),
  status: z
    .enum(["available", "occupied", "reserved", "waiting_payment", "inactive"])
    .optional(),
  isActive: z.boolean().optional(),
});

export const tableUpdateSchema = tableCreateSchema
  .partial()
  .refine((body) => Object.keys(body).length > 0, {
    message: "At least one field is required",
  });
