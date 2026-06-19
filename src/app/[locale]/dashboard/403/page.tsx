"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, ArrowLeft, Home, Shield } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AccessDeniedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="pb-4">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
            <Shield className="h-10 w-10 text-destructive" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            403 - ممنوع الوصول
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <AlertTriangle className="h-5 w-5" />
            <p>ليس لديك صلاحية للوصول إلى هذه الصفحة</p>
          </div>

          <p className="text-sm text-muted-foreground">
            يرجى التواصل مع المدير للحصول على الصلاحيات المطلوبة
          </p>

          <div className="flex flex-col gap-2 pt-4">
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="w-full"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              العودة للصفحة السابقة
            </Button>

            <Button asChild className="w-full">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                العودة للرئيسية
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
