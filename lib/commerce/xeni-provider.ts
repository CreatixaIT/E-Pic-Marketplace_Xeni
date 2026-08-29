import type { CommerceProvider } from "./types";

const NOT_IMPLEMENTED =
  "The Xeni commerce provider is not implemented yet. Set NEXT_PUBLIC_COMMERCE_PROVIDER=mock until the integration lands.";

function unimplemented(): never {
  throw new Error(NOT_IMPLEMENTED);
}

/**
 * Placeholder only. Endpoints, auth and payload shapes are deliberately absent
 * — they get filled in once the Xeni contract is published. The point of this
 * file is that the shape of the seam is already fixed.
 */
export const xeniProvider: CommerceProvider = {
  name: "xeni",
  getStores: unimplemented,
  getFeaturedStores: unimplemented,
  getStoreBySlug: unimplemented,
  getStoreById: unimplemented,
  getProducts: unimplemented,
  getProductsByStore: unimplemented,
  getProductsByCategory: unimplemented,
  getCategories: unimplemented,
  getCollection: unimplemented,
  getPromoSlides: unimplemented,
  getCart: unimplemented,
  getProductBySlug: unimplemented,
};
