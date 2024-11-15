import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { UiSlice, createUiSlice } from "./slices/uiSlice";
import { UserSlice, createUserSlice } from "./slices/userSlice";

type StoreState = UiSlice & UserSlice;

export const useAppStore = create<StoreState>()(
  persist(
    devtools((...props) => ({
      ...createUiSlice(...props),
      ...createUserSlice(...props),
    })),
    { name: "CloudTalk" }
  )
);
