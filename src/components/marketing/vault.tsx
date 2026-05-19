"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Continental Bank — Vault door.
 *
 * A pure-SVG, code-drawn vault that runs a short choreographed sequence
 * on mount (plays on every visit):
 *
 *   T=0      enter: opacity + slight scale settling
 *   T=0.9s   spoke wheel begins 270° clockwise rotation
 *   T=1.5s   12 radial bolts engage outward (staggered ~40ms apart)
 *   T=2.0s   lock indicator switches from idle to champagne
 *
 * Reduced motion: the vault renders in its final locked state with no
 * animation. All visuals are hand-drawn — no external assets.
 */

const SIZE = 600;          // viewBox dimension
const C = SIZE / 2;        // centre
const BOLT_COUNT = 12;
const BOLT_INNER_R = 226;  // bolt position when retracted (unlocked)
const BOLT_OUTER_R = 252;  // bolt position when extended (locked)

const easeOut = [0.16, 1, 0.3, 1] as [number, number, number, number];
const easeInOut = [0.65, 0, 0.35, 1] as [number, number, number, number];

export function Vault({ size = 480 }: { size?: number }) {
  const reduce = useReducedMotion();

  // Timing — all numbers in seconds.
  const tEnter = 0.7;
  const tWheelDelay = 0.9;
  const tWheel = 1.0;
  const tBoltsDelay = tWheelDelay + 0.6;
  const tBolt = 0.5;
  const tIndicatorDelay = tWheelDelay + tWheel + 0.1;

  return (
    <div
      className="relative"
      style={{ width: size, height: size }}
      aria-label="Continental Bank vault — sealed"
      role="img"
    >
      {/* Soft champagne halo behind the vault */}
      <motion.div
        aria-hidden
        className="absolute -inset-[18%] pointer-events-none"
        style={{
          background:
            "radial-gradient(closest-side, rgba(200,169,106,0.20) 0%, rgba(200,169,106,0.05) 35%, rgba(200,169,106,0) 70%)",
          filter: "blur(26px)",
        }}
        animate={
          reduce
            ? undefined
            : { opacity: [0.55, 0.8, 0.55], scale: [1, 1.02, 1] }
        }
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Ground shadow */}
      <div
        aria-hidden
        className="absolute left-1/2 -translate-x-1/2 bottom-[-4%] w-[78%] h-[5%] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 70%)",
          filter: "blur(8px)",
        }}
      />

      <motion.svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="relative w-full h-full"
        initial={reduce ? false : { opacity: 0, scale: 0.96, y: 4 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: tEnter, ease: easeOut }}
        style={{ filter: "drop-shadow(0 30px 60px rgba(7, 17, 31, 0.55))" }}
      >
        <defs>
          {/* Outer frame — recessed steel jamb */}
          <radialGradient id="v-frame" cx="40%" cy="35%" r="80%">
            <stop offset="0%" stopColor="#3A4B6B" />
            <stop offset="60%" stopColor="#1A2541" />
            <stop offset="100%" stopColor="#070D18" />
          </radialGradient>

          {/* Outer ring rim — dark steel */}
          <linearGradient id="v-ring-outer" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2B3B5C" />
            <stop offset="100%" stopColor="#0A1527" />
          </linearGradient>

          {/* Door body — brushed navy steel */}
          <radialGradient id="v-body" cx="35%" cy="30%" r="85%">
            <stop offset="0%" stopColor="#2A3954" />
            <stop offset="55%" stopColor="#152340" />
            <stop offset="100%" stopColor="#07111F" />
          </radialGradient>

          {/* Body highlight — soft light source from top-left */}
          <radialGradient id="v-body-hi" cx="30%" cy="20%" r="60%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.10)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>

          {/* Champagne gradient */}
          <linearGradient id="v-gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#E5CE94" />
            <stop offset="50%" stopColor="#C8A96A" />
            <stop offset="100%" stopColor="#8C6E3C" />
          </linearGradient>

          {/* Champagne ring with subtle radial sheen */}
          <radialGradient id="v-gold-radial" cx="50%" cy="50%" r="50%">
            <stop offset="80%" stopColor="rgba(200,169,106,0)" />
            <stop offset="100%" stopColor="rgba(200,169,106,0.5)" />
          </radialGradient>

          {/* Bolt — cylinder seen end-on */}
          <radialGradient id="v-bolt" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#F4E2B0" />
            <stop offset="55%" stopColor="#C8A96A" />
            <stop offset="100%" stopColor="#6D4F22" />
          </radialGradient>

          {/* Hub centre */}
          <radialGradient id="v-hub" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#E5CE94" />
            <stop offset="100%" stopColor="#6D4F22" />
          </radialGradient>

          {/* Bevel highlight for the door edge */}
          <linearGradient id="v-bevel" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.18)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.35)" />
          </linearGradient>
        </defs>

        {/* ============ JAMB / WALL FRAME (fixed) ============ */}

        {/* Hinges visible on the left side of the door */}
        {[180, 420].map((y) => (
          <g key={y}>
            <rect x={C - 295} y={y - 24} width="36" height="48" rx="3" fill="#0A1527" />
            <rect x={C - 290} y={y - 18} width="26" height="36" rx="2" fill="url(#v-ring-outer)" />
            <circle cx={C - 277} cy={y - 6} r="2" fill="#3A4B6B" />
            <circle cx={C - 277} cy={y + 6} r="2" fill="#3A4B6B" />
          </g>
        ))}

        {/* Outer frame ring (the recessed wall jamb) */}
        <circle cx={C} cy={C} r="288" fill="url(#v-frame)" />
        <circle
          cx={C}
          cy={C}
          r="288"
          fill="none"
          stroke="rgba(200,169,106,0.18)"
          strokeWidth="1"
        />

        {/* Inner shadow ring on the frame */}
        <circle
          cx={C}
          cy={C}
          r="270"
          fill="none"
          stroke="rgba(0,0,0,0.4)"
          strokeWidth="3"
        />

        {/* Tiny rivets along the frame */}
        {Array.from({ length: 32 }).map((_, i) => {
          const a = (i / 32) * Math.PI * 2;
          const x = C + Math.cos(a) * 278;
          const y = C + Math.sin(a) * 278;
          return <circle key={i} cx={x} cy={y} r="2" fill="#0E1B33" />;
        })}

        {/* ============ DOOR BODY ============ */}

        {/* Outer door rim - champagne */}
        <circle
          cx={C}
          cy={C}
          r="264"
          fill="url(#v-ring-outer)"
          stroke="url(#v-gold)"
          strokeWidth="1"
        />

        {/* Door slab */}
        <circle cx={C} cy={C} r="258" fill="url(#v-body)" />
        {/* Highlight wash */}
        <circle cx={C} cy={C} r="258" fill="url(#v-body-hi)" />
        {/* Bevel */}
        <circle
          cx={C}
          cy={C}
          r="258"
          fill="none"
          stroke="url(#v-bevel)"
          strokeWidth="2"
        />

        {/* Decorative concentric rings */}
        <circle cx={C} cy={C} r="220" fill="none" stroke="rgba(200,169,106,0.10)" strokeWidth="1" />
        <circle cx={C} cy={C} r="200" fill="none" stroke="rgba(200,169,106,0.18)" strokeWidth="1" />
        <circle cx={C} cy={C} r="180" fill="none" stroke="rgba(200,169,106,0.10)" strokeWidth="1" />

        {/* Gear-tooth inner ring — fine champagne marks */}
        {Array.from({ length: 60 }).map((_, i) => {
          const a = (i / 60) * Math.PI * 2;
          const r1 = 168;
          const r2 = 174;
          const x1 = C + Math.cos(a) * r1;
          const y1 = C + Math.sin(a) * r1;
          const x2 = C + Math.cos(a) * r2;
          const y2 = C + Math.sin(a) * r2;
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="rgba(200,169,106,0.35)"
              strokeWidth="0.8"
            />
          );
        })}

        {/* ============ RADIAL BOLTS ============ */}
        {Array.from({ length: BOLT_COUNT }).map((_, i) => {
          // Angle measured from 12-o'clock, going clockwise.
          const angleDeg = (i / BOLT_COUNT) * 360 - 90;
          const angleRad = (angleDeg * Math.PI) / 180;
          const finalX = C + Math.cos(angleRad) * BOLT_OUTER_R;
          const finalY = C + Math.sin(angleRad) * BOLT_OUTER_R;
          const startOffsetX = Math.cos(angleRad) * (BOLT_INNER_R - BOLT_OUTER_R);
          const startOffsetY = Math.sin(angleRad) * (BOLT_INNER_R - BOLT_OUTER_R);
          const delay = tBoltsDelay + i * 0.04;
          const highlightX = finalX - Math.cos(angleRad - Math.PI / 4) * 3;
          const highlightY = finalY - Math.sin(angleRad - Math.PI / 4) * 3;
          return (
            <motion.g
              key={i}
              initial={reduce ? false : { x: startOffsetX, y: startOffsetY }}
              animate={{ x: 0, y: 0 }}
              transition={{ duration: tBolt, delay, ease: easeOut }}
            >
              <circle cx={finalX} cy={finalY} r="12" fill="url(#v-bolt)" />
              <circle
                cx={finalX}
                cy={finalY}
                r="12"
                fill="none"
                stroke="rgba(0,0,0,0.4)"
                strokeWidth="0.8"
              />
              <circle cx={highlightX} cy={highlightY} r="3" fill="rgba(255,235,180,0.4)" />
            </motion.g>
          );
        })}

        {/* ============ CENTRAL HUB + WHEEL ============ */}

        {/* Centre plate ring */}
        <circle
          cx={C}
          cy={C}
          r="108"
          fill="url(#v-body)"
          stroke="url(#v-gold)"
          strokeWidth="1.5"
        />
        <circle cx={C} cy={C} r="108" fill="url(#v-body-hi)" />

        {/* Engraved CB seal between hub and wheel */}
        <text
          x={C}
          y={C - 78}
          textAnchor="middle"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontSize="9"
          letterSpacing="2"
          fill="rgba(200,169,106,0.55)"
          dominantBaseline="middle"
        >
          CONTINENTAL · BANK · GENEVA
        </text>

        {/* The rotating spoke wheel */}
        <motion.g
          initial={reduce ? false : { rotate: 0 }}
          animate={{ rotate: 270 }}
          transition={{ duration: tWheel, delay: tWheelDelay, ease: easeInOut }}
          style={{ transformOrigin: `${C}px ${C}px`, transformBox: "fill-box" }}
        >
          {/* Outer wheel ring */}
          <circle
            cx={C}
            cy={C}
            r="86"
            fill="url(#v-body)"
            stroke="url(#v-gold)"
            strokeWidth="1.5"
          />

          {/* Four spokes */}
          {[0, 45, 90, 135].map((deg) => (
            <g key={deg} transform={`rotate(${deg} ${C} ${C})`}>
              <rect
                x={C - 3}
                y={C - 86}
                width="6"
                height="172"
                rx="2"
                fill="url(#v-gold)"
              />
              <rect
                x={C - 2}
                y={C - 86}
                width="2"
                height="172"
                fill="rgba(255,255,255,0.18)"
              />
            </g>
          ))}

          {/* Outer wheel grip knobs */}
          {[0, 90, 180, 270].map((deg) => (
            <g key={deg} transform={`rotate(${deg} ${C} ${C})`}>
              <circle cx={C} cy={C - 86} r="7" fill="url(#v-bolt)" />
              <circle cx={C - 2} cy={C - 88} r="2" fill="rgba(255,235,180,0.5)" />
            </g>
          ))}

          {/* Centre hub */}
          <circle cx={C} cy={C} r="28" fill="url(#v-hub)" />
          <circle cx={C} cy={C} r="28" fill="none" stroke="rgba(0,0,0,0.4)" strokeWidth="1" />
          <circle cx={C} cy={C} r="14" fill="#07111F" />
          <circle cx={C - 3} cy={C - 3} r="4" fill="rgba(255,235,180,0.35)" />
        </motion.g>

        {/* ============ LOCK STATUS INDICATOR ============ */}
        {/* Small champagne lamp at the 6-o'clock of the inner ring */}
        <g>
          {/* Surround */}
          <circle
            cx={C}
            cy={C + 138}
            r="9"
            fill="#0A1527"
            stroke="url(#v-gold)"
            strokeWidth="0.8"
          />
          {/* Lamp — starts dim, turns champagne when locked */}
          <motion.circle
            cx={C}
            cy={C + 138}
            r="5"
            initial={reduce ? false : { fill: "#1A2541", opacity: 0.6 }}
            animate={{ fill: "#C8A96A", opacity: 1 }}
            transition={{ duration: 0.5, delay: tIndicatorDelay, ease: easeOut }}
          />
          {/* Bloom */}
          <motion.circle
            cx={C}
            cy={C + 138}
            r="14"
            fill="rgba(200,169,106,0.4)"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ duration: 0.6, delay: tIndicatorDelay, ease: easeOut }}
            style={{ filter: "blur(6px)" }}
          />
        </g>
      </motion.svg>

      {/* Sealed indicator (caption beside the vault) */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 -bottom-2 sm:bottom-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10.5px] uppercase tracking-[0.22em]"
        style={{
          background: "rgba(7,17,31,0.7)",
          border: "1px solid rgba(200,169,106,0.3)",
          color: "#E5CE94",
          backdropFilter: "blur(8px)",
        }}
        initial={reduce ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: tIndicatorDelay + 0.1, ease: easeOut }}
      >
        <motion.span
          className="h-1.5 w-1.5 rounded-full"
          style={{ background: "#C8A96A", boxShadow: "0 0 6px rgba(200,169,106,0.8)" }}
          animate={reduce ? undefined : { opacity: [1, 0.5, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />
        Sealed · Continental
      </motion.div>
    </div>
  );
}
