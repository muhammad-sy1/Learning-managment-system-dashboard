"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  BookOpen,
  ClipboardList,
  ExternalLink,
  FileText,
  Layers3,
  Pencil,
  Plus,
  Trash2,
  Video,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { ResponsiveModal } from "@/components/ResponsiveModal";
import { Button } from "@/components/ui/button";
import FileDropzone from "@/components/ui/file-dropzone";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  ICourse,
  ICourseSection,
  ICourseLesson,
  ICreateCourseLessonPayload,
} from "../../types/course";
import {
  createCourseLessonClient,
  createVideoLessonClient,
  createPdfLessonClient,
  replaceVideoLessonClient,
  createCourseSectionClient,
  deleteCourseLessonClient,
  deleteCourseSectionClient,
  updateCourseLessonClient,
  updateCourseSectionClient,
  uploadLessonPdfClient,
  uploadLessonVideoClient,
  fetchCourseDetailsClient,
} from "../../services/courses";
import { AreYouSureDeleteing } from "@/components/AreYouSureDeleteing";
import useAuth from "@/modules/auth/store/authStore";
import QuizLessonModal from "./QuizLessonModal";

const lessonTypes = [
  { value: "video", label: "Video" },
  { value: "pdf", label: "PDF" },
  { value: "article", label: "Article" },
  { value: "quiz", label: "Quiz" },
];

interface SectionDraft {
  title: string;
  order_index: string;
}

interface LessonDraft {
  title: string;
  type: "video" | "pdf" | "article" | "quiz";
  video_url: string;
  duration: string;
  pdf_url: string;
  article_content: string;
  is_free_preview: boolean;
  order_index: string;
}

