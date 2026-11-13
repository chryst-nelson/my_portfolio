"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowUpRight, Loader2, Send } from "lucide-react";
import ThemeToggle from "@/components/theme-toggle";
import { MessageBubble } from "@/components/chat/message-bubble";
import { MAINTENANCE_MESSAGE } from "@/lib/api/status";
import { useChat } from "@/lib/chat/ChatProvider";
import { useBackendStatus } from "@/lib/chat/useBackendStatus";
import type { ChatMode } from "@/lib/chat/types";
import { profile } from "@/lib/site-data";

const MODES: { value: ChatMode; label: string }[] = [
  { value: "GENERAL", label: "General" },
  { value: "RECRUITER", label: "Recruiter" },
  { value: "DEVELOPER", label: "Developer" },
];

const PROMPTS = [
  `Tell me about ${profile.shortName}`,
  "What technologies does he use?",
  "Show me his best projects",
  "How does he work across frontend and backend?",
];

export default function ChatScreen() {
  const { messages, sendMessage, isStreaming, error, mode, setMode, clear } = useChat();
  const backend = useBackendStatus();
  const { markDown } = backend;
  const offline = backend.status === "down";
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // A failed send that looks like an outage flips the page into maintenance mode.
  useEffect(() => {
    if (error === MAINTENANCE_MESSAGE) markDown();
  }, [error, markDown]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Sends, and on failure puts the text back in the field (keeping anything
  // the user has typed in the meantime) so it can be retried or edited.
  async function send(text: string) {
    const ok = await sendMessage(text, mode);
    if (!ok) {
      setInput((current) => current || text);
      inputRef.current?.focus();
    }
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    const text = input.trim();
    if (!text || isStreaming || offline) return;
    setInput("");
    void send(text);
  }

  function pick(prompt: string) {
    if (isStreaming || offline) return;
    void send(prompt);
  }

  return (
    <div className="flex h-dvh flex-col bg-bg text-fg">
      <header className="border-b border-line">
        <div className="wrap flex max-w-3xl items-center justify-between gap-3 py-3">
          <div>
            <p className="text-lg font-semibold leading-none tracking-tight">{profile.shortName}</p>
            <p className="eyebrow mt-1.5">Ask · answers from verified data</p>
          </div>
          <div className="flex items-center gap-2">
            {messages.length > 0 && (
              <button
                type="button"
                onClick={clear}
                disabled={isStreaming}
                className="btn !px-4 !py-2.5"
              >
                New chat
              </button>
            )}
            <Link href="/" className="btn !px-4 !py-2.5">
              Portfolio
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="border-b border-line">
        <div className="wrap flex max-w-3xl gap-1.5 py-2.5" role="group" aria-label="Chat mode">
          {MODES.map((m) => (
            <button
              key={m.value}
              type="button"
              onClick={() => setMode(m.value)}
              aria-pressed={mode === m.value}
              className={`chip ${mode === m.value ? "!border-accent !text-accent" : "!text-muted"}`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto" aria-live="polite">
        <div className="wrap max-w-3xl space-y-4 py-6">
          {offline && (
            <div role="status" className="border border-line-strong bg-surface p-5">
              <p className="font-semibold">The assistant is under maintenance.</p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">
                The server is offline for a short while. The portfolio itself is unaffected, and this page will
                reconnect on its own.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link href="/" className="btn btn-solid !px-4 !py-2.5">
                  View the portfolio
                </Link>
                <button type="button" onClick={() => void backend.recheck()} className="btn !px-4 !py-2.5">
                  Try again
                </button>
              </div>
            </div>
          )}
          {messages.length === 0 ? (
            offline ? null : (
            <div className="pt-8 sm:pt-16">
              <p className="eyebrow">Hi, I&apos;m {profile.shortName}</p>
              <h1 className="mt-4 text-4xl font-semibold leading-[1.06] tracking-[-0.03em] sm:text-5xl">
                Instead of browsing my portfolio, <span className="marker">ask.</span>
              </h1>
              <div className="mt-8 flex flex-wrap gap-2">
                {PROMPTS.map((p) => (
                  <button key={p} type="button" onClick={() => pick(p)} className="chip">
                    {p}
                  </button>
                ))}
              </div>
            </div>
            )
          ) : (
            messages.map((m) => <MessageBubble key={m.id} message={m} />)
          )}
          {error && !offline && error !== MAINTENANCE_MESSAGE && (
            <p role="alert" className="border border-[#e5484d] px-3 py-2 text-sm text-[#e5484d]">
              {error}
            </p>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      <form onSubmit={submit} className="border-t border-line">
        <div className="wrap flex max-w-3xl items-center gap-2 py-3">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            maxLength={2000}
            placeholder={offline ? "Assistant is offline for maintenance" : `Ask about ${profile.shortName}'s work…`}
            disabled={isStreaming || offline}
            aria-label="Your question"
            className="field !border-b-0 border border-line-strong !px-3 !py-2.5 !text-sm"
          />
          <button
            type="submit"
            disabled={isStreaming || offline || !input.trim()}
            aria-label="Send message"
            className="btn btn-solid !p-0 h-[42px] w-[42px] shrink-0"
          >
            {isStreaming ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Send className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
