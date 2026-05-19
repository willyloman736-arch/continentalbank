"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Hero "statement card" backdrop. Two extremely subtle gold halos that
 * breathe over ~14 seconds. Movement is sub-pixel-feeling; the goal is
 * presence, not motion.
 */
export function HeroBackdrop() {
  const reduce = useReducedMotion();

  return (
    <>
      <div
        className="absolute inset-0 opacity-90"
        style={{
          background:
            "linear-gradient(155deg, #07111F 0%, #0A1527 55%, #07111F 100%)",
        }}
        aria-hidden
      />

      {reduce ? (
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, #C8A96A 0%, transparent 35%), radial-gradient(circle at 75% 75%, #C8A96A 0%, transparent 40%)",
          }}
          aria-hidden
        />
      ) : (
        <>
          <motion.div
            className="absolute -top-1/4 -left-1/4 h-[60%] w-[60%] rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(200,169,106,0.18) 0%, rgba(200,169,106,0) 65%)",
              filter: "blur(8px)",
            }}
            animate={{
              x: [0, 12, 0],
              y: [0, 8, 0],
              opacity: [0.55, 0.7, 0.55],
            }}
            transition={{
              duration: 16,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            aria-hidden
          />
          <motion.div
            className="absolute -bottom-1/4 -right-1/4 h-[55%] w-[55%] rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(200,169,106,0.16) 0%, rgba(200,169,106,0) 60%)",
              filter: "blur(8px)",
            }}
            animate={{
              x: [0, -10, 0],
              y: [0, -6, 0],
              opacity: [0.5, 0.7, 0.5],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
            aria-hidden
          />
        </>
      )}
    </>
  );
}
