import { cn } from "@/lib/utils";
import { JSX } from "react";

interface BoxItemProps {
  icon?: JSX.Element;
  label: string;
  value?: string | number;
  className?: string;
  gradient?: boolean;
}

export const RowItem = ({
  icon,
  label,
  value,
  className,
  gradient = true,
}: BoxItemProps) => {
  return (
    <div
      className={cn(
        "flex justify-between items-center rounded-xl border p-3 md:p-3 ",
        gradient
          ? "bg-gradient-to-r from-secondary/30 to-muted/30"
          : "bg-card/50",
        className
      )}
    >
      <div className="flex items-center gap-2 text-foreground">
        {icon && <span className="text-primary">{icon}</span>}
        <span className="font-semibold">{label}</span>
      </div>

      <span className=" text-foreground">{value || "-"}</span>
    </div>
  );
};
