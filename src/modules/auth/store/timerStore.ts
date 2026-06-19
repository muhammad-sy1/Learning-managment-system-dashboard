import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ITimerState {
  duration: number;
  running: boolean;
  start: (seconds: number) => void;
  reset: () => void;
}

const useTimer = create<ITimerState>()(
  persist(
    (set, get) => {
      let interval: NodeJS.Timeout | null = null;

      const clear = () => {
        if (interval) {
          clearInterval(interval);
          interval = null;
        }
      };

      const tick = () => {
        const { duration } = get();
        if (duration > 0) {
          set({ duration: duration - 1 });
        } else {
          clear();
          set({ duration: 0, running: false });
        }
      };

      return {
        duration: 0,
        running: false,

        start: (seconds: number) => {
          clear();
          set({ duration: seconds, running: true });
          interval = setInterval(tick, 1000);
        },

        reset: () => {
          clear();
          set({ duration: 0, running: false });
        },
      };
    },
    {
      name: "timer-storage",
      onRehydrateStorage: () => {
        return (state) => {
          state?.start(state.duration);
        };
      },
    }
  )
);

export default useTimer;
