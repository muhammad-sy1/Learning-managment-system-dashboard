"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";
import { Undo2 } from "lucide-react";

export default function BackButton() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <Button variant="link" size="icon" onClick={handleBack}>
      <Undo2 className="!h-4 !w-4" />
    </Button>
  );
}
