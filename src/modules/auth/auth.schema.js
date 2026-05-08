import z from "zod";

export const registerAuthSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().min(2),
  phone: z.string().optional(),
});

export const loginAuthSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
