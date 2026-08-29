"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Store } from "@/lib/commerce/types";

/**
 * A stacked, parallaxing preview of branded storefronts — the visual promise of
 * "enter their world" without any 3D/WebGL dependency.
 */
export function StorefrontStage({ stores }: { stores: Store[] }) {
  const reduced = useReducedMotion();

  return (
    <div className="relative h-[26rem] w-full">
      {stores.slice(0, 3).map((store, index) => (
        <motion.div
          key={store.id}
          className={`absolute inset-x-0 mx-auto overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br ${store.cover.gradient} shadow-2xl shadow-black/50`}
          style={{
            top: index * 128,
            width: `${88 - index * 6}%`,
            zIndex: 3 - index,
          }}
          initial={reduced ? false : { opacity: 0, y: 40, scale: 0.94 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{
            duration: 0.7,
            delay: index * 0.12,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <div className="flex h-36 flex-col justify-end bg-black/25 p-6 backdrop-blur-[2px]">
            <p className="text-xs tracking-[0.2em] text-white/70 uppercase">
              {store.category}
            </p>
            <p className="mt-1 text-xl font-semibold text-white">
              {store.name}
            </p>
            <p className="text-sm text-white/80">{store.tagline}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
