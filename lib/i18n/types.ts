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
  cart: {
    empty: string;
    emptyDescription: string;
    addToCart: string;
    buyNow: string;
    quantity: string;
    remove: string;
    subtotal: string;
    checkout: string;
    keepShopping: string;
    clearCart: string;
    crossStoreTitle: string;
    crossStoreDescription: string;
    keepCurrentCart: string;
    clearAndAdd: string;
    items: string;
    inStock: string;
    lowStock: string;
    outOfStock: string;
  };
  product: {
    highlights: string;
    relatedProducts: string;
    backToStore: string;
  };
  checkout: {
    title: string;
    emptyCart: string;
    emptyCartDescription: string;
    keepShopping: string;
    steps: {
      customerDetails: string;
      deliveryAddress: string;
      paymentMethod: string;
      orderReview: string;
    };
    customerDetails: {
      title: string;
      description: string;
      fullName: string;
      fullNamePlaceholder: string;
      phone: string;
      phonePlaceholder: string;
      email: string;
      emailPlaceholder: string;
      emailExplanation: string;
      continue: string;
    };
    deliveryAddress: {
      title: string;
      description: string;
      recipientName: string;
      recipientNamePlaceholder: string;
      phone: string;
      phonePlaceholder: string;
      country: string;
      countryPlaceholder: string;
      city: string;
      cityPlaceholder: string;
      addressLine: string;
      addressLinePlaceholder: string;
      apartmentDetails: string;
      apartmentDetailsPlaceholder: string;
      deliveryInstructions: string;
      deliveryInstructionsPlaceholder: string;
      useCurrentLocation: string;
      locationExplanation: string;
      locationDenied: string;
      locationUnavailable: string;
      continue: string;
    };
    paymentMethod: {
      title: string;
      description: string;
      card: string;
      cardDescription: string;
      mobileWallet: string;
      mobileWalletDescription: string;
      cashOnDelivery: string;
      cashOnDeliveryDescription: string;
      continue: string;
    };
    orderReview: {
      title: string;
      description: string;
      customerDetails: string;
      deliveryAddress: string;
      paymentMethod: string;
      orderSummary: string;
      items: string;
      subtotal: string;
      shipping: string;
      shippingPlaceholder: string;
      taxes: string;
      taxesPlaceholder: string;
      total: string;
      edit: string;
      placeOrder: string;
      demoNotice: string;
    };
    confirmation: {
      title: string;
      demoMode: string;
      demoDescription: string;
      orderNumber: string;
      orderNumberPlaceholder: string;
      thankYou: string;
      whatHappensNext: string;
      whatHappensNextDescription: string;
      continueShopping: string;
      viewOrder: string;
    };
  };
  auth: {
    login: string;
    register: string;
    logout: string;
    email: string;
    password: string;
    confirmPassword: string;
    name: string;
    namePlaceholder: string;
    emailPlaceholder: string;
    passwordPlaceholder: string;
    confirmPasswordPlaceholder: string;
    loginTitle: string;
    loginDescription: string;
    registerTitle: string;
    registerDescription: string;
    noAccount: string;
    hasAccount: string;
    signUp: string;
    signIn: string;
    signingIn: string;
    registering: string;
    loginSuccess: string;
    registerSuccess: string;
    loginError: string;
    registerError: string;
    invalidEmail: string;
    invalidPassword: string;
    passwordMismatch: string;
    emailExists: string;
    weakPassword: string;
    requiredField: string;
    backToHome: string;
  };
};
