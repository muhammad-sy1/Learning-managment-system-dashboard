"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  RefreshCw,
  Home,
  Bug,
  ChevronDown,
  Copy,
  CheckCircle2,
} from "lucide-react";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/navigation";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("error");
  const [isRetrying, setIsRetrying] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Add slight delay for UX
    reset();
    setIsRetrying(false);
  };

  const copyErrorDetails = async () => {
    const errorDetails = `Error: ${error.message}\nDigest: ${
      error.digest || "N/A"
    }\nStack: ${error.stack || "N/A"}`;
    await navigator.clipboard.writeText(errorDetails);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="max-w-2xl w-full">
        <div className="text-center space-y-8">
          {/* Error Icon with Animation */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-32 h-32 bg-destructive/10 dark:bg-destructive/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-16 h-16 text-destructive" />
              </div>
            </div>
          </div>

          {/* Error Content */}
          <div className="space-y-4">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-foreground tracking-tight">
                {t("title")}
              </h1>
              <p className="text-xl text-muted-foreground">{t("subtitle")}</p>
            </div>

            <div className="max-w-md mx-auto">
              <p className="text-muted-foreground leading-relaxed">
                {t("description")}
              </p>
            </div>

            {/* Error ID Badge */}
            {error.digest && (
              <div className="flex justify-center">
                <Badge variant="outline" className="font-mono text-xs">
                  {t("errorCode")}: {error.digest}
                </Badge>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={handleRetry}
              disabled={isRetrying}
              size="lg"
              className="w-full sm:w-auto"
            >
              {isRetrying ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {t("retry")}
                </>
              )}
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
            >
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                {t("goHome")}
              </Link>
            </Button>
          </div>

          {/* Technical Details Collapsible */}
          <div className="max-w-lg mx-auto">
            <Collapsible open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-between text-muted-foreground hover:text-foreground"
                >
                  <span className="flex items-center">
                    <Bug className="w-4 h-4 mr-2" />
                    {t("technicalDetails")}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isDetailsOpen ? "rotate-180" : ""
                    }`}
                  />
                </Button>
              </CollapsibleTrigger>

              <CollapsibleContent className="mt-4 space-y-3">
                <div className="bg-muted/50 rounded-lg p-4 text-left">
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-1">
                        {t("whatHappened")}
                      </h4>
                      <p className="text-sm text-muted-foreground font-mono bg-background/50 p-2 rounded border break-all">
                        {error.message || "Unknown error occurred"}
                      </p>
                    </div>

                    {error.digest && (
                      <div>
                        <h4 className="text-sm font-medium text-foreground mb-1">
                          {t("errorCode")}
                        </h4>
                        <p className="text-sm text-muted-foreground font-mono bg-background/50 p-2 rounded border">
                          {error.digest}
                        </p>
                      </div>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyErrorDetails}
                    className="mt-3 w-full"
                    disabled={isCopied}
                  >
                    {isCopied ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Error Details
                      </>
                    )}
                  </Button>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      </div>
    </div>
  );
}
