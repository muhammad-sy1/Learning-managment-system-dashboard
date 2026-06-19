"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";
import { useTranslations } from "next-intl";
import FormOTPInput from "@/components/form-fields/FormOTPInput";
import { verifyCodeSchema } from "../schemas/verifyCodeSchema";

import { useSearchParams } from "next/navigation";
import useVerifyCode from "../hooks/useVerifyCode";
import ResendCode from "./resend/ResendCode";
import { Link } from "@/i18n/navigation";

export default function VerifyCode() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const t = useTranslations("Validation");
  const tAuth = useTranslations("Auth.verifyCode"); 
  const { mutate, isPending } = useVerifyCode();
  

  const form = useForm<verifyCodeSchema>({
    resolver: zodResolver(verifyCodeSchema(t)),
    defaultValues: {
      email: email,
      code: "",
    },
  });
  
  function onSubmit(values: verifyCodeSchema) {
    mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormOTPInput
          control={form.control}
          name="code"
          slotClassName="size-20 text-4xl"
          className="text-4xl"
          slotCount={4}
        />
        <Button
          disabled={isPending}
          className="w-full text-background py-4 transition rounded-md cursor-pointer bg-foreground"
          type="submit"
        >
          {isPending ? <Spinner /> : tAuth("verifyButton")}
        </Button>
      </form>
      <div className="flex justify-between items-center">
        <Link href="/login" className="text-primary hover:underline">
          {tAuth("backToLogin")}
        </Link>
        <ResendCode type="reset" />
      </div>
    </Form>
  );
}
