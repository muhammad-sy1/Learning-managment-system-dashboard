"use client";

import React from "react";
import { useTranslations } from "next-intl";

function Note() {
  const t = useTranslations("Profile");

  return (
    <div className="mt-8 bg-muted border border-border rounded-lg p-4">
      <p className="text-sm text-muted-foreground">
        <strong className="text-foreground">{t("noteLabel")}</strong>{" "}
        {t("passwordNote")}
      </p>
    </div>
  );
}

export default Note;
