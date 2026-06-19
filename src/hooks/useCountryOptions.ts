"use client";

import { useLocale } from "next-intl";
import { getCountries } from "react-phone-number-input";
import en from "react-phone-number-input/locale/en.json";
import ar from "react-phone-number-input/locale/ar.json";

const locales = { en, ar };
function useCountryOptions() {
  const locale = useLocale();
  const messages = locales[locale as keyof typeof locales] || locales.en;
  return getCountries().map((country) => ({
    value: country,
    label: messages[country] || country,
  }));
}
export default useCountryOptions;