export default function CourseCurriculumModal({ course }: { course: ICourse }) {
  const t = useTranslations("Dashboard.CoursesPage");
  const queryClient = useQueryClient();
  const role = useAuth((state) => state.user?.role);
  const [open, setOpen] = useState(false);
  const [sectionDraft, setSectionDraft] = useState<SectionDraft>({
    title: "",
    order_index: "",
  });
  const [lessonDraft, setLessonDraft] = useState<LessonDraft>({
    title: "",
    type: "video",
    video_url: "",
    duration: "",
    pdf_url: "",
    article_content: "",
    is_free_preview: false,
    order_index: "",
  });
  const [sectionEditorId, setSectionEditorId] = useState<number | null>(null);
  const [lessonEditorId, setLessonEditorId] = useState<number | null>(null);
  const [lessonSectionId, setLessonSectionId] = useState<number | null>(null);
  const [lessonFile, setLessonFile] = useState<File | null>(null);
  const [videoFlowStep, setVideoFlowStep] = useState<
    "idle" | "creating" | "uploading" | "finalizing"
  >("idle");
  const [sectionAction, setSectionAction] = useState<
    { mode: "create" } | { mode: "edit"; section: ICourseSection } | null
  >(null);
  const [lessonAction, setLessonAction] = useState<
    | { mode: "create"; sectionId: number }
    | { mode: "edit"; sectionId: number; lesson: ICourseLesson }
    | null
  >(null);

  const curriculumQueryKey = useMemo(
    () => ["course-details", course.id, role],
    [course.id, role],
  );

  const { data, isPending } = useQuery({
    queryKey: curriculumQueryKey,
    queryFn: () => fetchCourseDetailsClient(course.id, role),
    enabled: open,
    retry: false,
  });

  const sections = (data?.data?.sections ?? []) as ICourseSection[];

  const invalidateCurriculum = () =>
    queryClient.invalidateQueries({ queryKey: curriculumQueryKey });

  const createSectionMutation = useMutation({
    mutationFn: (payload: { title: string; order_index?: number }) =>
      createCourseSectionClient(course.id, payload),
    onSuccess: () => {
      setSectionDraft({ title: "", order_index: "" });
      setSectionEditorId(null);
      setSectionAction(null);
      invalidateCurriculum();
      toast.success(t("curriculum.sectionCreated"));
    },
    onError: (error: any) => {
      toast.error(error?.message || t("curriculum.sectionCreateError"));
    },
  });

  const updateSectionMutation = useMutation({
    mutationFn: ({
      sectionId,
      payload,
    }: {
      sectionId: number;
      payload: { title: string; order_index?: number };
    }) => updateCourseSectionClient(sectionId, payload),
    onSuccess: () => {
      setSectionDraft({ title: "", order_index: "" });
      setSectionEditorId(null);
      setSectionAction(null);
      invalidateCurriculum();
      toast.success(t("curriculum.sectionUpdated"));
    },
    onError: (error: any) => {
      toast.error(error?.message || t("curriculum.sectionUpdateError"));
    },
  });

  const deleteSectionMutation = useMutation({
    mutationFn: (sectionId: number) => deleteCourseSectionClient(sectionId),
    onSuccess: () => {
      invalidateCurriculum();
      toast.success(t("curriculum.sectionDeleted"));
    },
    onError: (error: any) => {
      toast.error(error?.message || t("curriculum.sectionDeleteError"));
    },
  });

  const createLessonMutation = useMutation({
    mutationFn: ({ sectionId, payload }: { sectionId: number; payload: any }) =>
      createCourseLessonClient(sectionId, payload),
    onSuccess: () => {
      setLessonDraft({
        title: "",
        type: "video",
        video_url: "",
        duration: "",
        pdf_url: "",
        article_content: "",
        is_free_preview: false,
        order_index: "",
      });
      setLessonEditorId(null);
      setLessonSectionId(null);
      setLessonFile(null);
      setLessonAction(null);
      invalidateCurriculum();
      toast.success(t("curriculum.lessonCreated"));
    },
    onError: (error: any) => {
      toast.error(error?.message || t("curriculum.lessonCreateError"));
    },
  });

  const createVideoLessonMutation = useMutation({
    mutationFn: ({
      sectionId,
      payload,
      file,
    }: {
      sectionId: number;
      payload: ICreateCourseLessonPayload;
      file: File;
    }) => createVideoLessonClient(sectionId, payload, file, setVideoFlowStep),
    onMutate: () => setVideoFlowStep("creating"),
    onSuccess: () => {
      setVideoFlowStep("idle");
      setLessonFile(null);
      resetLessonForm();
      invalidateCurriculum();
      toast.success(t("curriculum.lessonCreated"));
    },
    onError: (error: any) => {
      setVideoFlowStep("idle");
      toast.error(error?.message || t("curriculum.lessonCreateError"));
    },
  });

  const createPdfLessonMutation = useMutation({
    mutationFn: ({
      sectionId,
      payload,
      file,
    }: {
      sectionId: number;
      payload: ICreateCourseLessonPayload;
      file: File;
    }) => createPdfLessonClient(sectionId, payload, file),
    onSuccess: () => {
      setLessonFile(null);
      resetLessonForm();
      invalidateCurriculum();
      toast.success(t("curriculum.lessonCreated"));
    },
    onError: (error: any) => {
      toast.error(error?.message || t("curriculum.lessonCreateError"));
    },
  });

  const replaceVideoLessonMutation = useMutation({
    mutationFn: ({
      lessonId,
      payload,
      file,
    }: {
      lessonId: number;
      payload: ICreateCourseLessonPayload;
      file: File;
    }) => replaceVideoLessonClient(lessonId, payload, file, setVideoFlowStep),
    onMutate: () => setVideoFlowStep("uploading"),
    onSuccess: () => {
      setVideoFlowStep("idle");
      setLessonFile(null);
      resetLessonForm();
      invalidateCurriculum();
      toast.success(t("curriculum.lessonUpdated"));
    },
    onError: (error: any) => {
      setVideoFlowStep("idle");
      toast.error(error?.message || t("curriculum.lessonUpdateError"));
    },
  });

  const updateLessonMutation = useMutation({
    mutationFn: ({ lessonId, payload }: { lessonId: number; payload: any }) =>
      updateCourseLessonClient(lessonId, payload),
    onSuccess: () => {
      setLessonDraft({
        title: "",
        type: "video",
        video_url: "",
        duration: "",
        pdf_url: "",
        article_content: "",
        is_free_preview: false,
        order_index: "",
      });
      setLessonEditorId(null);
      setLessonSectionId(null);
      setLessonFile(null);
      setLessonAction(null);
      invalidateCurriculum();
      toast.success(t("curriculum.lessonUpdated"));
    },
    onError: (error: any) => {
      toast.error(error?.message || t("curriculum.lessonUpdateError"));
    },
  });

  const deleteLessonMutation = useMutation({
    mutationFn: (lessonId: number) => deleteCourseLessonClient(lessonId),
    onSuccess: () => {
      invalidateCurriculum();
      toast.success(t("curriculum.lessonDeleted"));
    },
    onError: (error: any) => {
      toast.error(error?.message || t("curriculum.lessonDeleteError"));
    },
  });

  const uploadLessonMutation = useMutation({
    mutationFn: ({
      lessonId,
      file,
      type,
    }: {
      lessonId: number;
      file: File;
      type: "video" | "pdf";
    }) =>
      type === "video"
        ? uploadLessonVideoClient(lessonId, file)
        : uploadLessonPdfClient(lessonId, file),
    onSuccess: () => {
      setLessonFile(null);
      invalidateCurriculum();
      toast.success(t("curriculum.fileUploaded"));
    },
    onError: (error: any) => {
      toast.error(error?.message || t("curriculum.fileUploadError"));
    },
  });

  const validateSection = () => {
    if (!sectionDraft.title.trim() || sectionDraft.title.trim().length < 3) {
      toast.error(t("curriculum.sectionTitleError"));
      return false;
    }
    return true;
  };

  const validateLesson = () => {
    if (!lessonDraft.title.trim() || lessonDraft.title.trim().length < 3) {
      toast.error(t("curriculum.lessonTitleError"));
      return false;
    }

    if (!lessonDraft.type) {
      toast.error(t("curriculum.lessonTypeError"));
      return false;
    }

    if (lessonDraft.type === "video") {
      if (!lessonEditorId && !lessonFile) {
        toast.error(t("curriculum.videoFileError"));
        return false;
      }

      if (lessonEditorId && !lessonDraft.video_url.trim() && !lessonFile) {
        toast.error(t("curriculum.videoUrlError"));
        return false;
      }

      if (
        lessonEditorId &&
        !lessonFile &&
        (!lessonDraft.duration.trim() || Number(lessonDraft.duration) <= 0)
      ) {
        toast.error(t("curriculum.durationError"));
        return false;
      }
    }

    if (lessonDraft.type === "pdf" && !lessonEditorId && !lessonFile) {
      toast.error(t("curriculum.pdfFileError"));
      return false;
    }

    if (
      lessonDraft.type === "pdf" &&
      !lessonDraft.pdf_url.trim() &&
      !lessonFile
    ) {
      toast.error(t("curriculum.pdfUrlError"));
      return false;
    }

    if (
      lessonDraft.type === "article" &&
      lessonDraft.article_content.trim().length < 50
    ) {
      toast.error(t("curriculum.articleContentError"));
      return false;
    }

    return true;
  };

  const submitSection = () => {
    if (!validateSection()) return;
    const payload = {
      title: sectionDraft.title.trim(),
      order_index: sectionDraft.order_index
        ? Number(sectionDraft.order_index)
        : undefined,
    };

    if (sectionEditorId) {
      updateSectionMutation.mutate({ sectionId: sectionEditorId, payload });
      return;
    }

    createSectionMutation.mutate(payload);
  };

  const submitLesson = () => {
    if (!lessonSectionId || !validateLesson()) return;

    const payload: ICreateCourseLessonPayload = {
      title: lessonDraft.title.trim(),
      type: lessonDraft.type,
      duration:
        lessonDraft.type === "video" && lessonDraft.duration
          ? Number(lessonDraft.duration)
          : undefined,
      pdf_url: lessonDraft.pdf_url || undefined,
      article_content: lessonDraft.article_content || undefined,
      is_free_preview: lessonDraft.is_free_preview,
      order_index: lessonDraft.order_index
        ? Number(lessonDraft.order_index)
        : undefined,
    };

    if (!lessonEditorId && lessonDraft.type === "pdf" && lessonFile) {
      createPdfLessonMutation.mutate({
        sectionId: lessonSectionId,
        payload,
        file: lessonFile,
      });
      return;
    }

    if (lessonDraft.type === "video" && lessonEditorId) {
      payload.video_url = lessonDraft.video_url || undefined;
    }

    if (lessonDraft.type === "video" && lessonFile) {
      if (lessonEditorId) {
        replaceVideoLessonMutation.mutate({
          lessonId: lessonEditorId,
          payload,
          file: lessonFile,
        });
      } else {
        createVideoLessonMutation.mutate({
          sectionId: lessonSectionId,
          payload,
          file: lessonFile,
        });
      }
      return;
    }

    if (lessonEditorId) {
      updateLessonMutation.mutate({ lessonId: lessonEditorId, payload });
      return;
    }

    createLessonMutation.mutate({ sectionId: lessonSectionId, payload });
  };

  const openSectionForm = (
    mode: "create" | "edit",
    section?: ICourseSection,
  ) => {
    setSectionEditorId(section ? section.id : null);
    setSectionDraft({
      title: section?.title ?? "",
      order_index: section?.order_index ? String(section.order_index) : "",
    });
    setSectionAction(
      mode === "create"
        ? { mode: "create" }
        : { mode: "edit", section: section! },
    );
  };

  const openLessonForm = (
    mode: "create" | "edit",
    sectionId: number,
    lesson?: ICourseLesson,
  ) => {
    setLessonSectionId(sectionId);
    setLessonFile(null);
    setLessonEditorId(lesson ? lesson.id : null);
    setLessonDraft({
      title: lesson?.title ?? "",
      type: lesson?.type ?? "video",
      video_url: lesson?.video_url ?? "",
      duration: lesson?.duration ? String(lesson.duration) : "",
      pdf_url: lesson?.pdf_url ?? "",
      article_content: lesson?.article_content ?? "",
      is_free_preview: Boolean(lesson?.is_free_preview),
      order_index: lesson?.order_index ? String(lesson.order_index) : "",
    });
    setLessonAction(
      mode === "create"
        ? { mode: "create", sectionId }
        : { mode: "edit", sectionId, lesson: lesson! },
    );
  };

  const resetSectionForm = () => {
    setSectionEditorId(null);
    setSectionAction(null);
    setSectionDraft({ title: "", order_index: "" });
  };

  const resetLessonForm = () => {
    setLessonEditorId(null);
    setLessonSectionId(null);
    setLessonAction(null);
    setLessonDraft({
      title: "",
      type: "video",
      video_url: "",
      duration: "",
      pdf_url: "",
      article_content: "",
      is_free_preview: false,
      order_index: "",
    });
  };

  return (
    <ResponsiveModal
      trigger={
        <Button size="sm" variant="outline">
          {t("curriculum.button")}
        </Button>
      }
      title={t("curriculum.title", { course: course.title })}
      description={t("curriculum.description")}
      open={open}
      onOpenChange={setOpen}
      maxWidth="2xl"
      scrollable
    >
      <div className="space-y-6 pb-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Layers3 className="h-4 w-4" />
              {t("curriculum.sectionsTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md border p-3">
              <Button
                type="button"
                className="w-full"
                onClick={() => openSectionForm("create")}
              >
                <Plus className="h-4 w-4 mr-2" />
                {t("curriculum.addSection")}
              </Button>
            </div>

            <div className="space-y-4">
              {isPending && (
                <p className="text-sm text-muted-foreground">
                  {t("curriculum.loading")}
                </p>
              )}

              {!isPending && sections.length === 0 && (
                <div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
                  {t("curriculum.emptySections")}
                </div>
              )}

              {sections.map((section) => (
                <div
                  key={section.id}
                  className="rounded-md border p-3 space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 font-medium">
                      <BookOpen className="h-4 w-4" />
                      {section.title}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => openSectionForm("edit", section)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <AreYouSureDeleteing
                        onAccept={() =>
                          deleteSectionMutation.mutate(section.id)
                        }
                        title={t("curriculum.deleteSectionTitle")}
                        description={t("curriculum.deleteSectionDescription")}
                        TriggerButton={
                          <Button type="button" size="sm" variant="destructive">
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        }
                        isLoading={deleteSectionMutation.isPending}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {t("curriculum.lessonsTitle")}
                      </span>
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        onClick={() => openLessonForm("create", section.id)}
                      >
                        <Plus className="h-3.5 w-3.5" />
                        {t("curriculum.addLesson")}
                      </Button>
                    </div>

                    {section.lessons.length === 0 && (
                      <div className="rounded-md border border-dashed p-2 text-xs text-muted-foreground">
                        {t("curriculum.emptyLessons")}
                      </div>
                    )}

                    {section.lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className="rounded-md border bg-muted/20 p-2"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 text-sm font-medium min-w-0">
                            {lesson.type === "video" ? (
                              <Video className="h-3.5 w-3.5 shrink-0 text-blue-500" />
                            ) : lesson.type === "pdf" ? (
                              <FileText className="h-3.5 w-3.5 shrink-0 text-orange-500" />
                            ) : lesson.type === "quiz" ? (
                              <ClipboardList className="h-3.5 w-3.5 shrink-0 text-violet-500" />
                            ) : (
                              <AlertCircle className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                            )}
                            <span className="truncate">{lesson.title}</span>
                          </div>
                          <div className="flex shrink-0 items-center gap-1.5">
                            {lesson.type === "quiz" && (
                              <QuizLessonModal
                                lesson={lesson}
                                courseId={course.id}
                                curriculumQueryKey={curriculumQueryKey}
                              />
                            )}
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                openLessonForm("edit", section.id, lesson)
                              }
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <AreYouSureDeleteing
                              onAccept={() =>
                                deleteLessonMutation.mutate(lesson.id)
                              }
                              title={t("curriculum.deleteLessonTitle")}
                              description={t(
                                "curriculum.deleteLessonDescription",
                              )}
                              TriggerButton={
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="destructive"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              }
                              isLoading={deleteLessonMutation.isPending}
                            />
                          </div>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                          <span className="capitalize">{lesson.type}</span>
                          {lesson.duration ? (
                            <span>{lesson.duration} min</span>
                          ) : null}
                          {lesson.is_free_preview ? (
                            <span>{t("curriculum.freePreview")}</span>
                          ) : null}
                          {lesson.video_url ? (
                            <a
                              href={lesson.video_url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-primary hover:underline"
                            >
                              <ExternalLink className="h-3 w-3" />
                              {t("curriculum.viewVideo")}
                            </a>
                          ) : null}
                          {lesson.pdf_url ? (
                            <a
                              href={lesson.pdf_url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-primary hover:underline"
                            >
                              <ExternalLink className="h-3 w-3" />
                              {t("curriculum.viewPdf")}
                            </a>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {sectionAction && (
        <ResponsiveModal
          trigger
          //   ={
          //     <Button variant="outline" size="sm" className=" p-0">
          //       {t("addNotification")}
          //       <Plus className="h-4 w-4" />
          //     </Button>
          //   }
          open={Boolean(sectionAction)}
          onOpenChange={(nextOpen) => {
            if (!nextOpen) resetSectionForm();
          }}
          title={
            sectionAction.mode === "create"
              ? t("curriculum.addSection")
              : t("curriculum.editSection")
          }
          maxWidth="md"
          scrollable
        >
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>{t("curriculum.sectionName")}</Label>
              <Input
                value={sectionDraft.title}
                onChange={(e) =>
                  setSectionDraft((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
                placeholder={t("curriculum.sectionNamePlaceholder")}
              />
            </div>

            <div className="space-y-2">
              <Label>{t("curriculum.orderIndex")}</Label>
              <Input
                type="number"
                min={0}
                value={sectionDraft.order_index}
                onChange={(e) =>
                  setSectionDraft((prev) => ({
                    ...prev,
                    order_index: e.target.value,
                  }))
                }
                placeholder="0"
              />
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                onClick={submitSection}
                className="flex-1"
                disabled={
                  createSectionMutation.isPending ||
                  updateSectionMutation.isPending
                }
              >
                {createSectionMutation.isPending ||
                updateSectionMutation.isPending
                  ? t("curriculum.saving")
                  : sectionAction.mode === "create"
                    ? t("curriculum.createSection")
                    : t("curriculum.updateSection")}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={resetSectionForm}
              >
                {t("actions.cancel")}
              </Button>
            </div>
          </div>
        </ResponsiveModal>
      )}

      {lessonAction && (
        <ResponsiveModal
          trigger
          //   ={
          //     <Button variant="outline" size="sm" className=" p-0">
          //       {t("addNotification")}
          //       <Plus className="h-4 w-4" />
          //     </Button>
          //   }
          open={Boolean(lessonAction)}
          onOpenChange={(nextOpen) => {
            if (!nextOpen) resetLessonForm();
          }}
          title={
            lessonAction.mode === "create"
              ? t("curriculum.addLesson")
              : t("curriculum.editLesson")
          }
          maxWidth="md"
          scrollable
        >
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>{t("curriculum.lessonTitle")}</Label>
              <Input
                value={lessonDraft.title}
                onChange={(e) =>
                  setLessonDraft((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
                placeholder={t("curriculum.lessonTitlePlaceholder")}
              />
            </div>

            <div className="space-y-2">
              <Label>{t("curriculum.lessonType")}</Label>
              <Select
                value={lessonDraft.type}
                onValueChange={(value) =>
                  setLessonDraft((prev) => ({
                    ...prev,
                    type: value as LessonDraft["type"],
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={t("curriculum.lessonTypePlaceholder")}
                  />
                </SelectTrigger>
                <SelectContent>
                  {lessonTypes.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {lessonDraft.type === "video" && (
                <>
                  <div className="space-y-2 md:col-span-2">
                    <Label>{t("curriculum.videoFile")}</Label>
                    <FileDropzone
                      value={lessonFile ?? lessonDraft.video_url}
                      onChange={(file) => {
                        setLessonFile(file);
                        if (!file) {
                          setLessonDraft((previous) => ({
                            ...previous,
                            video_url: "",
                            duration: "",
                          }));
                        }
                      }}
                      accept={{ "video/*": [] }}
                      disabled={videoFlowStep !== "idle"}
                      placeholder={t("curriculum.videoDropzonePlaceholder")}
                      hint={t("curriculum.videoDropzoneHint")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("curriculum.duration")}</Label>
                    <Input
                      type="number"
                      min={1}
                      value={lessonDraft.duration}
                      // readOnly={Boolean(lessonFile || lessonDraft.video_url)}
                      onChange={(e) =>
                        setLessonDraft((prev) => ({
                          ...prev,
                          duration: e.target.value,
                        }))
                      }
                      placeholder={t("curriculum.durationFromVideo")}
                    />
                  </div>
                </>
              )}

              {lessonDraft.type === "pdf" && (
                <div className="space-y-2 md:col-span-2">
                  <Label>{t("curriculum.pdfFile")}</Label>
                  <FileDropzone
                    value={lessonFile ?? lessonDraft.pdf_url}
                    onChange={(file) => {
                      setLessonFile(file);
                      if (!file) {
                        setLessonDraft((previous) => ({
                          ...previous,
                          pdf_url: "",
                        }));
                      }
                    }}
                    accept={{ "application/pdf": [".pdf"] }}
                    placeholder={t("curriculum.pdfDropzonePlaceholder")}
                    hint={t("curriculum.pdfDropzoneHint")}
                    disabled={
                      uploadLessonMutation.isPending ||
                      createPdfLessonMutation.isPending
                    }
                  />
                  {lessonEditorId && (
                    <Button
                      type="button"
                      variant="outline"
                      disabled={!lessonFile || uploadLessonMutation.isPending}
                      onClick={() =>
                        lessonFile &&
                        uploadLessonMutation.mutate({
                          lessonId: lessonEditorId,
                          file: lessonFile,
                          type: "pdf",
                        })
                      }
                    >
                      {uploadLessonMutation.isPending
                        ? t("curriculum.uploading")
                        : t("curriculum.uploadPdf")}
                    </Button>
                  )}
                </div>
              )}

              {lessonDraft.type === "article" && (
                <div className="space-y-2 md:col-span-2">
                  <Label>{t("curriculum.articleContent")}</Label>
                  <Textarea
                    value={lessonDraft.article_content}
                    onChange={(e) =>
                      setLessonDraft((prev) => ({
                        ...prev,
                        article_content: e.target.value,
                      }))
                    }
                    rows={5}
                    placeholder={t("curriculum.articleContentPlaceholder")}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label>{t("curriculum.orderIndex")}</Label>
                <Input
                  type="number"
                  min={0}
                  value={lessonDraft.order_index}
                  onChange={(e) =>
                    setLessonDraft((prev) => ({
                      ...prev,
                      order_index: e.target.value,
                    }))
                  }
                  placeholder="0"
                />
              </div>

              <div className="flex items-center justify-between rounded-md border p-3 md:col-span-2">
                <div>
                  <p className="font-medium">{t("curriculum.freePreview")}</p>
                  <p className="text-sm text-muted-foreground">
                    {t("curriculum.freePreviewDescription")}
                  </p>
                </div>
                <Switch
                  checked={lessonDraft.is_free_preview}
                  onCheckedChange={(checked) =>
                    setLessonDraft((prev) => ({
                      ...prev,
                      is_free_preview: checked,
                    }))
                  }
                />
              </div>
            </div>

            <div className="flex gap-2">
              {videoFlowStep !== "idle" && (
                <div className="w-full space-y-2 rounded-md border bg-muted/30 p-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>{t(`curriculum.videoFlow.${videoFlowStep}`)}</span>
                    <span className="text-muted-foreground">
                      {videoFlowStep === "creating"
                        ? "25%"
                        : videoFlowStep === "uploading"
                          ? "65%"
                          : "90%"}
                    </span>
                  </div>
                  <Progress
                    value={
                      videoFlowStep === "creating"
                        ? 25
                        : videoFlowStep === "uploading"
                          ? 65
                          : 90
                    }
                  />
                </div>
              )}
              <Button
                type="button"
                onClick={submitLesson}
                disabled={
                  createLessonMutation.isPending ||
                  updateLessonMutation.isPending ||
                  createVideoLessonMutation.isPending ||
                  createPdfLessonMutation.isPending ||
                  replaceVideoLessonMutation.isPending ||
                  videoFlowStep !== "idle"
                }
                className="flex-1"
              >
                {createLessonMutation.isPending ||
                updateLessonMutation.isPending ||
                createVideoLessonMutation.isPending ||
                createPdfLessonMutation.isPending ||
                replaceVideoLessonMutation.isPending
                  ? t("curriculum.saving")
                  : lessonAction.mode === "create"
                    ? t("curriculum.createLesson")
                    : t("curriculum.updateLesson")}
              </Button>
              <Button type="button" variant="outline" onClick={resetLessonForm}>
                {t("actions.cancel")}
              </Button>
            </div>
          </div>
        </ResponsiveModal>
      )}
    </ResponsiveModal>
  );
}
