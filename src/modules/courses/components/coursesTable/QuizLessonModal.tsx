"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BookOpen,
  CheckCircle2,
  Circle,
  ClipboardList,
  Clock,
  HelpCircle,
  Pencil,
  Plus,
  Settings2,
  Target,
  Trash2,
  Trophy,
  XCircle,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { ResponsiveModal } from "@/components/ResponsiveModal";
import { AreYouSureDeleteing } from "@/components/AreYouSureDeleteing";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  ICreateQuizPayload,
  ICreateQuizQuestionPayload,
  ICourseLesson,
  IQuiz,
  IQuizQuestion,
  QuestionType,
  QuizType,
} from "../../types/course";
import {
  addQuizQuestionClient,
  createLessonQuizClient,
  deleteQuizClient,
  deleteQuizQuestionClient,
  fetchLessonQuizzesClient,
  updateQuizQuestionClient,
} from "../../services/courses";

// ─── Local Types ──────────────────────────────────────────────────────────────

interface OptionDraft {
  text: string;
  is_correct: boolean;
}

interface QuestionDraft {
  text: string;
  type: QuestionType;
  explanation: string;
  options: OptionDraft[];
}

interface QuizSettingsDraft {
  type: QuizType;
  title: string;
  passing_score: string;
  time_limit_seconds: string;
  max_attempts: string;
  pool_size: string;
}

const TRUE_FALSE_OPTIONS: OptionDraft[] = [
  { text: "True", is_correct: true },
  { text: "False", is_correct: false },
];

