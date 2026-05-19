"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Ambient backdrop for protected areas.
 *
 * Sits behind the dashboard/admin shell and gives the glass surfaces
 * something to refract. Three extremely soft halos drift over ~20s,
 * sub-pixel feel. Saturation kept low — this is private banking, not a
 * casino floor.
 */
export function AmbientBackdrop({ variant = "navy" }: { variant?: "navy" | "ivory" }) {
  const reduce = useReducedMotion();

  const isNavy = variant === "navy";

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Base gradient field */}
      <div
        className="absolute inset-0"
        style={{
          background: isNavy
            ? "radial-gradient(140% 100% at 50% 0%, #0E1B33 0%, #07111F 60%, #050B16 100%)"
            : "radial-gradient(140% 100% at 50% 0%, #FCFAF5 0%, #F6F1E8 60%, #EFE7D6 100%)",
        }}
      />

      {/* Halo A — top-left champagne */}
      {reduce ? (
        <div
          className="absolute -top-1/3 -left-1/4 h-[80vh] w-[60vw] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(200,169,106,0.14) 0%, rgba(200,169,106,0) 60%)",
            filter: "blur(40px)",
          }}
        />
      ) : (
        <motion.div
          className="absolute -top-1/3 -left-1/4 h-[80vh] w-[60vw] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(200,169,106,0.16) 0%, rgba(200,169,106,0) 60%)",
            filter: "blur(40px)",
          }}
          animate={{
            x: [0, 32, 0],
            y: [0, 18, 0],
            opacity: [0.85, 1, 0.85],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {/* Halo B — bottom-right navy/azure */}
      {reduce ? (
        <div
          className="absolute -bottom-1/4 -right-1/4 h-[90vh] w-[70vw] rounded-full"
          style={{
            background: isNavy
              ? "radial-gradient(circle, rgba(36,53,83,0.55) 0%, rgba(36,53,83,0) 60%)"
              : "radial-gradient(circle, rgba(200,169,106,0.08) 0%, rgba(200,169,106,0) 60%)",
            filter: "blur(60px)",
          }}
        />
      ) : (
        <motion.div
          className="absolute -bottom-1/4 -right-1/4 h-[90vh] w-[70vw] rounded-full"
          style={{
            background: isNavy
              ? "radial-gradient(circle, rgba(36,53,83,0.6) 0%, rgba(36,53,83,0) 60%)"
              : "radial-gradient(circle, rgba(200,169,106,0.1) 0%, rgba(200,169,106,0) 60%)",
            filter: "blur(60px)",
          }}
          animate={{
            x: [0, -28, 0],
            y: [0, -16, 0],
            opacity: [0.7, 0.95, 0.7],
          }}
          transition={{ duration: 26, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        />
      )}

      {/* Halo C — center bottom champagne accent */}
      {reduce ? (
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[60vh] w-[55vw] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(200,169,106,0.07) 0%, rgba(200,169,106,0) 65%)",
            filter: "blur(50px)",
          }}
        />
      ) : (
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[60vh] w-[55vw] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(200,169,106,0.08) 0%, rgba(200,169,106,0) 65%)",
            filter: "blur(50px)",
          }}
          animate={{
            y: [0, -12, 0],
            opacity: [0.6, 0.85, 0.6],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 6 }}
        />
      )}

      {/* Faint grain to break up the gradient banding */}
      <div
        className="absolute inset-0 opacity-[0.025] mix-blend-overlay"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
    </div>
  );
}
