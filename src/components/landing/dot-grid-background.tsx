export function DotGridBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute left-0 top-0 h-[420px] w-[420px] opacity-70"
      style={{
        backgroundImage:
          "radial-gradient(circle, rgba(52, 211, 153, 0.9) 1px, transparent 1.5px)",
        backgroundSize: "14px 14px",
        WebkitMaskImage:
          "radial-gradient(circle at 0% 0%, black 0%, black 30%, transparent 75%)",
        maskImage:
          "radial-gradient(circle at 0% 0%, black 0%, black 30%, transparent 75%)",
      }}
    />
  );
}