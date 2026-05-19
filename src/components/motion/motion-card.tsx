"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { durations, easings } from "./primitives";

type Props = React.HTMLAttributes<HTMLDivElement> & {
  index?: number;
  hover?: boolean;
};

/**
 * Premium card wrapper:
 *  • subtle fade + 4px lift on mount, staggered by index
 *  • optional hover: 1px translateY lift + shadow deepening
 *
 * No springs, no glow, no scale.
 */
export const MotionCard = React.forwardRef<HTMLDivElement, Props>(function MotionCard(
  { className, index = 0, hover = false, children, ...props },
  ref,
) {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <div ref={ref} className={cn(className)} {...props}>
        {children}
      </div>
    );
  }

  const initial = { opacity: 0, y: 6 };
  const animate = { opacity: 1, y: 0 };
  const transition = {
    duration: durations.reveal,
    ease: easings.out,
    delay: 0.04 + index * 0.05,
  };

  return (
    <motion.div
      ref={ref}
      className={cn(
        "will-change-transform",
        hover && "transition-shadow duration-300 hover:shadow-soft-lg",
        className,
      )}
      initial={initial}
      animate={animate}
      transition={transition}
      whileHover={hover ? { y: -1 } : undefined}
      {...(props as any)}
    >
      {children}
    </motion.div>
  );
});
