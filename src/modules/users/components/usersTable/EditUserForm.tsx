"use client";

import FormCheckbox from "@/components/form-fields/FormCheckbox";
import FormDropZone from "@/components/form-fields/FormDropZone";
import FormInfiniteCombobox from "@/components/form-fields/FormInfiniteCombobox";
import FormInput from "@/components/form-fields/FormInput";
import FormInfiniteMultiCombobox from "@/components/form-fields/FormMultiSelectCombobox";
import FormPassword from "@/components/form-fields/FormPassword";
import FormPhoneInput from "@/components/form-fields/FormPhoneInput";
import { FormRadio } from "@/components/form-fields/FormRadio";
import GoogleMapPicker from "@/components/map/GoogleMapPicker";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import Spinner from "@/components/ui/spinner";
import { getDirtyValues } from "@/lib/utils";
import { ZONES_TABLE_QUERY_KEY } from "@/modules/provinces";
import { useGetZones } from "@/modules/provinces/hooks/useGetZones";
import { fetchZonesClient } from "@/modules/provinces/services/zones";
import { IZone } from "@/modules/provinces/types/zone";
import { zodResolver } from "@hookform/resolvers/zod";
import parsePhoneNumberFromString from "libphonenumber-js";
import { Loader2, Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { USERS_TABLE_QUERY_KEY } from "../..";
import useUpdateUser from "../../hooks/useUpdateUser";
import { editUserSchema } from "../../schemas/editUserSchema";
import { fetchUsersClient } from "../../services/users";
import { IUser } from "../../types/users";
import UserPermissions from "../permessions/UserPermissions";
import { Switch } from "@/components/ui/switch";

interface IEditUserFormProps {
  data: IUser;
  onSuccess?: () => void;
  configTranslate: Record<string, string>;
}

const defaultValues: editUserSchema = {
  email: undefined,
  first_name: "",
  last_name: "",
  supports_custom_order: "0",
  store_longitude: undefined,
  store_latitude: undefined,
  supports_normal_order: "0",
  image: undefined,
  phone_number: "",
  password: "",
  store_category: "",
  role: "CLIENT",
  store_type: "",
  app_commession: undefined,
  permissions: [],
  is_delivery_manager: "0",
};

export default function EditUserForm({
  data,
  onSuccess,
  configTranslate,
}: IEditUserFormProps) {
  // console.log("first", data.zones);

  const { mutate, isPending } = useUpdateUser({ configTranslate });

  const { data: zones, isLoading: isLoadingZones } = useGetZones();

  const t = useTranslations("Dashboard.USERS.UsersValidation");

  const formT = useTranslations("Dashboard.USERS.UserForms.editUser");

  const searchParams = useSearchParams();

  const role = searchParams.get("role");

  const form = useForm<editUserSchema>({
    resolver: zodResolver(editUserSchema(t, role)),
    mode: "onChange",
    defaultValues,
  });

  console.log(form.watch());

  const isDeliveryManager = useWatch({
    control: form.control,
    name: "is_delivery_manager",
  });

  const isDeliveryAdmin = useWatch({
    control: form.control,
    name: "is_delivery_admin",
  });

  const isDeliveryOfficeWorker = useWatch({
    control: form.control,
    name: "is_delivery_office_worker",
  });

  function onSubmit(values: editUserSchema) {
    const dirtyValues = getDirtyValues(form.formState.dirtyFields, values);
    const payload = { ...dirtyValues };

    if (dirtyValues?.phone_number) {
      const phoneNumber = parsePhoneNumberFromString(values.phone_number!);

      if (phoneNumber) {
        payload.country_code = phoneNumber.countryCallingCode;
        payload.phone_number = phoneNumber.nationalNumber.toString();
      }
    }

    mutate(
      { id: data.id, userData: payload },
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
    if (data) {
      form.reset({
        email: data.email || undefined,
        password: undefined,
        store_latitude: data.store_latitude || undefined,
        store_longitude: data.store_longitude || undefined,
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        store_category: data.store_category || "",
        store_type: data.store_type || "",
        app_commession: data.app_commession || 0,
        store_name: data.store_name || "",
        supports_custom_order: data.supports_custom_order ? "1" : "0",
        supports_normal_order: data.supports_normal_order ? "1" : "0",
        store_location: data.store_location || "",
        phone_number: data.country_code
          ? `+${data.country_code}${data.phone_number}`
          : undefined,
        role: "CLIENT",
        image: data?.image
          ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/${data?.image}`
          : "",
        permissions: data.permissions,
        is_delivery_manager:
          data?.is_delivery_manager === 1
            ? "1"
            : data?.is_delivery_manager === 0
              ? "0"
              : undefined,
        delivery_manager_id: data?.delivery_manager?.id,
        zones_ids: data?.zones?.map((zone) => zone.id),
        is_delivery_admin: data?.is_delivery_admin === 1 ? "1" : "0",
        is_delivery_office_worker:
          data?.is_delivery_office_worker === 1 ? "1" : "0",
        usd_to_syp_rate: data?.usd_to_syp_rate || null,
      });
    }
  }, [data, form]);

  const handlePermissionsChange = (permissions: string[]) => {
    form.setValue("permissions", permissions, { shouldDirty: true });
  };

  const yesNoOptions = [
    { label: formT("yes"), value: "1" },
    { label: formT("no"), value: "0" },
  ];

  const [enabled, setEnabled] = useState(!!data?.usd_to_syp_rate);

  const handleToggle = (checked: boolean) => {
    setEnabled(checked);

    if (!checked) {
      form.setValue("usd_to_syp_rate", null, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  };

  if (isLoadingZones) {
    return (
      <div className="flex items-center justify-center min-h-40">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <fieldset disabled={isPending} className="space-y-6">
            <FormDropZone<editUserSchema>
              name="image"
              description={formT("imageDescription")}
              label={formT("imageLabel")}
            />

            {role === "MERCHANT" && (
              <>
                <FormDropZone<editUserSchema>
                  name="cover_image"
                  label={formT("coverImage")}
                />
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">
                      {formT("usdToSypRate")}
                    </label>

                    <Switch
                      dir="ltr"
                      checked={enabled}
                      onCheckedChange={handleToggle}
                    />
                  </div>

                  <FormInput
                    name="usd_to_syp_rate"
                    placeholder={formT("usdToSypRatePlaceholder")}
                    readOnly={!enabled}
                    className={!enabled ? "pointer-events-none opacity-60" : ""}
                  />
                </div>
              </>
            )}

            <FormInput<editUserSchema>
              name="first_name"
              placeholder={formT("firstNamePlaceholder")}
            />

            <FormInput<editUserSchema>
              name="last_name"
              placeholder={formT("lastNamePlaceholder")}
            />

            <FormInput<editUserSchema>
              name="email"
              placeholder={formT("emailPlaceholder")}
              Icon={<Mail className="size-4" />}
            />

            <FormPhoneInput<editUserSchema> name="phone_number" />

            {role === "DELIVERY" && (
              <>
                <FormInput<editUserSchema>
                  name="app_commession"
                  min={0}
                  type="text"
                  inputMode="decimal"
                  pattern="[0-9]*[.,]?[0-9]*"
                  onInput={(e) => {
                    e.currentTarget.value = e.currentTarget.value.replace(
                      /[^0-9.,]/g,
                      "",
                    );
                  }}
                  max={100}
                  placeholder={formT("commissionPlaceholder")}
                  label={formT("commissionLabel")}
                  // description={formT("commissionDescription")}
                />

                <FormInfiniteMultiCombobox<editUserSchema, IZone>
                  name="zones_ids"
                  className="w-full"
                  queryKey={[ZONES_TABLE_QUERY_KEY]}
                  fetchFn={async (pageNumber: number, search: string) => {
                    const result = await fetchZonesClient({
                      page: pageNumber,
                      search: search,
                    });

                    return {
                      current_page: result.current_page || 1,
                      data: result.data || [],
                      total: result.total || 0,
                      last_page: result.last_page || 1,
                    };
                  }}
                  getOptionLabel={(z) => `${z.name}`.trim()}
                  getOptionValue={(z) => z.id}
                  label={formT("selectZone")}
                  disabled={isPending}
                />

                <FormRadio<editUserSchema>
                  name="is_delivery_admin"
                  label={formT("isDeliveryAdmin")}
                  options={yesNoOptions}
                />

                {isDeliveryAdmin === "0" && (
                  <FormRadio<editUserSchema>
                    name="is_delivery_manager"
                    label={formT("isDeliveryManager")}
                    options={yesNoOptions}
                  />
                )}

                {isDeliveryManager === "0" && isDeliveryAdmin === "0" ? (
                  <>
                    <FormRadio<editUserSchema>
                      name="is_delivery_office_worker"
                      label={formT("isDeliveryOfficeWorker")}
                      options={yesNoOptions}
                      // defaultChecked={
                      //   isDeliveryAdmin === "1" ? undefined : undefined
                      // }
                    />
                  </>
                ) : (
                  <></>
                )}

                {isDeliveryOfficeWorker === "1" ? (
                  <>
                    <FormInfiniteCombobox<editUserSchema, IUser>
                      name="delivery_manager_id"
                      queryKey={[USERS_TABLE_QUERY_KEY]}
                      fetchFn={(page, search) =>
                        fetchUsersClient(
                          {
                            page,
                            search,
                            is_delivery_manager: "1",
                          },
                          "DELIVERY",
                        )
                      }
                      getOptionLabel={(deliveryManger) =>
                        deliveryManger.first_name && deliveryManger.last_name
                          ? `${deliveryManger.first_name} ${deliveryManger.last_name}`
                          : deliveryManger.phone_number
                      }
                      getOptionValue={(deliveryManger) =>
                        deliveryManger.id ?? ""
                      }
                      label={formT("setDeliveryManger")}
                      placeholder={formT("setDeliveryMangerPlaceholder")}
                      className="w-full"
                      defaultValue={isDeliveryAdmin === "1" ? undefined : ""}
                    />
                  </>
                ) : (
                  <></>
                )}
              </>
            )}

            {role === "MERCHANT" && (
              <>
                <FormInput<editUserSchema>
                  name="store_name"
                  placeholder={formT("storeNamePlaceholder")}
                  label={formT("store_name")}
                  description={formT("storeNameDescription")}
                />
                <FormInput<editUserSchema>
                  name="store_location"
                  placeholder={formT("storeLocationPlaceholder")}
                  label={formT("store_location")}
                  description={formT("storeLocationDescription")}
                />

                <FormRadio
                  name="store_type"
                  label={formT("productType")}
                  options={[
                    {
                      value: "RESTURANT",
                      label: formT("restaurant"),
                    },
                    {
                      value: "MARKET",
                      label: formT("market"),
                    },
                  ]}
                />
                {/* {form.watch("srore_type") === "MARKET" && ( */}
                <FormRadio
                  name="store_category"
                  label={formT("srore_category")}
                  options={[
                    {
                      value: "PHARMACY",
                      label: formT("PHARMACY"),
                    },
                    {
                      value: "OTHER",
                      label: formT("OTHER"),
                    },
                  ]}
                />
                {/* )} */}

                <GoogleMapPicker zones={zones?.data || []} />
                <FormInfiniteMultiCombobox<editUserSchema, IZone>
                  name="zones_ids"
                  className="w-full"
                  queryKey={[ZONES_TABLE_QUERY_KEY]}
                  fetchFn={async (pageNumber: number, search: string) => {
                    const result = await fetchZonesClient({
                      page: pageNumber,
                      search: search,
                    });

                    return {
                      current_page: result.current_page || 1,
                      data: result.data || [],
                      total: result.total || 0,
                      last_page: result.last_page || 1,
                    };
                  }}
                  getOptionLabel={(z) => `${z.name}`.trim()}
                  getOptionValue={(z) => z.id}
                  label={formT("selectZone")}
                  disabled={isPending}
                />
                <FormInput<editUserSchema>
                  name="app_commession"
                  type="text"
                  inputMode="decimal"
                  pattern="[0-9]*[.,]?[0-9]*"
                  onInput={(e) => {
                    e.currentTarget.value = e.currentTarget.value.replace(
                      /[^0-9.,]/g,
                      "",
                    );
                  }}
                  min={0}
                  max={100}
                  placeholder={formT("commissionPlaceholder")}
                  label={formT("commissionLabel")}
                  description={formT("commissionDescription")}
                />

                <FormCheckbox
                  name="supports_custom_order"
                  label={formT("supports_custom_order")}
                />
                <FormCheckbox
                  name="supports_normal_order"
                  label={formT("supports_normal_order")}
                />
              </>
            )}

            {role === "ADMIN" && (
              <>
                <FormPassword<editUserSchema>
                  name="password"
                  placeholder={formT("passwordPlaceholder")}
                />

                <div className="space-y-4">
                  <UserPermissions
                    initialPermissions={form.getValues("permissions") || []}
                    onPermissionsChange={handlePermissionsChange}
                  />
                </div>
              </>
            )}

            <div className="pb-2">
              <Button
                disabled={isPending || !form.formState.isDirty}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold  shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
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
