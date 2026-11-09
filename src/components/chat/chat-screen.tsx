"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowUpRight, Loader2, Send } from "lucide-react";
import ThemeToggle from "@/components/theme-toggle";
import { MessageBubble } from "@/components/chat/message-bubble";
import { useChat } from "@/lib/chat/ChatProvider";
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
  "What is he currently learning?",
];

export default function ChatScreen() {
  const { messages, sendMessage, isStreaming, error, mode, setMode, clear } = useChat();
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

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
    if (!text || isStreaming) return;
    setInput("");
    void send(text);
  }

  function pick(prompt: string) {
    if (isStreaming) return;
    void send(prompt);
  }

  return (
    <div className="flex h-dvh flex-col bg-bg text-fg">
      <header className="border-b border-line">
        <div className="wrap flex max-w-3xl items-center justify-between gap-3 py-3">
          <div>
            <p className="font-display text-xl leading-none">{profile.shortName}</p>
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
            <Link href="/portfolio" className="btn !px-4 !py-2.5">
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
          {messages.length === 0 ? (
            <div className="pt-8 sm:pt-16">
              <p className="eyebrow">Hi, I&apos;m {profile.shortName}</p>
              <h1 className="mt-4 font-display text-5xl leading-[1.05] sm:text-6xl">
                Instead of browsing my portfolio, <em>ask.</em>
              </h1>
              <div className="mt-8 flex flex-wrap gap-2">
                {PROMPTS.map((p) => (
                  <button key={p} type="button" onClick={() => pick(p)} className="chip">
                    {p}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((m) => <MessageBubble key={m.id} message={m} />)
          )}
          {error && (
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
            placeholder={`Ask about ${profile.shortName}'s work…`}
            disabled={isStreaming}
            aria-label="Your question"
            className="field !border-b-0 border border-line-strong !px-3 !py-2.5 !text-sm"
          />
          <button
            type="submit"
            disabled={isStreaming || !input.trim()}
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
