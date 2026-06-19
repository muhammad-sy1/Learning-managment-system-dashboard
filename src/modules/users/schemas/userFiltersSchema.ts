import { z } from "zod";

export const UserFiltersSchema = z.object({
  page: z.preprocess(
    (val) => Number(val),
    z.number().int().positive().optional(),
  ),

  role: z.string().optional(),
  search: z.string().optional(),
  roles: z.string().optional(),
  first_name: z.string().optional(),
  email: z.string().optional(),
  country_id: z.string().optional(),
  account_type_id: z.string().optional(),
  specialty_id: z.string().optional(),
  sub_specialty_ids: z.union([z.string(), z.array(z.string())]).optional(),
  city_id: z.string().optional(),
  user: z.string().optional(),
  is_delivery_manager: z.union([z.literal("0"), z.literal("1")]).optional(),
});

export type UserFiltersSchema = z.infer<typeof UserFiltersSchema>;
