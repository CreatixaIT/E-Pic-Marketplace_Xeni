export type CommerceProviderId = "mock" | "xeni";

/**
 * Which commerce backend the app talks to. Milestone 1 ships `mock` only;
 * `xeni` exists so the switch is a one-line change once that system is ready.
 */
export const commerceConfig = {
  provider: (process.env.NEXT_PUBLIC_COMMERCE_PROVIDER ??
    "mock") as CommerceProviderId,
} as const;
