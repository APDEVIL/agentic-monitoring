"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "~/lib/utils";

interface SpotlightCursorProps {
  children: React.ReactNode;
  className?: string;
  size?: number;
  color?: string;
}

export function SpotlightCursor({
  children,
  className,
  size = 500,
  color = "rgba(16, 185, 129, 0.15)",
}: SpotlightCursorProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { damping: 30, stiffness: 200, mass: 0.5 });
  const springY = useSpring(mouseY, { damping: 30, stiffness: 200, mass: 0.5 });

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    }

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div ref={containerRef} className={cn("relative overflow-hidden", className)}>
      <motion.div
        className="pointer-events-none absolute rounded-full blur-3xl"
        style={{
          width: size,
          height: size,
          left: springX,
          top: springY,
          x: "-50%",
          y: "-50%",
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}