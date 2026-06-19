import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

const ReusableTooltip = ({
  trigger,
  tooltipContent,
}: {
  trigger: React.ReactNode;
  tooltipContent: string;
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{trigger}</TooltipTrigger>
        <TooltipContent className="max-w-sm">{tooltipContent}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ReusableTooltip;
