"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { forgotPasswordSchema } from "../schemas/forgotPasswordSchema";
import { Form } from "@/components/ui/form";
import FormInput from "@/components/form-fields/FormInput";
import { Button } from "@/components/ui/button";
import useForgotPassword from "../hooks/useForgotPassword";
import { useTranslations } from "next-intl";
import useTimer from "../store/timerStore";
import { FORGOT_PASSWORD_DURATION } from "..";
import Spinner from "@/components/ui/spinner";
import { Link } from "@/i18n/navigation";

export default function ForgotPasswordForm() {
  const { mutate, isPending } = useForgotPassword();
  const t = useTranslations("Validation");
  const tAuth = useTranslations("Auth.forgotPassword");
  const { start } = useTimer();

  const form = useForm<forgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema(t)),
    defaultValues: {
      email: "",
      type: "reset",
    },
  });
  function onSubmit(values: forgotPasswordSchema) {
    mutate(values, {
      onSuccess: (data) => {
        start(data?.can_resend_after ?? FORGOT_PASSWORD_DURATION);
      },
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormInput<forgotPasswordSchema>
          control={form.control}
          name="email"
          placeholder={tAuth("emailPlaceholder")}
          autoComplete="email"
        />
        <div className="flex justify-between items-center">
          <Button
            disabled={isPending}
            className="text-background py-4 transition rounded-md cursor-pointer bg-foreground"
          >
            {isPending ? <Spinner /> : tAuth("sendVerifyCode")}
          </Button>

          <Link href="/login" className="text-primary hover:underline">
            {tAuth("backToLogin")}
          </Link>
        </div>
      </form>
    </Form>
  );
}
