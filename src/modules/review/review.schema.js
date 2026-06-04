import z from "zod";

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/);

export const reviewCreateSchema = z.object({
  table_session_id: objectIdSchema.optional(),
  tableSessionId: objectIdSchema.optional(),
  order_id: objectIdSchema.optional().nullable(),
  orderId: objectIdSchema.optional().nullable(),
  food_rating: z.number().int().min(1).max(5).optional(),
  foodRating: z.number().int().min(1).max(5).optional(),
  service_rating: z.number().int().min(1).max(5).optional(),
  serviceRating: z.number().int().min(1).max(5).optional(),
  ambiance_rating: z.number().int().min(1).max(5).optional(),
  ambianceRating: z.number().int().min(1).max(5).optional(),
  comment: z.string().trim().max(1000).optional().nullable(),
}).refine((data) => {
  return !!(data.table_session_id || data.tableSessionId);
}, {
  message: "table_session_id or tableSessionId is required",
  path: ["table_session_id"],
}).refine((data) => {
  return (
    (data.food_rating !== undefined || data.foodRating !== undefined) &&
    (data.service_rating !== undefined || data.serviceRating !== undefined) &&
    (data.ambiance_rating !== undefined || data.ambianceRating !== undefined)
  );
}, {
  message: "food_rating, service_rating, and ambiance_rating are required",
  path: ["food_rating"],
});

export const reviewUpdateSchema = reviewCreateSchema
  .partial()
  .refine((body) => Object.keys(body).length > 0, {
    message: "At least one field is required",
  });
