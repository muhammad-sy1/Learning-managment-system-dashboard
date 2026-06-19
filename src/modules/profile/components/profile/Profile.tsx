"use client";

import FormDropZone from "@/components/form-fields/FormDropZone";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import Spinner from "@/components/ui/spinner";
import { getDirtyValues } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import parsePhoneNumberFromString from "libphonenumber-js";
import { Save } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import useUpdateProfile from "../../hooks/useUpdateProfile";
import { profileSchema } from "../../schemas/profileSchema";
import ChangePasswordForm from "../changePassword/ChangePasswordForm";
import ProfileBasicInfoForm from "../profileForm/ProfileBasicInfoForm";
import { usePermissionStore } from "@/hooks/usePermissionStore";

const defaultValues: profileSchema = {
  email: "",
  first_name: "",
  last_name: "",
  image: undefined,
  phone_number: "",
  current_password: "",
  password: "",
  confirm_password: "",
};

const Profile = () => {
  // const { data: profile } = useGetProfile();
  const profile = usePermissionStore((state) => state.user);

  const { mutate: updateProfile, isPending } = useUpdateProfile();

  const t = useTranslations("Validation");

  const profileT = useTranslations("Dashboard.profile");

  const form = useForm<profileSchema>({
    resolver: zodResolver(profileSchema(t)),
    defaultValues,
  });

  // console.log(form.watch());

  function onSubmit(values: profileSchema) {
    // const dirtyValues = getDirtyValues(form.formState.dirtyFields, values);
    const dirtyValues =
      getDirtyValues(form.formState.dirtyFields, values) ?? {};
    let phoneNumber;
    if (values.phone_number) {
      phoneNumber = parsePhoneNumberFromString(values.phone_number);
    }
    // if (!phoneNumber) {
    //   console.error("Invalid phone number");
    //   return;
    // }
    const payload = {
      ...dirtyValues,
      ...(phoneNumber && {
        country_code: phoneNumber.countryCallingCode,
      }),
      ...(phoneNumber && { phone_number: phoneNumber.nationalNumber }),
    };
    updateProfile(payload);
  }

  useEffect(() => {
    if (profile) {
      form.reset({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        email: profile.email,

        image: profile.image
          ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/${profile.image}`
          : "",
        phone_number: profile.country_code
          ? `+${profile.country_code}${profile.phone_number}`
          : "",
        confirm_password: "",
        current_password: "",
        password: "",
      });
    }
  }, [profile, form]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {profileT("title")}
          </h1>
          <p className="text-muted-foreground">{profileT("description")}</p>
        </div>

        {/* Single Profile Card */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormDropZone<profileSchema> name="image" />

            <ProfileBasicInfoForm />

            <div className="border-t border-border my-8"></div>

            <ChangePasswordForm />

            <Button
              disabled={isPending || !form.formState.isDirty}
              className="text-background py-4 transition rounded-md bg-foreground mt-8"
            >
              {isPending ? (
                <Spinner />
              ) : (
                <>
                  <Save className="w-10" />
                  {profileT("saveAllChanges")}
                </>
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Profile;
