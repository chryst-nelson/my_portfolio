"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useChatStream, type ChatMessage } from "@/lib/chat/useChatStream";
import type { ChatMode } from "@/lib/chat/types";

const STORAGE_KEY = "portfolio-chat-v1";

type ChatContextValue = Omit<ReturnType<typeof useChatStream>, "setMessages"> & {
  mode: ChatMode;
  setMode: (mode: ChatMode) => void;
  clear: () => void;
};

const ChatContext = createContext<ChatContextValue | null>(null);

// Lives in the root layout so the conversation survives client-side navigation
// (/ <-> /ask) and, via sessionStorage, a page refresh.
export function ChatProvider({ children }: { children: ReactNode }) {
  const chat = useChatStream();
  const { messages, setMessages, isStreaming } = chat;
  const [mode, setMode] = useState<ChatMode>("GENERAL");
  const hydrated = useRef(false);

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as { messages?: ChatMessage[]; mode?: ChatMode };
        if (Array.isArray(saved.messages)) setMessages(saved.messages);
        if (saved.mode) setMode(saved.mode);
      }
    } catch {
      // Storage unavailable or corrupt: start with an empty conversation.
    }
    hydrated.current = true;
  }, [setMessages]);

  useEffect(() => {
    if (!hydrated.current || isStreaming) return;
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ messages, mode }));
    } catch {
      // Ignore quota / privacy-mode errors.
    }
  }, [messages, mode, isStreaming]);

  const clear = useCallback(() => {
    setMessages([]);
    try {
      window.sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore.
    }
  }, [setMessages]);

  const { setMessages: _unused, ...rest } = chat;
  void _unused;

  return (
    <ChatContext.Provider value={{ ...rest, mode, setMode, clear }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used inside <ChatProvider>");
  return ctx;
}
