import type { ChatMessage } from "@/lib/chat/useChatStream";
import { ResponseRenderer } from "@/components/chat/response-renderer";

export function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={isUser ? "max-w-[85%]" : "w-full max-w-[92%]"}>
        <div
          className={`whitespace-pre-line px-4 py-2.5 text-sm leading-relaxed ${
            isUser
              ? "bg-accent text-accent-fg"
              : "border border-line bg-surface text-fg"
          }`}
        >
          {message.text || (message.isStreaming ? <TypingDots /> : "")}
        </div>
        {message.response && <ResponseRenderer response={message.response} />}
      </div>
    </div>
  );
}

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1 py-0.5" role="status" aria-label="Assistant is typing">
      <span className="h-1.5 w-1.5 animate-bounce bg-muted [animation-delay:-0.3s]" />
      <span className="h-1.5 w-1.5 animate-bounce bg-muted [animation-delay:-0.15s]" />
      <span className="h-1.5 w-1.5 animate-bounce bg-muted" />
    </span>
  );
}
