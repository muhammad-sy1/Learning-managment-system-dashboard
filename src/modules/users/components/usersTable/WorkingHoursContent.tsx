"use client";

import { AreYouSureDeleteing } from "@/components/AreYouSureDeleteing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Spinner from "@/components/ui/spinner";
import { Clock, Edit, Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import useCreateWorkingHour from "../../hooks/useCreateWorkingHour";
import useDeleteWorkingHour from "../../hooks/useDeleteWorkingHour";
import useUpdateWorkingHour from "../../hooks/useUpdateWorkingHour";
import { useGetWorkingHours } from "../../hooks/useGetWorkingHours";
import { IWorkingHour } from "../../types/users";

const DAYS_ORDER = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

interface HourFormState {
  opens_at: string;
  closes_at: string;
}

interface WorkingHoursContentProps {
  merchantId: number;
  isOpen: boolean;
}

function formatWorkingHourTime(time: string) {
  const [hours = "0", minutes = "0"] = time.split(":");
  const date = new Date();

  date.setHours(Number(hours), Number(minutes), 0, 0);

  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export default function WorkingHoursContent({
  merchantId,
  isOpen,
}: WorkingHoursContentProps) {
  const t = useTranslations("Dashboard.USERS.merchantManagement.workingHours");

  const { data: workingHours, isLoading } = useGetWorkingHours(
    merchantId,
    isOpen,
  );

  const { mutate: createHour, isPending: isCreating } =
    useCreateWorkingHour(merchantId);
  const { mutate: updateHour, isPending: isUpdating } =
    useUpdateWorkingHour(merchantId);
  const { mutate: deleteHour } = useDeleteWorkingHour(merchantId);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<HourFormState>({
    opens_at: "",
    closes_at: "",
  });
  const [addingDay, setAddingDay] = useState<string | null>(null);
  const [addForm, setAddForm] = useState<HourFormState>({
    opens_at: "",
    closes_at: "",
  });

  const hoursList: IWorkingHour[] = Array.isArray(workingHours)
    ? workingHours
    : [];

  const hoursByDay = DAYS_ORDER.reduce<Record<string, IWorkingHour[]>>(
    (acc, day) => {
      acc[day] = hoursList.filter(
        (h) => h.day_name.toLowerCase() === day.toLowerCase(),
      );
      return acc;
    },
    {},
  );

  function startEdit(hour: IWorkingHour) {
    if (typeof hour.id !== "number") {
      toast.error(
        "This working hour cannot be edited because its id is missing.",
      );
      return;
    }

    setEditingId(hour.id);
    setEditForm({
      opens_at: hour.opens_at.substring(0, 5),
      closes_at: hour.closes_at.substring(0, 5),
    });
    setAddingDay(null);
  }

  function cancelEdit() {
    setEditingId(null);
  }

  function saveEdit(hour: IWorkingHour) {
    if (typeof hour.id !== "number") return;

    updateHour(
      { id: hour.id, data: { day_name: hour.day_name, ...editForm } },
      { onSuccess: () => setEditingId(null) },
    );
  }

  function startAdd(day: string) {
    setAddingDay(day);
    setAddForm({ opens_at: "", closes_at: "" });
    setEditingId(null);
  }

  function cancelAdd() {
    setAddingDay(null);
  }

  function saveAdd(day: string) {
    createHour(
      { day_name: day, ...addForm },
      { onSuccess: () => setAddingDay(null) },
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Spinner className="size-6" />
      </div>
    );
  }

  return (
    <div className="space-y-3 py-4">
      {DAYS_ORDER.map((day) => {
        const slots = hoursByDay[day];
        const isAddingThisDay = addingDay === day;

        return (
          <div key={day} className="rounded-lg border p-3 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">{t(day)}</h3>
              {!isAddingThisDay && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 gap-1 text-xs"
                  onClick={() => startAdd(day)}
                >
                  <Plus className="h-3.5 w-3.5" />
                  {t("addSlot")}
                </Button>
              )}
            </div>

            {slots.length === 0 && !isAddingThisDay && (
              <p className="text-xs text-muted-foreground">{t("noHours")}</p>
            )}

            {slots.map((hour, index) =>
              editingId === hour.id ? (
                <div
                  key={
                    hour.id ??
                    `${hour.day_name}-${hour.opens_at}-${hour.closes_at}-${index}`
                  }
                  className="flex flex-wrap items-center gap-2"
                >
                  <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <Input
                    type="time"
                    value={editForm.opens_at}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, opens_at: e.target.value }))
                    }
                    className="h-8 w-32 text-sm"
                  />
                  <span className="text-muted-foreground">–</span>
                  <Input
                    type="time"
                    value={editForm.closes_at}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, closes_at: e.target.value }))
                    }
                    className="h-8 w-32 text-sm"
                  />
                  <Button
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => saveEdit(hour)}
                    disabled={isUpdating}
                  >
                    {isUpdating ? <Spinner className="size-3" /> : t("save")}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs"
                    onClick={cancelEdit}
                    disabled={isUpdating}
                  >
                    {t("cancel")}
                  </Button>
                </div>
              ) : (
                (() => {
                  const hourId = hour.id;

                  return (
                    <div
                      key={
                        hourId ??
                        `${hour.day_name}-${hour.opens_at}-${hour.closes_at}-${index}`
                      }
                      className="flex items-center gap-2"
                    >
                      <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <span className="flex-1 text-sm ltr text-left">
                        {formatWorkingHourTime(hour.opens_at)} –{" "}
                        {formatWorkingHourTime(hour.closes_at)}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 shrink-0"
                        onClick={() => startEdit(hour)}
                        disabled={typeof hourId !== "number"}
                        title={
                          typeof hourId === "number"
                            ? undefined
                            : "Missing working hour id"
                        }
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      {typeof hourId === "number" ? (
                        <>
                          <AreYouSureDeleteing
                            TriggerButton={
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0 shrink-0 text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            }
                            onAccept={() => deleteHour(hourId)}
                          />
                        </>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 shrink-0 text-destructive hover:text-destructive"
                          disabled
                          title="Missing working hour id"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  );
                })()
              ),
            )}

            {isAddingThisDay && (
              <div className="flex flex-wrap items-center gap-2">
                <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />
                <Input
                  type="time"
                  value={addForm.opens_at}
                  onChange={(e) =>
                    setAddForm((f) => ({ ...f, opens_at: e.target.value }))
                  }
                  className="h-8 w-32 text-sm"
                />
                <span className="text-muted-foreground">–</span>
                <Input
                  type="time"
                  value={addForm.closes_at}
                  onChange={(e) =>
                    setAddForm((f) => ({ ...f, closes_at: e.target.value }))
                  }
                  className="h-8 w-32 text-sm"
                />
                <Button
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => saveAdd(day)}
                  disabled={isCreating}
                >
                  {isCreating ? <Spinner className="size-3" /> : t("save")}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={cancelAdd}
                  disabled={isCreating}
                >
                  {t("cancel")}
                </Button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
