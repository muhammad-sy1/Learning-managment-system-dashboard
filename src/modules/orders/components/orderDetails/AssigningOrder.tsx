"use client";

import { ReusableCard } from "@/components/ReusableCard";
import { useTranslations } from "next-intl";
import { IOrderByID } from "../../types/orders";
import { Phone, SendToBack } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FormInfiniteCombobox from "@/components/form-fields/FormInfiniteCombobox";
import { setAssignOrder, SetAssignOrder } from "../../schemas/setAssignOrder";
import { ORDER_BY_ID_TABLE_QUERY_KEY } from "../..";
import { fetchUsersClient } from "@/modules/users/services/users";
import { IUser } from "@/modules/users/types/users";
import { Form } from "@/components/ui/form";
import useAssignOrder from "../../hooks/useAssignOrder";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";

interface Props {
  data: IOrderByID;
}

const AssigningOrder = ({ data }: Props) => {
  const t = useTranslations("Dashboard.OrdersPage.orderDetails");
  const delivery = data.delivery;

  const initials =
    (delivery?.first_name?.charAt(0) ?? "") +
    (delivery?.last_name?.charAt(0) ?? "");

  const { mutate, isPending } = useAssignOrder();

  const form = useForm<SetAssignOrder>({
    resolver: zodResolver(setAssignOrder()),
  });
  function onSubmit(value: SetAssignOrder) {
    mutate({
      orderId: data.id, // id الطلب
      delivery_id: Number(value.delivery_id),
    });
  }

  return (
    <ReusableCard
      icon={<SendToBack className="h-6 w-6" />}
      title={t("sections.receiverInfo")}
    >
      <div className="relative space-y-6">
        {delivery && (
          <Card>
            <CardHeader>
              <CardTitle>بيانات المستلم</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                {delivery.image ? (
                  <AvatarImage src={delivery.image} alt="receiver" />
                ) : (
                  <AvatarFallback>{initials}</AvatarFallback>
                )}
              </Avatar>

              <div className="space-y-1">
                <div className="font-medium">
                  {delivery.first_name} {delivery.last_name}
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  {delivery.phone_number_e164}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        {(data.status === "PREPARING" || data.status === "PROCESSING") && (
          <div>
            {/* <FormInfiniteCombobox<SetAssignOrder, IDelivery>
              name="delivery_id"
              label="delivery"
            /> */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit, (errors) => {
                  console.error("Form validation failed:", errors);
                })}
                className="space-y-6"
              >
                <FormInfiniteCombobox<SetAssignOrder, IUser>
                  name="delivery_id"
                  queryKey={[ORDER_BY_ID_TABLE_QUERY_KEY]}
                  fetchFn={(page, search) =>
                    fetchUsersClient({ page, search, role: "DELIVERY" })
                  }
                  getOptionLabel={(delivery) =>
                    delivery.first_name && delivery.last_name
                      ? `${delivery.first_name} ${delivery.last_name}`
                      : delivery.phone_number
                  }
                  getOptionValue={(delivery) => delivery.id ?? ""}
                  label={t("setDelivery")}
                  placeholder={t("setDeliveryPlaceholder")}
                  className="w-full"
                  // disabled={!hasPermission("deliverys.view")}
                />

                <Button
                  type="submit"
                  variant="default"
                  className="text-white"
                  disabled={isPending}
                >
                  {isPending && (
                    <span className="loading loading-spinner"></span>
                  )}
                  {t("setDelivery")}
                </Button>
              </form>
            </Form>
          </div>
        )}
      </div>
    </ReusableCard>
  );
};

export default AssigningOrder;
