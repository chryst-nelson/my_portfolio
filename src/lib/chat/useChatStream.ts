"use client";

import { useState } from "react";
import type { ChatMessageResponse, ChatMode } from "@/lib/chat/types";

import { API_BASE_URL, MAINTENANCE_MESSAGE, isMaintenanceStatus } from "@/lib/api/status";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  response?: ChatMessageResponse; // set once the assistant message is complete
  isStreaming?: boolean;
}

interface ApiErrorBody {
  message?: string;
}

function parseSseEvent(rawEvent: string): { name: string; data: string } {
  const name = rawEvent.match(/^event:\s*(.+)$/m)?.[1]?.trim() ?? "message";
  const data = rawEvent
    .split("\n")
    .filter((line) => line.startsWith("data:"))
    .map((line) => line.slice(5).trim())
    .join("\n");
  return { name, data };
}

async function extractErrorMessage(res: Response): Promise<string> {
  try {
    const body = (await res.json()) as ApiErrorBody;
    if (body?.message) return body.message;
  } catch {
    // Body wasn't JSON (or was empty) — fall through to the generic message.
  }
  return `Request failed with status ${res.status}`;
}

export function useChatStream() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function sendMessage(text: string, mode: ChatMode): Promise<boolean> {
    let failed = false;
    setError(null);
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      text,
    };
    const assistantId = crypto.randomUUID();
    const assistantMessage: ChatMessage = {
      id: assistantId,
      role: "assistant",
      text: "",
      isStreaming: true,
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setIsStreaming(true);

    // On failure, drop the unanswered exchange so the caller can put the text
    // back in the input and the user can simply resend.
    function discardExchange() {
      setMessages((prev) =>
        prev.filter((m) => m.id !== userMessage.id && m.id !== assistantId),
      );
    }

    function updateAssistant(patch: Partial<ChatMessage>) {
      setMessages((prev) =>
        prev.map((m) => (m.id === assistantId ? { ...m, ...patch } : m)),
      );
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/chat/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, mode }),
      });

      if (!res.ok) {
        if (isMaintenanceStatus(res.status)) throw new Error(MAINTENANCE_MESSAGE);
        throw new Error(await extractErrorMessage(res));
      }
      if (!res.body) {
        throw new Error("The server did not return a response body.");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // SSE events are separated by a blank line.
        const rawEvents = buffer.split("\n\n");
        buffer = rawEvents.pop() ?? ""; // keep the last, possibly-incomplete chunk

        for (const rawEvent of rawEvents) {
          if (!rawEvent.trim()) continue;
          const { name, data } = parseSseEvent(rawEvent);

          if (name === "token") {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId ? { ...m, text: m.text + data } : m,
              ),
            );
          } else if (name === "response") {
            const response: ChatMessageResponse = JSON.parse(data);
            updateAssistant({
              text: response.message,
              response,
              isStreaming: false,
            });
          } else if (name === "error") {
            failed = true;
            setError(data);
          }
        }
      }
    } catch (err) {
      failed = true;
      // fetch() rejects with a TypeError when the server is unreachable (off, or blocked by CORS on a proxy error page).
      if (err instanceof TypeError) {
        setError(MAINTENANCE_MESSAGE);
      } else {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    } finally {
      if (failed) discardExchange();
      setIsStreaming(false);
    }
    return !failed;
  }

  return { messages, setMessages, sendMessage, isStreaming, error };
}
