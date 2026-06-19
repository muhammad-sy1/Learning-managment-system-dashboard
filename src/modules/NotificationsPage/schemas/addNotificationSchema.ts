
import { z } from "zod";


export const addNotificationSchema = (t: (key: string) => string) =>
  z
    .object({
      title: z
        .string()
        .min(2, { message: t("min") }),
      body: z
        .string()
        .min(2, { message: t("min") }),
      click_action_type: z.enum([
        "default",
        "product",
        "merchant",
        "search_filters",
      ]),
      product_id: z.coerce.number().optional(),
      merchant_id: z.coerce.number().optional(),
      users_ids: z.array(z.union([z.string(), z.number()])).optional(),
      global_for_client: z.coerce.number().optional(),
      global_for_merchant: z.coerce.number().optional(),
      global_for_delivery: z.coerce.number().optional(),
      search: z.string().optional(),
      search_section_id: z.coerce.number().optional(),
      search_sub_section_id: z.coerce.number().optional(),
      search_merchant_id: z.coerce.number().optional(),
      custom_filters: z.string().optional(),
    });

export type AddNotificationFormValues = z.input<
  ReturnType<typeof addNotificationSchema>
>;
