"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { easings } from "./primitives";

type NavItemProps = {
  href: string;
  active: boolean;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  /** layoutId namespace — pass a different value per sidebar instance. */
  groupId: string;
};

/**
 * Premium sidebar nav item. The active background glides between items
 * using framer-motion's shared `layoutId` — a single highlight element
 * smoothly translates rather than fading in/out.
 */
export function NavItem({ href, active, icon: Icon, label, groupId }: NavItemProps) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group relative flex items-center gap-3 rounded-sm px-3 py-2 text-[13.5px] font-medium transition-colors duration-200",
        active
          ? "text-foreground"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/40",
      )}
    >
      {active && (
        <motion.span
          layoutId={`${groupId}-active`}
          className="absolute inset-0 rounded-sm bg-muted"
          transition={{ type: "tween", duration: 0.32, ease: easings.inOut }}
          aria-hidden
        />
      )}
      {active && (
        <motion.span
          layoutId={`${groupId}-rule`}
          className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-[2px] rounded-r-sm bg-champagne-500"
          transition={{ type: "tween", duration: 0.32, ease: easings.inOut }}
          aria-hidden
        />
      )}
      <Icon
        className={cn(
          "relative h-4 w-4 transition-colors duration-200",
          active ? "text-champagne-700 dark:text-champagne-400" : "opacity-70",
        )}
        strokeWidth={1.6}
      />
      <span className="relative">{label}</span>
    </Link>
  );
}
