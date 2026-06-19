"use client";

import Loading from "@/app/[locale]/dashboard/loading";
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
import { Separator } from "@/components/ui/separator";
import Spinner from "@/components/ui/spinner";
import { ZONES_TABLE_QUERY_KEY } from "@/modules/provinces";
import { useGetZones } from "@/modules/provinces/hooks/useGetZones";
import { fetchZonesClient } from "@/modules/provinces/services/zones";
import { IZone } from "@/modules/provinces/types/zone";
import { zodResolver } from "@hookform/resolvers/zod";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { Mail, UserPlus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { USERS_TABLE_QUERY_KEY } from "../..";
import useCreateUser from "../../hooks/useCreateUser";
import { addUserSchema } from "../../schemas/addUserSchema";
import { fetchUsersClient } from "../../services/users";
import { IUser } from "../../types/users";
import UserPermissions from "../permessions/UserPermissions";
import { Switch } from "@/components/ui/switch";

export function getEnumFromUrl<T extends string>(
  searchParams: URLSearchParams,
  key: string,
  enumValues: T[],
  defaultValue: T,
): T {
  const value = searchParams.get(key);
  if (value && enumValues.includes(value as T)) return value as T;
  return defaultValue;
}

interface IProps {
  onSuccess?: () => void;
  configTranslate: Record<string, string>;
}

export default function AddUserForm({ onSuccess, configTranslate }: IProps) {
  const { mutate, isPending } = useCreateUser({ configTranslate });

  const searchParams = useSearchParams();

  const { data: zones, isLoading: isLoadingZones } = useGetZones();

  const role = searchParams.get("role");

  // const defaultValues: addUserSchema = {
  //   email: undefined,
  //   password: "",
  //   first_name: "",
  //   last_name: "",
  //   app_commession: undefined,
  //   phone_number: "",
  //   store_longitude: undefined,
  //   store_latitude: undefined,
  //   supports_custom_order: 0,
  //   role: (role ?? "CLIENT") as "CLIENT" | "MERCHANT" | "DELIVERY" | "ADMIN",
  //   image: undefined,
  //   permissions: [],
  //   store_name: "",
  //   store_type: "",
  //   store_location: "",
  //   store_category: "OTHER",
  //   is_delivery_manager: undefined,
  //   delivery_manager_id: undefined,
  //   zones_ids: [],
  // };

  const t = useTranslations("Dashboard.USERS.UsersValidation");

  const formT = useTranslations("Dashboard.USERS.UserForms.addUser");

  const form = useForm<addUserSchema>({
    resolver: zodResolver(addUserSchema(t, role)),
    mode: "onChange",
    defaultValues: {
      // is_delivery_manager: "1",
      delivery_manager_id: undefined,
      usd_to_syp_rate: null,
      zones_ids: [],
    },
    shouldUnregister: false,
  });

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

  React.useEffect(() => {
    if (isDeliveryAdmin === "1") {
      form.setValue("is_delivery_manager", undefined, {
        shouldValidate: true,
        shouldDirty: true,
      });

      form.setValue("is_delivery_office_worker", undefined, {
        shouldValidate: true,
        shouldDirty: true,
      });

      form.setValue("delivery_manager_id", undefined, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }

    if (isDeliveryManager === "1") {
      form.setValue("delivery_manager_id", undefined, {
        shouldValidate: true,
        shouldDirty: true,
      });

      form.setValue("is_delivery_office_worker", undefined, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }

    if (isDeliveryOfficeWorker === "0") {
      form.setValue("delivery_manager_id", undefined, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [isDeliveryAdmin, form, isDeliveryManager, isDeliveryOfficeWorker]);

  function onSubmit(values: addUserSchema) {
    const phoneNumber = parsePhoneNumberFromString(values.phone_number);

    const role = getEnumFromUrl(
      searchParams,
      "role",
      ["CLIENT", "MERCHANT", "DELIVERY", "ADMIN"],
      "CLIENT",
    );

    if (!phoneNumber) {
      console.error("Invalid phone number");
      return;
    }

    const payload = {
      ...values,
      zones_ids: values.zones_ids,
      country_code: phoneNumber.countryCallingCode,
      phone_number: phoneNumber.nationalNumber,
      role: role,
      app_commession: values.app_commession ?? 0,
      permissions: form.getValues("permissions"),
    };
    console.log("FORM VALUES", values);
    mutate(payload, {
      onSuccess: () => {
        if (onSuccess) {
          onSuccess();
        }
      },
    });
  }

  const handlePermissionsChange = (permissions: string[]) => {
    form.setValue("permissions", permissions);
  };

  const yesNoOptions = [
    { label: formT("yes"), value: "1" },
    { label: formT("no"), value: "0" },
  ];

  const [enabled, setEnabled] = useState(false);

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
    return <Loading customHeight="40vh" />;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, (errors) => {
          console.error("Form validation failed:", errors);
        })}
        className="space-y-6"
      >
        <fieldset disabled={isPending} className="space-y-6 py-4 px-1">
          <FormDropZone<addUserSchema>
            name="image"
            label={formT("image")}
            description={formT("imageDescription")}
          />

          {role === "MERCHANT" && (
            <>
              <FormDropZone<addUserSchema>
                name="cover_image"
                label={formT("coverImage")}
                description={formT("imageDescription")}
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

          <Separator className="my-6" />

          <div className="space-y-5">
            <FormInput<addUserSchema>
              name="first_name"
              placeholder={formT("firstNamePlaceholder")}
              label={formT("first_name")}
            />
            <FormInput<addUserSchema>
              name="last_name"
              placeholder={formT("lastNamePlaceholder")}
              label={formT("last_name")}
            />

            <FormInput<addUserSchema>
              name="email"
              placeholder={formT("emailPlaceholder")}
              label={formT("email")}
              autoComplete="email"
              Icon={<Mail className="size-4 text-muted-foreground" />}
            />

            <FormPhoneInput
              name="phone_number"
              label={formT("phoneNumber")}
              description={formT("phoneDescription")}
            />

            {role === "DELIVERY" && (
              <>
                <FormInput<addUserSchema>
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
                  // description={formT("commissionDescription")}
                />

                <FormInfiniteMultiCombobox<addUserSchema, IZone>
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

                <FormRadio<addUserSchema>
                  name="is_delivery_admin"
                  label={formT("isDeliveryAdmin")}
                  options={yesNoOptions}
                />

                {isDeliveryAdmin === "0" && (
                  <FormRadio<addUserSchema>
                    name="is_delivery_manager"
                    label={formT("isDeliveryManager")}
                    options={yesNoOptions}
                  />
                )}

                {isDeliveryManager === "0" ? (
                  <>
                    <FormRadio<addUserSchema>
                      name="is_delivery_office_worker"
                      label={formT("isDeliveryOfficeWorker")}
                      options={yesNoOptions}
                      defaultChecked={
                        isDeliveryAdmin === "1" ? undefined : undefined
                      }
                    />
                  </>
                ) : (
                  <></>
                )}

                {isDeliveryOfficeWorker === "1" ? (
                  <>
                    <FormInfiniteCombobox<addUserSchema, IUser>
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
                <FormInput<addUserSchema>
                  name="store_name"
                  placeholder={formT("storeNamePlaceholder")}
                  label={formT("store_name")}
                  description={formT("storeNameDescription")}
                />
                <FormInput<addUserSchema>
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
                {form.watch("store_type") === "MARKET" && (
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
                )}

                <GoogleMapPicker zones={zones?.data || []} />
                <FormInfiniteMultiCombobox<addUserSchema, IZone>
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
                <FormInput<addUserSchema>
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
                  description={formT("commissionDescription")}
                />

                {/* <FormCheckbox
                    name="supports_custom_order"
                    label={formT("supports_custom_order")}
                    options={[
                      {
                        value: "1",
                        label: formT("yes"),
                      },
                      {
                        value: "0",
                        label: formT("no"),
                      },
                    ]}
                  /> */}
                <FormRadio
                  name="supports_custom_order"
                  label={formT("supports_custom_order")}
                  options={[
                    {
                      value: "1",
                      label: formT("yes"),
                    },
                    {
                      value: "0",
                      label: formT("no"),
                    },
                  ]}
                />
                <FormRadio
                  name="supports_normal_order"
                  label={formT("supports_normal_order")}
                  options={[
                    {
                      value: "1",
                      label: formT("yes"),
                    },
                    {
                      value: "0",
                      label: formT("no"),
                    },
                  ]}
                />
              </>
            )}

            {role === "ADMIN" && (
              <>
                <FormPassword<addUserSchema>
                  name="password"
                  placeholder={formT("passwordPlaceholder")}
                  label={formT("password")}
                  autoComplete="new-password"
                />
                <Separator className="my-6" />
                <div className="space-y-4">
                  <UserPermissions
                    initialPermissions={[]}
                    onPermissionsChange={handlePermissionsChange}
                  />
                </div>
              </>
            )}
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
                  <span>{formT("creatingButton")}</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <UserPlus className="w-4 h-4" />
                  <span>{formT("createButton")}</span>
                </div>
              )}
            </Button>
          </div>
        </fieldset>
      </form>
    </Form>
  );
}
