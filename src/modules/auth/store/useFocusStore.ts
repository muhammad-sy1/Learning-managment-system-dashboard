// store/useFocusStore.ts
import { create } from "zustand";

interface FocusState {
  focusField: string | null;
  setFocusField: (field: string | null) => void;
}

export const useFocusStore = create<FocusState>((set) => ({
  focusField: null,
  setFocusField: (field) => set({ focusField: field }),
}));
