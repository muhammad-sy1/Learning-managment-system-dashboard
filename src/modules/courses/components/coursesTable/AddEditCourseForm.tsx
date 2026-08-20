"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form } from "@/components/ui/form";
import FormInput from "@/components/form-fields/FormInput";
import FormSelect from "@/components/form-fields/FormSelect";
import FormInfiniteCombobox from "@/components/form-fields/FormInfiniteCombobox";
import Spinner from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { ICourse, ICreateCoursePayload } from "../../types/course";
import useCreateCourse from "../../hooks/useCreateCourse";
import useUpdateCourse from "../../hooks/useUpdateCourse";
import { fetchCategoriesClient } from "@/modules/categories/services/categories";
import { uploadCoursePromoVideoClient } from "../../services/courses";
import { toast } from "sonner";

const levels = [
  { label: "Beginner", value: "beginner" },
  { label: "Intermediate", value: "intermediate" },
  { label: "Advanced", value: "advanced" },
];

const languages = [
  { label: "Arabic", value: "arabic" },
  { label: "English", value: "english" },
  { label: "Both", value: "both" },
];

export default function AddEditCourseForm({
  course,
  onSuccess,
}: {
  course?: ICourse | null;
  onSuccess?: () => void;
}) {
  const t = useTranslations("Dashboard.CoursesPage");
  const create = useCreateCourse();
  const update = useUpdateCourse();
  const [promoVideo, setPromoVideo] = useState<File | null>(null);
  const uploadPromoMutation = useMutation({
    mutationFn: (file: File) => uploadCoursePromoVideoClient(course!.id, file),
    onSuccess: () => {
      setPromoVideo(null);
      toast.success(t("courseMediaUploaded"));
    },
    onError: (error: any) =>
      toast.error(error?.message || t("courseMediaUploadError")),
  });

  const defaultValues: Partial<ICreateCoursePayload> = {
    title: course?.title || "",
    description: course?.description || "",
    status: course?.status || "draft",
    level: course?.level || "beginner",
    language: course?.language || "arabic",
    is_free: course?.is_free ?? true,
    price: course?.price ?? 0,
    category_id: undefined,
  };

  const form = useForm<any>({
    defaultValues,
    resolver: undefined,
    mode: "onChange",
  });

  const isFree = form.watch("is_free");

  function onSubmit(values: any) {
    const payload: ICreateCoursePayload = {
      title: values.title,
      description: values.description,
      status: values.status,
      level: values.level,
      language: values.language,
      is_free: Boolean(values.is_free),
      price: values.is_free ? 0 : Number(values.price || 0),
      category_id: values.category_id || null,
    };

    if (course) {
      update.mutate(
        { id: course.id, payload },
        { onSuccess: () => onSuccess?.() },
      );
    } else {
      create.mutate(payload, { onSuccess: () => onSuccess?.() });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <fieldset
          disabled={create.isPending || update.isPending}
          className="space-y-4"
        >
          <FormInput
            name="title"
            label={t("fields.title")}
            placeholder={t("fields.titlePlaceholder")}
          />

          <FormInput
            name="description"
            label={t("fields.description")}
            placeholder={t("fields.descriptionPlaceholder")}
          />

          {/* <FormSelect
            name="status"
            label={t("fields.status")}
            options={[
              { label: t("statuses.draft"), value: "draft" },
              { label: t("statuses.published"), value: "published" },
              { label: t("statuses.pending_review"), value: "pending_review" },
            ]}
            control={form.control}
          /> */}

          <FormSelect
            name="level"
            label={t("fields.level")}
            options={levels}
            control={form.control}
          />

          <FormSelect
            name="language"
            label={t("fields.language")}
            options={languages}
            control={form.control}
          />

          <div className="flex items-center justify-between rounded-md border p-3">
            <div>
              <p className="font-medium">{t("fields.isFree")}</p>
              <p className="text-sm text-muted-foreground">
                {t("fields.isFreeDescription")}
              </p>
            </div>
            <Switch
              checked={Boolean(form.watch("is_free"))}
              onCheckedChange={(checked) =>
                form.setValue("is_free", checked, { shouldDirty: true })
              }
            />
          </div>

          <FormInput
            name="price"
            type="number"
            label={t("fields.price")}
            disabled={Boolean(isFree)}
            min={0}
          />

          <FormInfiniteCombobox
            name="category_id"
            queryKey={["categories"]}
            fetchFn={async () => {
              const res = await fetchCategoriesClient();
              const list = Array.isArray(res)
                ? res
                : Array.isArray(res?.data)
                  ? res.data
                  : Array.isArray(res?.data?.data)
                    ? res.data.data
                    : [];

              return {
                current_page: 1,
                total: list.length,
                last_page: 1,
                data: list,
              } as IPaginatedResponse<any>;
            }}
            getOptionLabel={(cat: any) => cat.name}
            getOptionValue={(cat: any) => cat.id}
            label={t("fields.category")}
            placeholder={t("fields.categoryPlaceholder")}
          />

          {course && (
            <div className="space-y-3 rounded-md border p-3">
              <p className="font-medium">{t("coursePromoVideo")}</p>
              {course.promo_video && (
                <video
                  controls
                  className="max-h-48 w-full rounded-md"
                  src={course.promo_video}
                />
              )}
              <Input
                type="file"
                accept="video/*"
                onChange={(event) =>
                  setPromoVideo(event.target.files?.[0] ?? null)
                }
              />
              <Button
                type="button"
                variant="outline"
                disabled={!promoVideo || uploadPromoMutation.isPending}
                onClick={() =>
                  promoVideo && uploadPromoMutation.mutate(promoVideo)
                }
              >
                {uploadPromoMutation.isPending
                  ? t("curriculum.uploading")
                  : t("curriculum.uploadVideo")}
              </Button>
            </div>
          )}
          <div>
            <Button type="submit" className="w-full">
              {create.isPending || update.isPending ? (
                <div className="flex items-center gap-2">
                  <Spinner />
                  <span>{t("actions.save")}</span>
                </div>
              ) : (
                <span>{t("actions.save")}</span>
              )}
            </Button>
          </div>
        </fieldset>
      </form>
    </Form>
  );
}
