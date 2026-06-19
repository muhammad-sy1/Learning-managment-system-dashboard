import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface ReusableCardProps {
  icon?: React.ReactNode;
  title: string;
  gradientFrom?: string;
  gradientTo?: string;
  children: React.ReactNode;
  className?: string;
}

export function ReusableCard({
  icon,
  title,
  gradientFrom = "from-card",
  gradientTo = "to-card/80",
  className,
  children,
}: ReusableCardProps) {
  return (
    <Card
      className={cn(
        "relative overflow-hidden border border-border/60",
        "bg-background/80 backdrop-blur",
        "transition-all duration-300",
        "hover:-translate-y-1 hover:shadow-xl",
        className,
      )}
    >
      {/* Gradient accent */}
      <div
        className={cn(
          "absolute inset-0 opacity-10",
          "bg-gradient-to-br",
          gradientFrom,
          gradientTo,
        )}
      />

      <CardHeader className="relative pb-2">
        <CardTitle className="flex items-center gap-3 text-base font-semibold">
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-xl",
              "bg-gradient-to-br",
              gradientFrom,
              gradientTo,
              "text-white shadow-md",
            )}
          >
            {icon}
          </div>

          <span className="tracking-tight">{title}</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="relative pt-2 text-sm">{children}</CardContent>
    </Card>
  );
}
