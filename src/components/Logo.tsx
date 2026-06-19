"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function Logo() {
  const t = useTranslations("Logo");

  return (
    <div className="items-start flex-col hidden sm:flex ">
      <Link
        className="flex justify-center items-center gap-2 sm:gap-4 text-black dark:text-white
                 cursor-pointer text-xl sm:text-2xl font-medium capitalize "
        href="#/"
        data-discover="true"
      >
        <span className="text-[#cccedf] dark:text-my-dark-mode-light-gray  ">
          {t("dashboard")} 
        </span>
      </Link>
    </div>
  );
}
