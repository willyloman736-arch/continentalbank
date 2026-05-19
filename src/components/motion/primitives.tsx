"use client";

import { type ComponentProps, type ElementType, type ReactNode } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

/* ---------------------------------------------------------- *
 *  Continental motion language
 *
 *  Durations: 180–380ms. Curves: easeOut + a custom luxury
 *  cubic-bezier for emphasis. Translations: never beyond 12px.
 *  No springs, no bouncing, no rotation, no scale > 1.02.
 * ---------------------------------------------------------- */

export const easings = {
  /** Default — fast tail, smooth landing. Used for entrances. */
  out: [0.16, 1, 0.3, 1] as [number, number, number, number],
  /** Soft inverse — used for exits. */
  in: [0.7, 0, 0.84, 0] as [number, number, number, number],
  /** Symmetric — used for cross-fades and shared layouts. */
  inOut: [0.65, 0, 0.35, 1] as [number, number, number, number],
};

export const durations = {
  micro: 0.18,
  base: 0.28,
  reveal: 0.36,
  deliberate: 0.48,
};

/* ---------------------------------------------------------- *
 *  Variants
 * ---------------------------------------------------------- */

export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: durations.reveal, ease: easings.out },
  },
};

export const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: durations.base, ease: easings.out } },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.04 },
  },
};

export const heroStagger: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.08 },
  },
};

/* ---------------------------------------------------------- *
 *  <Reveal> — fade up on viewport entry. Default for marketing.
 * ---------------------------------------------------------- */

type RevealProps = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  delay?: number;
  amount?: number;
  once?: boolean;
};

export function Reveal({
  children,
  className,
  as = "div",
  delay = 0,
  amount = 0.2,
  once = true,
}: RevealProps) {
  const reduce = useReducedMotion();
  const MotionTag = motion.create(as as any);

  if (reduce) {
    const Tag = as as ElementType;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={fadeUpVariants}
      transition={{ duration: durations.reveal, ease: easings.out, delay }}
    >
      {children}
    </MotionTag>
  );
}

/* ---------------------------------------------------------- *
 *  <Stagger> — animate children in sequence on viewport entry.
 * ---------------------------------------------------------- */

type StaggerProps = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  delay?: number;
  step?: number;
  amount?: number;
  variant?: "default" | "hero";
};

export function Stagger({
  children,
  className,
  as = "div",
  delay = 0,
  step = 0.06,
  amount = 0.2,
  variant = "default",
}: StaggerProps) {
  const reduce = useReducedMotion();
  const MotionTag = motion.create(as as any);

  if (reduce) {
    const Tag = as as ElementType;
    return <Tag className={className}>{children}</Tag>;
  }

  const container: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: step,
        delayChildren: delay + (variant === "hero" ? 0.08 : 0.04),
      },
    },
  };

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={container}
    >
      {children}
    </MotionTag>
  );
}

/**
 * <StaggerItem> — direct child of <Stagger>. Fades + lifts in.
 */
export function StaggerItem({
  children,
  className,
  as = "div",
  ...rest
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
} & ComponentProps<typeof motion.div>) {
  const MotionTag = motion.create(as as any);
  return (
    <MotionTag className={className} variants={fadeUpVariants} {...rest}>
      {children}
    </MotionTag>
  );
}

/* ---------------------------------------------------------- *
 *  <Fade> — opacity-only crossfade, no movement.
 * ---------------------------------------------------------- */

export function Fade({
  children,
  className,
  as = "div",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const MotionTag = motion.create(as as any);

  if (reduce) {
    const Tag = as as ElementType;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: durations.base, ease: easings.out, delay }}
    >
      {children}
    </MotionTag>
  );
}
