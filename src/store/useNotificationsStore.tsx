

import { create } from "zustand";

type NotificationsState = {
  fcmToken: string | null;
  setFcmToken: (token: string) => void;
  unreadCount: number;
  setUnreadCount: (count: number) => void;
  incrementUnread: () => void;
  clearUnread: () => void;
};

const useNotificationsStore = create<NotificationsState>((set) => ({
  fcmToken: null,
  setFcmToken: (token) => set({ fcmToken: token }),
  unreadCount: 0,
  setUnreadCount: (count) => set({ unreadCount: count }),
  incrementUnread: () =>
    set((state) => ({ unreadCount: state.unreadCount + 1 })),
  clearUnread: () => set({ unreadCount: 0 }),
}));

export default useNotificationsStore;
