"use client";

import FormCheckbox from "@/components/form-fields/FormCheckbox";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import Spinner from "@/components/ui/spinner";
import { getDirtyValues } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import useUpdateRoleUser from "../../hooks/useUpdateRoleUser";
import { IUser } from "../../types/users";
import { editRoleUserSchema } from "../../schemas/editRoleUserSchema";

interface IEditUserFormProps {
  data: IUser;
  onSuccess?: () => void;
  configTranslate: Record<string, string>;
}

export default function UpdateUserRole({
  data,
  onSuccess,
  configTranslate,
}: IEditUserFormProps) {
  const { mutate, isPending } = useUpdateRoleUser({ configTranslate });

  const t = useTranslations("Validation");
  const formT = useTranslations("Dashboard.USERS.UserForms.editUser");
  const ROLE_OPTIONS = [
    { value: "CLIENT", label: formT("CLIENT") },
    { value: "DELIVERY", label: formT("DELIVERY") },
    { value: "MERCHANT", label: formT("MERCHANT") },
  ];
  const form = useForm<editRoleUserSchema>({
    resolver: zodResolver(editRoleUserSchema(t)),
    mode: "onChange",
  });

  function onSubmit(values: editRoleUserSchema) {
    const dirtyValues = getDirtyValues(form.formState.dirtyFields, values);

    // Ensure we have at least an empty object if dirtyValues is undefined
    const safeDirtyValues = dirtyValues || {};

    // Ensure roles is always an array
    if (safeDirtyValues?.roles) {
      safeDirtyValues.roles = Array.isArray(safeDirtyValues.roles)
        ? safeDirtyValues.roles
        : [];
    }

    mutate(
      {
        id: data.id,
        userData: safeDirtyValues as Partial<editRoleUserSchema>, // Explicit cast
      },
      {
        onSuccess: () => {
          if (onSuccess) {
            onSuccess();
          }
        },
      },
    );
  }

  useEffect(() => {
    form.reset({
      roles: data.roles || undefined,
    });
  }, [data, form]);
  return (
    <div className="pt-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <fieldset disabled={isPending} className="space-y-6">
            <FormCheckbox
              name="roles"
              label={formT("roles")}
              description={formT("roles_description")}
              options={ROLE_OPTIONS}
              orientation="horizontal"
            />

            <div className="py-2 px-4">
              <Button
                disabled={isPending || !form.formState.isDirty}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                type="submit"
              >
                {isPending ? (
                  <div className="flex items-center space-x-2">
                    <Spinner />
                    <span>{formT("updatingButton")}</span>
                  </div>
                ) : (
                  formT("updateButton")
                )}
              </Button>
            </div>
          </fieldset>
        </form>
      </Form>
    </div>
  );
}
