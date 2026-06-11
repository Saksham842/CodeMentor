import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useChatStore = create()(
  persist(
    (set) => ({
      messages: [],
      isLoading: false,
      currentFeature: "general",
      addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
      setLoading: (isLoading) => set({ isLoading }),
      clearMessages: () => set({ messages: [] }),
      setCurrentFeature: (currentFeature) => set({ currentFeature })
    }),
    {
      name: "codementor-chat-store"
    }
  )
);
