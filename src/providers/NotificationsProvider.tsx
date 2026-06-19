// app/_providers/NotificationsProvider.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  ensureFcmToken,
  onForegroundMessage,
} from "@/lib/firebase/notifications";
import useNotificationsStore from "@/store/useNotificationsStore";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type Ctx = {
  token: string | null;
  permission: NotificationPermission | null;
};

const NotificationsContext = createContext<Ctx>({
  token: null,
  permission: null,
});

export default function NotificationsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [token, setToken] = useState<string | null>(null);
  const [permission, setPermission] = useState<NotificationPermission | null>(
    null,
  );
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("Notifications");

  const showToast = !pathname.includes("/messages");

  const renderButtons = (state: string, conversation: string) => {
    // console.log(state);
    switch (state) {
      case "9":
        return (
          <Button className="my-1" onClick={() => router.push(conversation)}>
            {t("show")}
          </Button>
        );
      case "16":
        return (
          <>
            <Button className="my-1" onClick={() => router.push(conversation)}>
              {t("show")}
            </Button>
          </>
        );
      default:
        return (
          <Button onClick={() => router.push(conversation)}>{t("show")}</Button>
        );
    }
  };

  useEffect(() => {
    (async () => {
      // Ask permission + get token once app mounts
      const tok = await ensureFcmToken();
      setToken(tok);
      // console.log("🔔 Foreground FCM:", tok);
      if (tok) useNotificationsStore.getState().setFcmToken(tok);
      setPermission(
        typeof window !== "undefined" ? Notification.permission : null,
      );

      // Listen to foreground messages globally
      await onForegroundMessage((payload) => {
        // console.log("🔔 Foreground FCM:", payload);

        const conversationLink = payload.data?.click_action;
        const state = payload?.data?.state;
        useNotificationsStore.getState().incrementUnread();
        if (showToast) {
          toast(
            <div className="flex flex-col gap-2">
              <div>{payload.notification?.title}</div>
              <div>{payload?.notification?.body}</div>
              {renderButtons(String(state), String(conversationLink))}
            </div>,
            {
              duration: 5000,
            },
          );
        }
      });
    })();

    return () => {
      // No cleanup needed since onForegroundMessage does not return an unsubscribe function
    };
  }, [showToast, t]);

  // (Optional) Re-check token when tab regains focus — useful if the token rotated
  useEffect(() => {
    const onFocus = () => ensureFcmToken().then((t) => t && setToken(t));
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  const value = useMemo(() => ({ token, permission }), [token, permission]);

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationsContext);
}
