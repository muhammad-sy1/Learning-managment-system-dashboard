"use client";

import FormInput from "@/components/form-fields/FormInput";
import FormPassword from "@/components/form-fields/FormPassword";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import Spinner from "@/components/ui/spinner";
import { Link } from "@/i18n/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, User, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import useRegister from "../hooks/useRegister";
import { registerSchema } from "../schemas/registerSchema";

export default function RegisterForm() {
  const { mutate, isPending } = useRegister();
  const t = useTranslations("Validation");
  const tAuth = useTranslations("Auth.register");

  const form = useForm<registerSchema>({
    resolver: zodResolver(registerSchema(t)),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      password_confirmation: "",
      phone_number: "",
    },
  });

  function onSubmit(values: registerSchema) {
    mutate({
      first_name: values.first_name,
      last_name: values.last_name,
      email: values.email,
      password: values.password,
      password_confirmation: values.password_confirmation,
      phone_number: values.phone_number,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <fieldset disabled={isPending} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <FormInput<registerSchema>
              name="first_name"
              placeholder={tAuth("firstNamePlaceholder")}
              autoComplete="given-name"
              Icon={<User className="size-4" />}
            />
            <FormInput<registerSchema>
              name="last_name"
              placeholder={tAuth("lastNamePlaceholder")}
              autoComplete="family-name"
              Icon={<User className="size-4" />}
            />
          </div>

          <FormInput<registerSchema>
            name="email"
            placeholder={tAuth("emailPlaceholder")}
            autoComplete="email"
            Icon={<Mail className="size-4" />}
          />

          <FormInput<registerSchema>
            name="phone_number"
            placeholder={tAuth("phonePlaceholder")}
            autoComplete="tel"
            Icon={<Phone className="size-4" />}
          />

          <FormPassword<registerSchema>
            name="password"
            placeholder={tAuth("passwordPlaceholder")}
            autoComplete="new-password"
          />

          <FormPassword<registerSchema>
            name="password_confirmation"
            placeholder={tAuth("passwordConfirmPlaceholder")}
            autoComplete="new-password"
          />

          <Button
            disabled={isPending}
            className="w-full text-background py-4 transition rounded-md bg-foreground"
          >
            {isPending ? <Spinner /> : tAuth("registerButton")}
          </Button>
        </fieldset>
      </form>

      <div className="flex justify-center gap-2 text-sm">
        <span>{tAuth("haveAccount")}</span>
        <Link
          href="/login"
          className="text-primary hover:underline font-semibold"
        >
          {tAuth("loginLink")}
        </Link>
      </div>
    </Form>
  );
}
