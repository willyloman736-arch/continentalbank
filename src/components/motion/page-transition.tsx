"use client";

import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { durations, easings } from "./primitives";

/**
 * Soft route transition for protected areas (dashboard / admin).
 * Almost invisible: 6px lift, 240ms, easeOut. Keyed on pathname so each
 * route triggers a fresh entrance.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className="relative">{children}</div>;
  }

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: durations.reveal, ease: easings.out }}
      className="relative"
    >
      {children}
    </motion.div>
  );
}
