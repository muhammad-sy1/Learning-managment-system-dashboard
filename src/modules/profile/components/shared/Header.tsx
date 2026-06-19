import { cn } from "@/lib/utils"; // assuming you have cn utility function

interface HeaderProps {
  Icon: React.ReactNode;
  title: string;
  iconBgColor?: string;
  iconColor?: string;
  titleColor?: string;
  className?: string;
}

function Header({
  Icon,
  title,
  iconBgColor = "bg-accent",
  iconColor = "text-foreground",
  titleColor = "text-foreground",
  className,
}: HeaderProps) {
  return (
    <div className={cn("flex items-center gap-3 mb-6", className)}>
      <div
        className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center",
          iconBgColor
        )}
      >
        <span className={cn("w-5 h-5", iconColor)}>{Icon}</span>
      </div>
      <h2 className={cn("text-xl font-semibold", titleColor)}>{title}</h2>
    </div>
  );
}

export default Header;
