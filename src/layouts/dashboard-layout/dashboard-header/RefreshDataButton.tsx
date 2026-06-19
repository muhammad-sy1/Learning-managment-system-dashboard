"use client";
import { Button } from "@/components/ui/button";
import { handleRefresh } from "@/lib/react-query/queryClient";
import { RefreshCcw } from "lucide-react";

export default function RefreshDataButton() {
  return (
    <Button
      size="icon"
      variant="link"
      title="Refresh Data"
      onClick={handleRefresh}
    >
      <RefreshCcw className="!h-4 !w-4" />
    </Button>
  );
}
