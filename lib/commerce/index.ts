import { commerceConfig } from "@/config/commerce";
import { mockProvider } from "./mock-provider";
import type { CommerceProvider } from "./types";
import { xeniProvider } from "./xeni-provider";

const providers: Record<string, CommerceProvider> = {
  mock: mockProvider,
  xeni: xeniProvider,
};

/** Single entry point for data access. Components call this, never a provider. */
export function getCommerceProvider(): CommerceProvider {
  return providers[commerceConfig.provider] ?? mockProvider;
}

export * from "./types";
