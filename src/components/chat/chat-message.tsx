"use client";

import { motion } from "framer-motion";
import { Sparkles, User } from "lucide-react";
import { cn } from "~/lib/utils";
import type { Doc } from "../../../convex/_generated/dataModel";

interface ChatMessageProps {
  message: Doc<"chatMessages">;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className={cn("flex gap-2", isUser ? "flex-row-reverse" : "flex-row")}
      initial={{ opacity: 0, y: 8 }}
    >
      <div
        className={cn(
          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
          isUser ? "bg-white/10 text-white/60" : "bg-lime-400/15 text-lime-300"
        )}
      >
        {isUser ? <User className="h-3.5 w-3.5" /> : <Sparkles className="h-3.5 w-3.5" />}
      </div>
      <div
        className={cn(
          "max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed",
          isUser ? "bg-white/10 text-white" : "bg-white/[0.04] text-white/80"
        )}
      >
        {message.content}
      </div>
    </motion.div>
  );
}