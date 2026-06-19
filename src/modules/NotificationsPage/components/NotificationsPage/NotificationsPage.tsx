"use client";
import { ResponsiveModal } from "@/components/ResponsiveModal";
import AppPagination from "@/components/reusable-table/AppPagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Bell,
  Calendar,
  Eye,
  MessageSquare,
  Plus,
  ShoppingCart,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useGetNotifications } from "../../hooks/useGetNotifications";
import { INotification } from "../../types/notifications";
import AddMainNotificationForm from "./AddMainNotificationForm";
import { formatUtcToLocal } from "@/utils/formatDate";

function NotificationsPage() {
  const router = useRouter();
  const { data: notificationsData, isPending } = useGetNotifications();
  const t = useTranslations("Dashboard.NotificationsPage");
  const notifications = notificationsData?.data || [];
  const [isEditOpen, setIsEditOpen] = useState(false);
  const handleNotificationClick = (notification: INotification) => {
    const { state, product_id, conversation_id } = notification.data || {};
    const click_action = notification.click_action || "";
    switch (state) {
      case 16:
        if (product_id) {
          router.push(click_action);
        }
        break;

      case 9:
        if (conversation_id) {
          router.push(click_action);
        }
        break;

      default:
        router.push(click_action);
        // console.log(`State ${state} not handled`);
        break;
    }
  };

 

  const getNotificationIcon = (title: string) => {
    if (title.includes("🛒")) return <ShoppingCart className="h-5 w-5" />;
    if (title.includes("💬")) return <MessageSquare className="h-5 w-5" />;
    return <Bell className="h-5 w-5" />;
  };

  const getNotificationVariant = (title: string) => {
    if (title.includes("🛒")) return "secondary";
    if (title.includes("💬")) return "default";
    return "outline";
  };

  if (isPending) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            <Skeleton className="h-8 w-64 mb-6" />
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="p-6">
                <CardContent className="p-0">
                  <div className="flex items-start space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {t("title")}
              </h1>
              <p className="text-muted-foreground mt-2">
                {notifications.length} {t("notifications")}
              </p>
            </div>
            {/* <Badge variant="outline" className="text-sm">
              <Bell className="h-4 w-4 mr-2" />
              {notifications.filter((n) => !n.read_at).length} غير مقروء
            </Badge> */}
            <ResponsiveModal
              trigger={
                <Button variant="outline" size="sm" className=" p-0">
                  {t("addNotification")}
                  <Plus className="h-4 w-4" />
                </Button>
              }
              title={t("addNotification")}
              // description={t("descriptionTable")}
              maxWidth="lg"
              height="auto"
              open={isEditOpen}
              onOpenChange={setIsEditOpen}
            >
              <AddMainNotificationForm onSuccess={() => setIsEditOpen(false)} />
            </ResponsiveModal>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {notifications.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Bell className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  {t("noNotifications")}
                </h3>
                <p className="text-muted-foreground">
                  {t("noNotificationsDescription")}
                </p>
              </CardContent>
            </Card>
          ) : (
            notifications.map((notification: INotification) => (
              <Card
                key={notification.id}
                className={`
                  cursor-pointer transition-all duration-200 
                  hover:shadow-md hover:border-primary/20
                  ${notification.read_at ? "opacity-60" : "opacity-100"}
                `}
                onClick={() => handleNotificationClick(notification)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div
                      className={`
                      flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center
                      ${
                        notification.read_at
                          ? "bg-muted text-muted-foreground"
                          : "bg-primary/10 text-primary"
                      }
                    `}
                    >
                      {getNotificationIcon(notification.title)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-base">
                            {notification.title}
                          </h3>
                          {!notification.read_at && (
                            <Badge variant="destructive" className="text-xs">
                              جديد
                            </Badge>
                          )}
                        </div>
                        <Badge
                          variant={getNotificationVariant(notification.title)}
                          className="rounded-full p-1"
                        >
                          {getNotificationIcon(notification.title)}
                        </Badge>
                      </div>

                      <p className="text-foreground leading-relaxed">
                        {notification.body}
                      </p>

                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{formatUtcToLocal(notification.created_at)}</span>
                          </div>
                          {notification.read_at && (
                            <Badge variant="outline" className="text-xs">
                              {t("read")}
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-primary">
                          <Eye className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            {t("clickToView")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Load More Button */}
        {notificationsData?.last_page && notificationsData?.last_page > 1 && (
      
          <AppPagination
            name={"Notifications"}
            totalItems={notificationsData?.total || 0}
            totalPages={notificationsData?.last_page || 1}
          />
        )}
      </div>
    </div>
  );
}

export default NotificationsPage;
