"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useMutation, useQuery } from "convex/react";
import { Plus, Send, Sparkles } from "lucide-react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { Button } from "~/components/ui/button";
import { ChatMessage } from "./chat-message";
import { QuickActions } from "./quick-actions";

interface AskPanelProps {
  projectId: Id<"projects">;
}

export function AskPanel({ projectId }: AskPanelProps) {
  const [input, setInput] = useState("");
  const messages = useQuery(api.chat.list, { projectId });
  const sendQuestion = useMutation(api.chat.sendQuestion);
  const bottomRef = useRef<HTMLDivElement>(null);

  const pending = !!messages && messages.length > 0 && messages[messages.length - 1]?.role === "user";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  async function submitQuestion(question: string) {
    const trimmed = question.trim();
    if (!trimmed || pending) return;
    setInput("");
    await sendQuestion({ projectId, question: trimmed });
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    void submitQuestion(input);
  }

  return (
    <div className="flex h-full w-80 flex-col border-l border-white/10 bg-[#0b0f0e]">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-2 text-white">
          <Sparkles className="h-4 w-4 text-lime-400" />
          <span className="text-sm font-medium">Ask Pulse</span>
        </div>
        <Button className="h-7 w-7 text-white/40 hover:text-white" size="icon-sm" variant="ghost">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
        {messages === undefined ? (
          <p className="text-xs text-white/30">Loading conversation...</p>
        ) : messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-white/30">
            <Sparkles className="h-6 w-6" />
            <p className="text-xs">Ask about this project&apos;s incidents, trends, or fixes.</p>
          </div>
        ) : (
          messages.map((message) => <ChatMessage key={message._id} message={message} />)
        )}

        {pending ? (
          <div className="flex items-center gap-2 text-xs text-white/40">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-lime-400" />
            Pulse is thinking...
          </div>
        ) : null}

        <div ref={bottomRef} />
      </div>

      <div className="space-y-3 border-t border-white/10 px-4 py-3">
        <QuickActions disabled={pending} onSelect={(q) => void submitQuestion(q)} />

        <form className="flex items-center gap-2" onSubmit={handleSubmit}>
          <input
            className="flex-1 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-lime-400/40 focus:outline-none"
            disabled={pending}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your agents..."
            value={input}
          />
          <Button
            className="h-9 w-9 shrink-0 bg-lime-400 text-black hover:bg-lime-300 disabled:bg-white/10 disabled:text-white/30"
            disabled={pending || !input.trim()}
            size="icon"
            type="submit"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}