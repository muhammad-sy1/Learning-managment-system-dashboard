"use client";
import { ResponsiveModal } from "@/components/ResponsiveModal";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useState } from "react";

interface CommentCellProps {
  comment: string;
  maxLength?: number;
}

export default function CommentCell({
  comment,
  maxLength = 30,
}: CommentCellProps) {
  const [open, setOpen] = useState(false);
  const t = useTranslations("General");
  // console.log("commentcommentcommentcommentcomment", comment);
  const isLong = comment?.length > maxLength;
  const shortComment = isLong ? comment.slice(0, maxLength) + "..." : comment;

  const isChangeSummary =
    /(تم تغيير|تمت إضافة|تمت إزالة|changed|added|removed)/i.test(comment);

  const parsedSummary = isChangeSummary
    ? comment
        .split("•")
        .map((part) => part.trim())
        .filter(Boolean)
    : [];

  return (
    <div className="flex justify-center items-start gap-1">
      <span className="truncate text-sm text-muted-foreground">
        {shortComment}
      </span>

      {isLong && (
        <ResponsiveModal
          trigger={
            <Button
              variant="link"
              size="sm"
              className="h-auto px-0 text-blue-500 text-[12px]"
            >
              {t("show_more")}
            </Button>
          }
          title={t("show_more")}
          maxWidth="sm"
          height="auto"
          open={open}
          onOpenChange={setOpen}
        >
          {isChangeSummary ? (
            <div className="space-y-3 pb-4 pt-6 text-sm whitespace-pre-wrap">
              {parsedSummary.map((item, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-2 border-b border-muted/30 pb-2 last:border-0 last:pb-0 text-muted-foreground`}
                >
                  <span className="font-semibold mt-[2px]">•</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="pb-4 pt-6 text-sm text-muted-foreground ">
              {comment}
            </div>
          )}
        </ResponsiveModal>
      )}
    </div>
  );
}
