"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { durations, easings } from "./primitives";

type Props = React.HTMLAttributes<HTMLDivElement> & {
  index?: number;
  hover?: boolean;
  /** "glass" = frosted surface, "solid" = original opaque card, "none" = no surface (caller styles it). */
  surface?: "glass" | "solid" | "none";
  /** "strong" = larger blur + radius (hero / statement cards) */
  intensity?: "default" | "strong";
};

/**
 * Premium card wrapper. Glass surface by default — a frosted panel with
 * a hairline border, top inner highlight, and a soft shadow. Mount
 * animation is a subtle fade + 6-8px lift, staggered by index.
 *
 * Pass surface="none" to let the caller style it entirely.
 */
export const MotionCard = React.forwardRef<HTMLDivElement, Props>(function MotionCard(
  { className, index = 0, hover = false, surface = "glass", intensity = "default", children, ...props },
  ref,
) {
  const reduce = useReducedMotion();

  const surfaceClass =
    surface === "glass"
      ? intensity === "strong"
        ? "glass-strong"
        : "glass-card"
      : surface === "solid"
        ? "rounded-md border border-border bg-card text-card-foreground shadow-soft-sm"
        : "";

  if (reduce) {
    return (
      <div ref={ref} className={cn(surfaceClass, className)} {...props}>
        {children}
      </div>
    );
  }

  const initial = { opacity: 0, y: 8 };
  const animate = { opacity: 1, y: 0 };
  const transition = {
    duration: durations.reveal,
    ease: easings.out,
    delay: 0.04 + index * 0.05,
  };

  return (
    <motion.div
      ref={ref}
      className={cn("will-change-transform", surfaceClass, className)}
      initial={initial}
      animate={animate}
      transition={transition}
      whileHover={hover ? { y: -2 } : undefined}
      {...(props as any)}
    >
      {children}
    </motion.div>
  );
});
