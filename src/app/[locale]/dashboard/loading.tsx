import { Package } from "lucide-react";
interface LoadingProps {
  customHeight?: string;
  text?: string;
}
export default function Loading({
  customHeight = "min-h-screen",
  text,
}: LoadingProps) {
  return (
    <div className={`flex items-center justify-center ${customHeight}`}>
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Package className="w-6 h-6 text-primary animate-pulse" />
          </div>
        </div>
        {text && (
          <div className="text-center">
            <p className="text-lg font-medium text-foreground">{text}</p>
          </div>
        )}
      </div>
    </div>
  );
}
