"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { durations, easings } from "./primitives";

/**
 * Apple-style page transition.
 *
 * Almost invisible: 6px upward translate, 280ms with a refined cubic.
 * Outgoing content fades to clear, incoming clears in. No blur because
 * filter animations are expensive at 60fps and the brief asks for
 * "buttery smooth mobile performance" above effect.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className="relative">{children}</div>;
  }

  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{
          duration: durations.reveal,
          ease: easings.out,
        }}
        className="relative"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