const BLANK_QUESTION: QuestionDraft = {
  text: "",
  type: "mcq",
  explanation: "",
  options: [
    { text: "", is_correct: false },
    { text: "", is_correct: false },
  ],
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface QuizLessonModalProps {
  lesson: ICourseLesson;
  courseId: number;
  curriculumQueryKey: unknown[];
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function QuizLessonModal({
  lesson,
  courseId,
  curriculumQueryKey,
}: QuizLessonModalProps) {
  const t = useTranslations("Dashboard.CoursesPage");
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  // which quiz is selected for question management
  const [selectedQuizId, setSelectedQuizId] = useState<number | null>(null);
  const [questionAction, setQuestionAction] = useState<
    | { mode: "create" }
    | { mode: "edit"; question: IQuizQuestion }
    | null
  >(null);

  // ─── Fetch all quizzes for this lesson ──────────────────────────────────────
  const quizzesQueryKey = ["lesson-quizzes", lesson.id];

  const { data: quizzesData, isPending: quizzesLoading } = useQuery({
    queryKey: quizzesQueryKey,
    // calls GET /api/lessons/quizzes?lesson_id={id}
    queryFn: () => fetchLessonQuizzesClient(lesson.id),
    enabled: open,
    retry: false,
  });

  const quizzes: IQuiz[] = (quizzesData as { data?: IQuiz[] } | null)?.data ?? [];

  // auto-select first quiz when list loads
  useEffect(() => {
    if (quizzes.length > 0 && selectedQuizId === null) {
      setSelectedQuizId(quizzes[0].id);
    }
  }, [quizzes]);

  // reset selected quiz when modal closes
  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) {
      setSelectedQuizId(null);
      setQuestionAction(null);
    }
  };

  const selectedQuiz = quizzes.find((q) => q.id === selectedQuizId) ?? null;

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: quizzesQueryKey });
    queryClient.invalidateQueries({ queryKey: curriculumQueryKey });
  };

  // ─── Mutations ────────────────────────────────────────────────────────────

  const createQuizMutation = useMutation({
    mutationFn: (payload: ICreateQuizPayload) =>
      createLessonQuizClient(lesson.id, payload),
    onSuccess: (res: any) => {
      invalidate();
      // auto-select the newly created quiz
      const newId = res?.data?.id;
      if (newId) setSelectedQuizId(newId);
      toast.success(t("quiz.quizCreated"));
    },
    onError: (err: any) => toast.error(err?.message || t("quiz.quizCreateError")),
  });

  const deleteQuizMutation = useMutation({
    mutationFn: (quizId: number) => deleteQuizClient(quizId),
    onSuccess: () => {
      invalidate();
      setSelectedQuizId(null);
      toast.success(t("quiz.quizDeleted"));
    },
    onError: (err: any) => toast.error(err?.message || t("quiz.quizDeleteError")),
  });

  const addQuestionMutation = useMutation({
    mutationFn: ({ quizId, payload }: { quizId: number; payload: ICreateQuizQuestionPayload }) =>
      addQuizQuestionClient(quizId, payload),
    onSuccess: () => {
      invalidate();
      setQuestionAction(null);
      toast.success(t("quiz.questionAdded"));
    },
    onError: (err: any) => toast.error(err?.message || t("quiz.questionAddError")),
  });

  const updateQuestionMutation = useMutation({
    mutationFn: ({ questionId, payload }: { questionId: number; payload: ICreateQuizQuestionPayload }) =>
      updateQuizQuestionClient(questionId, payload),
    onSuccess: () => {
      invalidate();
      setQuestionAction(null);
      toast.success(t("quiz.questionUpdated"));
    },
    onError: (err: any) => toast.error(err?.message || t("quiz.questionUpdateError")),
  });

  const deleteQuestionMutation = useMutation({
    mutationFn: (questionId: number) => deleteQuizQuestionClient(questionId),
    onSuccess: () => {
      invalidate();
      toast.success(t("quiz.questionDeleted"));
    },
    onError: (err: any) => toast.error(err?.message || t("quiz.questionDeleteError")),
  });

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <>
      <ResponsiveModal
        trigger={
          <Button size="sm" variant="outline" className="gap-1.5">
            <ClipboardList className="h-3.5 w-3.5" />
            {t("curriculum.manageQuiz")}
          </Button>
        }
        open={open}
        onOpenChange={handleOpenChange}
        title={t("quiz.manageTitle", { title: lesson.title })}
        description={t("quiz.manageDescription")}
        maxWidth="2xl"
        scrollable
      >
        <div className="space-y-5 pb-4">
          {/* Loading state */}
          {quizzesLoading && (
            <p className="animate-pulse py-8 text-center text-sm text-muted-foreground">
              {t("quiz.loading")}
            </p>
          )}

          {!quizzesLoading && (
            <>
              {/* Quizzes tabs / list */}
              {quizzes.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {quizzes.map((q) => (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => setSelectedQuizId(q.id)}
                      className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                        selectedQuizId === q.id
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background hover:bg-muted"
                      }`}
                    >
                      <ClipboardList className="h-3 w-3" />
                      {q.title || t(`quiz.types.${q.type as QuizType}`)}
                    </button>
                  ))}
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full h-7 gap-1 text-xs"
                    onClick={() => setSelectedQuizId(null)}
                  >
                    <Plus className="h-3 w-3" />
                    {t("quiz.createQuiz")}
                  </Button>
                </div>
              )}

              {/* Create quiz form — shown when no quizzes exist OR user clicked "+" */}
              {(quizzes.length === 0 || selectedQuizId === null) && (
                <CreateQuizSection
                  onSubmit={(payload) => createQuizMutation.mutate(payload)}
                  isPending={createQuizMutation.isPending}
                  t={t}
                />
              )}

              {/* Selected quiz detail */}
              {selectedQuiz && (
                <QuizDetailSection
                  quiz={selectedQuiz}
                  onDeleteQuiz={() => deleteQuizMutation.mutate(selectedQuiz.id)}
                  isDeletingQuiz={deleteQuizMutation.isPending}
                  onAddQuestion={() => setQuestionAction({ mode: "create" })}
                  onEditQuestion={(q) => setQuestionAction({ mode: "edit", question: q })}
                  onDeleteQuestion={(id) => deleteQuestionMutation.mutate(id)}
                  isDeletingQuestion={deleteQuestionMutation.isPending}
                  t={t}
                />
              )}
            </>
          )}
        </div>
      </ResponsiveModal>

      {/* Question form modal */}
      {questionAction && selectedQuiz && (
        <QuestionFormModal
          mode={questionAction.mode}
          question={questionAction.mode === "edit" ? questionAction.question : undefined}
          onClose={() => setQuestionAction(null)}
          onSubmit={(payload) => {
            if (questionAction.mode === "edit") {
              updateQuestionMutation.mutate({
                questionId: (questionAction as { mode: "edit"; question: IQuizQuestion }).question.id,
                payload,
              });
            } else {
              addQuestionMutation.mutate({ quizId: selectedQuiz.id, payload });
            }
          }}
          isPending={addQuestionMutation.isPending || updateQuestionMutation.isPending}
          t={t}
        />
      )}
    </>
  );
}

// ─── CreateQuizSection ────────────────────────────────────────────────────────

function CreateQuizSection({
  onSubmit,
  isPending,
  t,
}: {
  onSubmit: (p: ICreateQuizPayload) => void;
  isPending: boolean;
  t: ReturnType<typeof useTranslations<"Dashboard.CoursesPage">>;
}) {
  const [draft, setDraft] = useState<QuizSettingsDraft>({
    type: "surprise",
    title: "",
    passing_score: "70",
    time_limit_seconds: "",
    max_attempts: "3",
    pool_size: "",
  });

  const set = (key: keyof QuizSettingsDraft, val: string) =>
    setDraft((prev) => ({ ...prev, [key]: val }));

  const handleSubmit = () => {
    if (!draft.title.trim()) {
      toast.error(t("quiz.fields.titlePlaceholder"));
      return;
    }
    const payload: ICreateQuizPayload = {
      type: draft.type,
      title: draft.title.trim(),
      passing_score: draft.passing_score ? Number(draft.passing_score) : undefined,
      time_limit_seconds: draft.time_limit_seconds ? Number(draft.time_limit_seconds) : undefined,
      max_attempts: draft.max_attempts ? Number(draft.max_attempts) : undefined,
      pool_size: draft.pool_size ? Number(draft.pool_size) : undefined,
    };
    onSubmit(payload);
  };

  return (
    <Card className="border-dashed">
      <CardContent className="pt-6 space-y-5">
        <div className="flex flex-col items-center gap-2 pb-2 text-center">
          <div className="rounded-full bg-primary/10 p-3">
            <ClipboardList className="h-6 w-6 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">{t("quiz.noQuizYet")}</p>
        </div>

        <Separator />

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label>{t("quiz.fields.title")}</Label>
            <Input
              value={draft.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder={t("quiz.fields.titlePlaceholder")}
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label>{t("quiz.fields.type")}</Label>
            <Select value={draft.type} onValueChange={(v) => set("type", v as QuizType)}>
              <SelectTrigger><SelectValue placeholder={t("quiz.fields.typePlaceholder")} /></SelectTrigger>
              <SelectContent>
                <SelectItem value="surprise">{t("quiz.types.surprise")}</SelectItem>
                <SelectItem value="section_quiz">{t("quiz.types.section_quiz")}</SelectItem>
                <SelectItem value="final_exam">{t("quiz.types.final_exam")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-1.5">
              <Target className="h-3.5 w-3.5 text-muted-foreground" />
              {t("quiz.fields.passingScore")}
            </Label>
            <Input type="number" min={0} max={100} value={draft.passing_score}
              onChange={(e) => set("passing_score", e.target.value)}
              placeholder={t("quiz.fields.passingScorePlaceholder")} />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              {t("quiz.fields.timeLimitSeconds")}
            </Label>
            <Input type="number" min={0} value={draft.time_limit_seconds}
              onChange={(e) => set("time_limit_seconds", e.target.value)}
              placeholder={t("quiz.fields.timeLimitPlaceholder")} />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-1.5">
              <Trophy className="h-3.5 w-3.5 text-muted-foreground" />
              {t("quiz.fields.maxAttempts")}
            </Label>
            <Input type="number" min={1} value={draft.max_attempts}
              onChange={(e) => set("max_attempts", e.target.value)}
              placeholder={t("quiz.fields.maxAttemptsPlaceholder")} />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
              {t("quiz.fields.poolSize")}
            </Label>
            <Input type="number" min={1} value={draft.pool_size}
              onChange={(e) => set("pool_size", e.target.value)}
              placeholder={t("quiz.fields.poolSizePlaceholder")} />
          </div>
        </div>

        <Button className="w-full" onClick={handleSubmit} disabled={isPending}>
          <Plus className="h-4 w-4 mr-2" />
          {isPending ? t("quiz.saving") : t("quiz.createQuiz")}
        </Button>
      </CardContent>
    </Card>
  );
}

// ─── QuizDetailSection ────────────────────────────────────────────────────────

function QuizDetailSection({
  quiz,
  onDeleteQuiz,
  isDeletingQuiz,
  onAddQuestion,
  onEditQuestion,
  onDeleteQuestion,
  isDeletingQuestion,
  t,
}: {
  quiz: IQuiz;
  onDeleteQuiz: () => void;
  isDeletingQuiz: boolean;
  onAddQuestion: () => void;
  onEditQuestion: (q: IQuizQuestion) => void;
  onDeleteQuestion: (id: number) => void;
  isDeletingQuestion: boolean;
  t: ReturnType<typeof useTranslations<"Dashboard.CoursesPage">>;
}) {
  // API returns `question` field inside each question object, normalize it
  const questions: IQuizQuestion[] = (quiz.questions ?? []).map((q: any) => ({
    id: q.id,
    text: q.text ?? q.question ?? "",
    type: q.type ?? "mcq",
    explanation: q.explanation ?? null,
    options: q.options ?? [],
  }));

  return (
    <div className="space-y-4">
      {/* Settings summary card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <Settings2 className="h-4 w-4" />
              {t("quiz.settingsTitle")}
            </CardTitle>
            <AreYouSureDeleteing
              onAccept={onDeleteQuiz}
              title={t("quiz.deleteQuizTitle")}
              description={t("quiz.deleteQuizDescription")}
              TriggerButton={
                <Button size="sm" variant="destructive" className="h-7 w-7 p-0">
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              }
              isLoading={isDeletingQuiz}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="gap-1">
              <ClipboardList className="h-3 w-3" />
              {t(`quiz.types.${quiz.type as QuizType}`)}
            </Badge>
            {quiz.passing_score != null && (
              <Badge variant="outline" className="gap-1">
                <Target className="h-3 w-3" />{quiz.passing_score}%
              </Badge>
            )}
            {quiz.time_limit_seconds != null && (
              <Badge variant="outline" className="gap-1">
                <Clock className="h-3 w-3" />{quiz.time_limit_seconds}s
              </Badge>
            )}
            {quiz.max_attempts != null && (
              <Badge variant="outline" className="gap-1">
                <Trophy className="h-3 w-3" />×{quiz.max_attempts}
              </Badge>
            )}
            {quiz.pool_size != null && (
              <Badge variant="outline" className="gap-1">
                <BookOpen className="h-3 w-3" />pool: {quiz.pool_size}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Questions card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <HelpCircle className="h-4 w-4" />
              {t("quiz.questionsTitle")}
              {questions.length > 0 && (
                <Badge className="ml-1 h-5 px-1.5 text-[10px]">{questions.length}</Badge>
              )}
            </CardTitle>
            <Button size="sm" className="h-7 gap-1" onClick={onAddQuestion}>
              <Plus className="h-3.5 w-3.5" />
              {t("quiz.addQuestion")}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {questions.length === 0 && (
            <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
              {t("quiz.noQuestions")}
            </div>
          )}
          {questions.map((q, idx) => (
            <QuestionCard
              key={q.id}
              index={idx}
              question={q}
              onEdit={() => onEditQuestion(q)}
              onDelete={() => onDeleteQuestion(q.id)}
              isDeleting={isDeletingQuestion}
              t={t}
            />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── QuestionCard ─────────────────────────────────────────────────────────────

function QuestionCard({
  index,
  question,
  onEdit,
  onDelete,
  isDeleting,
  t,
}: {
  index: number;
  question: IQuizQuestion;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
  t: ReturnType<typeof useTranslations<"Dashboard.CoursesPage">>;
}) {
  return (
    <div className="rounded-lg border bg-muted/20 p-3 space-y-2 hover:bg-muted/30 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2 min-w-0">
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
            {index + 1}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-medium leading-snug">{question.text}</p>
            {question.explanation && (
              <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                {question.explanation}
              </p>
            )}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <Badge variant="outline" className="h-5 px-1.5 text-[10px] capitalize">
            {t(`quiz.questionTypes.${(question.type ?? "mcq") as QuestionType}`)}
          </Badge>
          <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={onEdit}>
            <Pencil className="h-3 w-3" />
          </Button>
          <AreYouSureDeleteing
            onAccept={onDelete}
            title={t("quiz.deleteQuestionTitle")}
            description={t("quiz.deleteQuestionDescription")}
            TriggerButton={
              <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-destructive hover:text-destructive">
                <Trash2 className="h-3 w-3" />
              </Button>
            }
            isLoading={isDeleting}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-1.5 pl-7">
        {question.options.map((opt) => (
          <div
            key={opt.id}
            className={`flex items-center gap-1.5 rounded-md px-2 py-1 text-xs ${
              opt.is_correct
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                : "bg-background text-muted-foreground border"
            }`}
          >
            {opt.is_correct
              ? <CheckCircle2 className="h-3 w-3 shrink-0" />
              : <Circle className="h-3 w-3 shrink-0" />}
            <span className="truncate">{opt.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── QuestionFormModal ────────────────────────────────────────────────────────

function QuestionFormModal({
  mode,
  question,
  onClose,
  onSubmit,
  isPending,
  t,
}: {
  mode: "create" | "edit";
  question?: IQuizQuestion;
  onClose: () => void;
  onSubmit: (payload: ICreateQuizQuestionPayload) => void;
  isPending: boolean;
  t: ReturnType<typeof useTranslations<"Dashboard.CoursesPage">>;
}) {
  const [draft, setDraft] = useState<QuestionDraft>(() => {
    if (question) {
      return {
        text: question.text,
        type: question.type ?? "mcq",
        explanation: question.explanation ?? "",
        options: question.options.map((o) => ({ text: o.text, is_correct: o.is_correct })),
      };
    }
    return { ...BLANK_QUESTION, options: BLANK_QUESTION.options.map((o) => ({ ...o })) };
  });

  useEffect(() => {
    if (question) {
      setDraft({
        text: question.text,
        type: question.type ?? "mcq",
        explanation: question.explanation ?? "",
        options: question.options.map((o) => ({ text: o.text, is_correct: o.is_correct })),
      });
    }
  }, [question?.id]);

  const handleTypeChange = (type: QuestionType) => {
    setDraft((prev) => ({
      ...prev,
      type,
      options:
        type === "true_false"
          ? TRUE_FALSE_OPTIONS.map((o) => ({ ...o }))
          : prev.options.length >= 2
          ? prev.options
          : [{ text: "", is_correct: false }, { text: "", is_correct: false }],
    }));
  };

  const setOptionText = (idx: number, text: string) =>
    setDraft((prev) => ({
      ...prev,
      options: prev.options.map((o, i) => (i === idx ? { ...o, text } : o)),
    }));

  const setOptionCorrect = (idx: number) =>
    setDraft((prev) => ({
      ...prev,
      options: prev.options.map((o, i) => ({ ...o, is_correct: i === idx })),
    }));

  const addOption = () =>
    setDraft((prev) => ({ ...prev, options: [...prev.options, { text: "", is_correct: false }] }));

  const removeOption = (idx: number) =>
    setDraft((prev) => ({ ...prev, options: prev.options.filter((_, i) => i !== idx) }));

  const validate = (): boolean => {
    if (!draft.text.trim()) { toast.error(t("quiz.questionTextRequired")); return false; }
    if (draft.options.length < 2) { toast.error(t("quiz.minTwoOptions")); return false; }
    if (!draft.options.some((o) => o.is_correct)) { toast.error(t("quiz.oneCorrectRequired")); return false; }
    return true;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({
      text: draft.text.trim(),
      type: draft.type,
      explanation: draft.explanation.trim() || undefined,
      options: draft.options.map((o) => ({ text: o.text.trim(), is_correct: o.is_correct })),
    });
  };

  return (
    <ResponsiveModal
      trigger
      open
      onOpenChange={(next) => { if (!next) onClose(); }}
      title={mode === "create" ? t("quiz.addQuestion") : t("quiz.editQuestion")}
      maxWidth="md"
      scrollable
    >
      <div className="space-y-4 py-2">
        <div className="space-y-2">
          <Label>{t("quiz.fields.questionText")}</Label>
          <Textarea rows={3} value={draft.text}
            onChange={(e) => setDraft((p) => ({ ...p, text: e.target.value }))}
            placeholder={t("quiz.fields.questionTextPlaceholder")} />
        </div>

        <div className="space-y-2">
          <Label>{t("quiz.fields.questionType")}</Label>
          <Select value={draft.type} onValueChange={(v) => handleTypeChange(v as QuestionType)}>
            <SelectTrigger><SelectValue placeholder={t("quiz.fields.questionTypePlaceholder")} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="mcq">{t("quiz.questionTypes.mcq")}</SelectItem>
              <SelectItem value="true_false">{t("quiz.questionTypes.true_false")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>{t("quiz.fields.options")}</Label>
          <div className="space-y-2">
            {draft.options.map((opt, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <button type="button" onClick={() => setOptionCorrect(idx)}
                  className="shrink-0 focus:outline-none" title={t("quiz.fields.isCorrect")}>
                  {opt.is_correct
                    ? <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    : <Circle className="h-5 w-5 text-muted-foreground" />}
                </button>
                <Input value={opt.text} onChange={(e) => setOptionText(idx, e.target.value)}
                  placeholder={`${t("quiz.fields.optionPlaceholder")} ${idx + 1}`}
                  readOnly={draft.type === "true_false"}
                  className={draft.type === "true_false" ? "bg-muted/40" : ""} />
                {draft.type === "mcq" && draft.options.length > 2 && (
                  <Button type="button" size="sm" variant="ghost"
                    className="h-8 w-8 shrink-0 p-0 text-destructive hover:text-destructive"
                    onClick={() => removeOption(idx)}>
                    <XCircle className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
          {draft.type === "mcq" && (
            <Button type="button" size="sm" variant="outline" className="mt-1 gap-1" onClick={addOption}>
              <Plus className="h-3.5 w-3.5" />{t("quiz.addOption")}
            </Button>
          )}
        </div>

        <div className="space-y-2">
          <Label>{t("quiz.fields.explanation")}</Label>
          <Textarea rows={2} value={draft.explanation}
            onChange={(e) => setDraft((p) => ({ ...p, explanation: e.target.value }))}
            placeholder={t("quiz.fields.explanationPlaceholder")} />
        </div>

        <div className="flex gap-2 pt-1">
          <Button type="button" className="flex-1" onClick={handleSubmit} disabled={isPending}>
            {isPending ? t("quiz.saving") : mode === "create" ? t("quiz.saveQuestion") : t("quiz.updateQuestion")}
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>{t("quiz.cancel")}</Button>
        </div>
      </div>
    </ResponsiveModal>
  );
}
