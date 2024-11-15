import { StateCreator } from "zustand";

export interface UiSlice {
  uiData: {
    selectMenuItem: string;
  };
  setSelectMenuItem: (newItem: string) => void;
}

export const createUiSlice: StateCreator<UiSlice> = (set, get) => ({
  uiData: {
    selectMenuItem: "Home",
  },
  setSelectMenuItem: (newItem: string) => {
    const uiData = get().uiData;
    uiData.selectMenuItem = newItem;

    set({ uiData });
  },
});
