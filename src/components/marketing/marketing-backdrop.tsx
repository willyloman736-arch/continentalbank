"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Marketing-side ambient backdrop.
 *
 * The ivory paper texture stays as the base surface; we layer two
 * extremely soft warm halos and a subtle navy mist so the editorial
 * glass cards have something to refract.
 */
export function MarketingBackdrop() {
  const reduce = useReducedMotion();

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* Warm halo top-right — behind the hero statement card */}
      {reduce ? (
        <div
          className="absolute -top-[20%] -right-[10%] h-[80vh] w-[55vw] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(200,169,106,0.16) 0%, rgba(200,169,106,0) 60%)",
            filter: "blur(60px)",
          }}
        />
      ) : (
        <motion.div
          className="absolute -top-[20%] -right-[10%] h-[80vh] w-[55vw] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(200,169,106,0.18) 0%, rgba(200,169,106,0) 60%)",
            filter: "blur(60px)",
          }}
          animate={{
            x: [0, -22, 0],
            y: [0, 14, 0],
            opacity: [0.85, 1, 0.85],
          }}
          transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {/* Cool navy mist bottom-left */}
      {reduce ? (
        <div
          className="absolute bottom-[10%] -left-[15%] h-[60vh] w-[55vw] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(7,17,31,0.06) 0%, rgba(7,17,31,0) 60%)",
            filter: "blur(60px)",
          }}
        />
      ) : (
        <motion.div
          className="absolute bottom-[10%] -left-[15%] h-[60vh] w-[55vw] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(7,17,31,0.07) 0%, rgba(7,17,31,0) 60%)",
            filter: "blur(60px)",
          }}
          animate={{
            x: [0, 28, 0],
            y: [0, -16, 0],
            opacity: [0.6, 0.85, 0.6],
          }}
          transition={{ duration: 28, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        />
      )}

      {/* Second warm halo, mid-page */}
      {reduce ? (
        <div
          className="absolute top-[40%] left-[35%] h-[50vh] w-[45vw] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(200,169,106,0.07) 0%, rgba(200,169,106,0) 65%)",
            filter: "blur(60px)",
          }}
        />
      ) : (
        <motion.div
          className="absolute top-[40%] left-[35%] h-[50vh] w-[45vw] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(200,169,106,0.08) 0%, rgba(200,169,106,0) 65%)",
            filter: "blur(60px)",
          }}
          animate={{
            y: [0, -10, 0],
            opacity: [0.55, 0.8, 0.55],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 8 }}
        />
      )}
    </div>
  );
}
