// export const formatDate = (
//   dateString?: string | null,
//   locale: string = "en-GB",
// ): string => {
//   if (!dateString) return "--";

//   const date = new Date(dateString.replace(" ", "T"));
//   if (isNaN(date.getTime())) return "--";

//   return date
//     .toLocaleString(locale, {
//       timeZone: "UTC",
//       year: "numeric",
//       month: "2-digit",
//       day: "2-digit",
//       hour: "2-digit",
//       minute: "2-digit",
//       hour12: true,
//     })
//     .replace(",", " -");
// };

export const formatDate = (
  dateString?: string | null,
  locale: string = "en-GB",
): string => {
  if (!dateString) return "--";

  let normalized = dateString;

  // إذا فيه space وما فيه T → صيغة قديمة
  if (dateString.includes(" ") && !dateString.includes("T")) {
    normalized = dateString.replace(" ", "T") + "Z";
  }

  const date = new Date(normalized);
  if (isNaN(date.getTime())) return "--";

  return date
    .toLocaleString(locale, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .replace(",", " -");
};

export const formatUtcToLocal = (
  dateString?: string | null,
  locale: string = "en-GB",
): string => {
  if (!dateString) return "--";

  let normalized = dateString;

  if (dateString.includes(" ") && !dateString.includes("T")) {
    normalized = dateString.replace(" ", "T") + "Z";
  }

  const date = new Date(normalized);
  if (isNaN(date.getTime())) return "--";

  return date
    .toLocaleString(locale, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .replace(",", " -");
};


export function formatForDateTimeLocal(dateString: string): string {
  const date = new Date(
    dateString.includes(" ") ? dateString.replace(" ", "T") + "Z" : dateString
  );

  if (isNaN(date.getTime())) return "";

  const pad = (n: number) => String(n).padStart(2, "0");

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
