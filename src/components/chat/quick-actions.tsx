"use client";

const SUGGESTIONS = [
  "Why did the last check fail?",
  "Summarize today's incidents",
  "What's my success rate trend?",
  "Suggest a fix for the latest incident",
];

interface QuickActionsProps {
  onSelect: (question: string) => void;
  disabled?: boolean;
}

export function QuickActions({ onSelect, disabled }: QuickActionsProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {SUGGESTIONS.map((suggestion) => (
        <button
          className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs text-white/60 transition-colors hover:border-lime-400/30 hover:text-lime-300 disabled:pointer-events-none disabled:opacity-40"
          disabled={disabled}
          key={suggestion}
          onClick={() => onSelect(suggestion)}
          type="button"
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
}