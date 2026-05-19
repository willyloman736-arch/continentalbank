"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Marketing header that tightens on scroll:
 *  • border opacity fades in
 *  • background blur intensifies
 *  • subtle shadow appears
 *
 * No height changes, no slide-up — the header stays still; only its surface
 * properties shift, which reads as "premium" rather than "playful."
 */
export function ScrollAwareHeader({ children }: { children: React.ReactNode }) {
  const { scrollY } = useScroll();

  const borderOpacity = useTransform(scrollY, [0, 80], [0.0, 1]);
  const blur = useTransform(scrollY, [0, 80], [0, 14]);
  const bgOpacity = useTransform(scrollY, [0, 80], [0.55, 0.85]);
  const shadow = useTransform(
    scrollY,
    [0, 120],
    ["0 0 0 rgba(0,0,0,0)", "0 8px 28px -16px rgba(7, 17, 31, 0.18)"],
  );

  const backdropFilter = useTransform(blur, (v) => `blur(${v}px)`);
  const background = useTransform(
    bgOpacity,
    (v) => `hsl(var(--background) / ${v})`,
  );

  return (
    <header className="sticky top-0 z-40 w-full">
      <motion.div
        className={cn("relative")}
        style={{
          background,
          backdropFilter,
          WebkitBackdropFilter: backdropFilter,
          boxShadow: shadow,
        }}
      >
        <motion.div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-border"
          style={{ opacity: borderOpacity }}
        />
        {children}
      </motion.div>
    </header>
  );
}
