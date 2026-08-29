"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Slow-drifting colour fields behind the hero. Pure CSS gradients and
 * transforms — deliberately no canvas, WebGL or 3D dependency.
 */
export function AmbientBackdrop() {
  const reduced = useReducedMotion();

  const blobs = [
    {
      className: "left-[-10%] top-[-20%] size-[38rem] bg-violet-600/25",
      drift: { x: [0, 60, 0], y: [0, 40, 0] },
      duration: 18,
    },
    {
      className: "right-[-15%] top-[10%] size-[32rem] bg-sky-500/20",
      drift: { x: [0, -50, 0], y: [0, 60, 0] },
      duration: 22,
    },
    {
      className: "bottom-[-25%] left-[25%] size-[34rem] bg-fuchsia-500/15",
      drift: { x: [0, 40, 0], y: [0, -40, 0] },
      duration: 26,
    },
  ];

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {blobs.map((blob) => (
        <motion.div
          key={blob.className}
          className={`absolute rounded-full blur-[110px] ${blob.className}`}
          animate={reduced ? undefined : blob.drift}
          transition={{
            duration: blob.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent_25%,var(--background)_75%)]" />
    </div>
  );
}
