// import { positiveNumber } from "@/schemas";
// import { z } from "zod";

// export const onlineAnalysisSchema = (t: (key: string) => string) =>
//     z.object({
//         minutes: positiveNumber(
//             t("fieldRequired"),
//             t("minutes.invalid"),
//         )
//     });

// export type onlineAnalysisSchema = z.input<ReturnType<typeof onlineAnalysisSchema>>;

import { z } from "zod";

export const onlineAnalysisSchema = (t: (key: string) => string) =>
  z.object({
    minutes: z.coerce
      .number()
      .int(t("minutes.invalid"))
      .positive(t("minutes.invalid")),
  });

export type OnlineAnalysisSchema = z.infer<
  ReturnType<typeof onlineAnalysisSchema>
>;