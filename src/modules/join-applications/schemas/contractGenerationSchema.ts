import { z } from "zod";

export const contractGenerationSchema = () =>
    z.object({
        type: z.enum(["normal", "custom", "restaurant"], {
            message: "Invalid contract type",
        }),
        "app_commission": z
            .coerce.number()
            .min(0, "Percentage must be at least 0")
            .max(100, "Percentage must not exceed 100"),
    });

export type ContractGenerationSchema = z.input<
    ReturnType<typeof contractGenerationSchema>
>;
