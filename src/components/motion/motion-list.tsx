"use client";

import * as React from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { durations, easings } from "./primitives";

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 4 },
  visible: { opacity: 1, y: 0, transition: { duration: durations.base, ease: easings.out } },
};

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.035, delayChildren: 0.05 } },
};

/**
 * Lightweight stagger for tabular row reveals.
 * Use as the <ul>/<ol> wrapper and `MotionRow` for each <li>.
 */
export function MotionList({
  children,
  className,
  as = "ul",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "ul" | "ol" | "div";
}) {
  const reduce = useReducedMotion();
  const Tag = motion.create(as as any);

  if (reduce) {
    const Plain = as as any;
    return <Plain className={className}>{children}</Plain>;
  }

  return (
    <Tag className={className} initial="hidden" animate="visible" variants={containerVariants}>
      {children}
    </Tag>
  );
}

export function MotionRow({
  children,
  className,
  as = "li",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "li" | "div" | "tr";
}) {
  const reduce = useReducedMotion();
  const Tag = motion.create(as as any);

  if (reduce) {
    const Plain = as as any;
    return <Plain className={className}>{children}</Plain>;
  }

  return (
    <Tag className={className} variants={itemVariants}>
      {children}
    </Tag>
  );
}
