import { create } from "zustand";

export const useChatStore = create()(
  (set) => ({
    messages: [],
    isLoading: false,
    currentFeature: "general",
    addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
    setLoading: (isLoading) => set({ isLoading }),
    clearMessages: () => set({ messages: [] }),
    setCurrentFeature: (currentFeature) => set({ currentFeature })
  })
);
