import { useChatStore } from "@/store/chatStore";
import { useEffect, useState } from "react";

export function useChat() {
  const store = useChatStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return {
    messages: mounted ? store.messages : [],
    isLoading: mounted ? store.isLoading : false,
    currentFeature: mounted ? store.currentFeature : "general",
    addMessage: store.addMessage,
    setLoading: store.setLoading,
    clearMessages: store.clearMessages,
    setCurrentFeature: store.setCurrentFeature,
    isMounted: mounted,
  };
}
