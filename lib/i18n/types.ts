/**
 * The shape every dictionary must satisfy. Adding a key here makes the
 * compiler demand a translation in every active locale.
 */
export type Dictionary = {
  nav: {
    home: string;
    explore: string;
    stores: string;
    openStore: string;
    about: string;
    cart: string;
    cartLabel: string;
    openMenu: string;
    closeMenu: string;
  };
  preferences: {
    theme: string;
    language: string;
  };
  hero: {
    badge: string;
    tagline: string;
    previous: string;
    next: string;
    pause: string;
    play: string;
    slideLabel: string;
    goToSlide: string;
  };
  discovery: {
    eyebrow: string;
    title: string;
    description: string;
    allCategories: string;
    empty: string;
    viewAll: string;
    resultCount: string;
  };
  collections: {
    eyebrow: string;
    title: string;
    description: string;
    trending: string;
    featured: string;
    newArrivals: string;
  };
  worlds: {
    eyebrow: string;
    title: string;
    description: string;
    enterStore: string;
    viewAllStores: string;
    products: string;
  };
  seller: {
    eyebrow: string;
    title: string;
    description: string;
    cta: string;
    secondaryCta: string;
  };
  footer: {
    marketplace: string;
    sellers: string;
    note: string;
  };
  badges: {
    new: string;
    featured: string;
    trending: string;
  };
};
