"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import Spinner from "@/components/ui/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Ban, SaveIcon, UserCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import { FormRadio } from "@/components/form-fields/FormRadio";
import { useEffect } from "react";
import useUserBlockStatus from "../../hooks/useUserBlockStatus";
import {
  userBlockStatusSchema,
  UserBlockStatusSchema,
} from "../../schemas/userBlockStatusSchema";
import { IUser } from "../../types/users";

interface IProps {
  data: IUser;
  onSuccess?: () => void;
  configTranslate: Record<string, string>;
}

export default function UserBlockStatus({ onSuccess,configTranslate, data }: IProps) {
  const { mutate, isPending } = useUserBlockStatus();

  const t = useTranslations("Validation");

  const form = useForm<UserBlockStatusSchema>({
    resolver: zodResolver(userBlockStatusSchema(t)),
  });

  function onSubmit(values: UserBlockStatusSchema) {
    const blockStatus = values.block === "1" ? 1 : 0;

    mutate(
      {
        id: data.id,
        blocked_at: { block: blockStatus },
      },
      {
        onSuccess: () => {
          if (onSuccess) {
            onSuccess();
          }
        },
      }
    );
  }

  useEffect(() => {
    if (data) {
      form.reset({
        block: data.blocked_at ? "1" : "0",
      });
    }
  }, [data, form]);

  const statusOptions = [
    {
      label: configTranslate.block,
      value: "1",
      icon: <Ban className="w-4 h-4 text-red-500" />,
    },
    {
      label: configTranslate.unblock,
      value: "0",
      icon: <UserCheck className="w-4 h-4 text-green-500" />,
    },
  ];

  return (
    <div className="">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <fieldset disabled={isPending} className="space-y-6 py-4 px-1">
            <div className="space-y-5">
              <FormRadio<UserBlockStatusSchema>
                name="block"
                label={configTranslate.status}
                options={statusOptions}
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4 px-1 pb-1">
              <Button
                type="submit"
                disabled={isPending}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isPending ? (
                  <div className="flex items-center space-x-2">
                    <Spinner className="w-4 h-4" />
                    <span>{configTranslate.updateBtn}</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <SaveIcon className="w-4 h-4" />
                    <span>{configTranslate.updateBtn}</span>
                  </div>
                )}
              </Button>
            </div>
          </fieldset>
        </form>
      </Form>
    </div>
  );
}
