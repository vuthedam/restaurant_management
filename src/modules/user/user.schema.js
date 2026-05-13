import z from "zod";
import { USER_ROLES } from "../../common/constants/user-role.enum.js";

export const userCreateSchema = z.object({
  fullName: z.string().trim().min(2).max(100).optional(),
  email: z.string().email(),
  phone: z.string().trim().optional(),
  password: z.string().min(6),
  role: z.enum([USER_ROLES.ADMIN, USER_ROLES.STAFF]).optional(),
  avatar: z.string().trim().optional().nullable(),
  isActive: z.boolean().optional(),
  lastLoginAt: z.coerce.date().optional().nullable(),
});

export const userUpdateSchema = userCreateSchema
  .omit({ password: true })
  .partial()
  .refine((body) => Object.keys(body).length > 0, {
    message: "At least one field is required",
  });
