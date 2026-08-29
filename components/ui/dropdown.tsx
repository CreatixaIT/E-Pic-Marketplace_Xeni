"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type DropdownOption<T extends string> = {
  value: T;
  label: string;
  /** Optional gradient classes rendered as a colour chip. */
  swatch?: string;
  hint?: string;
};

/**
 * Small listbox-style menu used by the preference selectors. Closes on
 * outside click and Escape, and returns focus to the trigger.
 */
export function Dropdown<T extends string>({
  label,
  trigger,
  options,
  value,
  onSelect,
  align = "end",
}: {
  label: string;
  trigger: ReactNode;
  options: DropdownOption<T>[];
  value: T;
  onSelect: (value: T) => void;
  align?: "start" | "end";
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        onClick={() => setOpen((current) => !current)}
        className="inline-flex items-center gap-2 rounded-full border border-border p-2.5 text-muted transition-colors hover:border-foreground/30 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        {trigger}
      </button>

      <AnimatePresence>
        {open ? (
          <motion.ul
            role="listbox"
            aria-label={label}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "absolute top-[calc(100%+0.5rem)] z-50 min-w-44 overflow-hidden rounded-2xl border border-border bg-surface p-1.5 shadow-2xl shadow-black/30",
              align === "end" ? "end-0" : "start-0",
            )}
          >
            {options.map((option) => (
              <li key={option.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={option.value === value}
                  onClick={() => {
                    onSelect(option.value);
                    setOpen(false);
                    triggerRef.current?.focus();
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-start text-sm text-muted transition-colors hover:bg-surface-2 hover:text-foreground focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent"
                >
                  {option.swatch ? (
                    <span
                      aria-hidden
                      className={cn(
                        "size-3.5 shrink-0 rounded-full bg-gradient-to-br",
                        option.swatch,
                      )}
                    />
                  ) : null}
                  <span className="flex-1">{option.label}</span>
                  {option.value === value ? (
                    <Check className="size-3.5 text-accent" aria-hidden />
                  ) : null}
                </button>
              </li>
            ))}
          </motion.ul>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
