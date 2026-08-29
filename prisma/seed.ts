import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database seed...')

  // Clear existing data (respect foreign key constraints)
  await prisma.wishlistItem.deleteMany()
  await prisma.wishlist.deleteMany()
  await prisma.review.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.cartItem.deleteMany()
  await prisma.cart.deleteMany()
  await prisma.address.deleteMany()
  await prisma.inventory.deleteMany()
  await prisma.productImage.deleteMany()
  await prisma.product.deleteMany()
  await prisma.store.deleteMany()
  await prisma.seller.deleteMany()
  await prisma.profile.deleteMany()
  await prisma.category.deleteMany()
  await prisma.user.deleteMany()

  console.log('Cleared existing data')

  // Create Categories
  await Promise.all([
    prisma.category.create({
      data: {
        idString: 'fashion',
        label: 'Fashion'
      }
    }),
    prisma.category.create({
      data: {
        idString: 'technology',
        label: 'Technology'
      }
    }),
    prisma.category.create({
      data: {
        idString: 'home',
        label: 'Home'
      }
    }),
    prisma.category.create({
      data: {
        idString: 'beauty',
        label: 'Beauty'
      }
    }),
    prisma.category.create({
      data: {
        idString: 'lifestyle',
        label: 'Lifestyle'
      }
    })
  ])

  console.log('Created categories')

  // Hash passwords for seed users
  const testPassword = await bcrypt.hash('password123', 12)
  const sellerPassword = await bcrypt.hash('seller123', 12)

  // Create a test user
  await prisma.user.create({
    data: {
      email: 'test@example.com',
      password: testPassword,
      role: 'BUYER',
      status: 'ACTIVE'
    }
  })

  console.log('Created test user')

  // Create seller users
  const [auroraUser, northboundUser, monoUser, verdantUser, slowpressUser, hallowUser] = await Promise.all([
    prisma.user.create({
      data: {
        email: 'aurora@example.com',
        password: sellerPassword,
        role: 'SELLER',
        status: 'ACTIVE'
      }
    }),
    prisma.user.create({
      data: {
        email: 'northbound@example.com',
        password: sellerPassword,
        role: 'SELLER',
        status: 'ACTIVE'
      }
    }),
    prisma.user.create({
      data: {
        email: 'mono@example.com',
        password: sellerPassword,
        role: 'SELLER',
        status: 'ACTIVE'
      }
    }),
    prisma.user.create({
      data: {
        email: 'verdant@example.com',
        password: sellerPassword,
        role: 'SELLER',
        status: 'ACTIVE'
      }
    }),
    prisma.user.create({
      data: {
        email: 'slowpress@example.com',
        password: sellerPassword,
        role: 'SELLER',
        status: 'ACTIVE'
      }
    }),
    prisma.user.create({
      data: {
        email: 'hallow@example.com',
        password: sellerPassword,
        role: 'SELLER',
        status: 'ACTIVE'
      }
    })
  ])

  console.log('Created seller users')

  // Create Sellers
  const sellers = await Promise.all([
    prisma.seller.create({
      data: {
        userId: auroraUser.id,
        businessName: 'Aurora Atelier Ltd',
        verificationStatus: 'PENDING',
        verificationDocuments: JSON.stringify([])
      }
    }),
    prisma.seller.create({
      data: {
        userId: northboundUser.id,
        businessName: 'Northbound Supply AS',
        verificationStatus: 'PENDING',
        verificationDocuments: JSON.stringify([])
      }
    }),
    prisma.seller.create({
      data: {
        userId: monoUser.id,
        businessName: 'Mono Goods KK',
        verificationStatus: 'PENDING',
        verificationDocuments: JSON.stringify([])
      }
    }),
    prisma.seller.create({
      data: {
        userId: verdantUser.id,
        businessName: 'Verdant Lab APS',
        verificationStatus: 'PENDING',
        verificationDocuments: JSON.stringify([])
      }
    }),
    prisma.seller.create({
      data: {
        userId: slowpressUser.id,
        businessName: 'Slow Press SA',
        verificationStatus: 'PENDING',
        verificationDocuments: JSON.stringify([])
      }
    }),
    prisma.seller.create({
      data: {
        userId: hallowUser.id,
        businessName: 'Hallow Audio LLC',
        verificationStatus: 'PENDING',
        verificationDocuments: JSON.stringify([])
      }
    })
  ])

  console.log('Created sellers')

  // Create Stores
  const [auroraStore, northboundStore, monoStore, verdantStore, slowpressStore, hallowStore] = await Promise.all([
    prisma.store.create({
      data: {
        slug: 'aurora-atelier',
        sellerId: sellers[0].id,
        name: 'Aurora Atelier',
        tagline: 'Hand-finished lighting for quiet rooms',
        description: 'A small studio shaping brass and opal glass into lamps that behave like daylight.',
        category: 'home',
        categoryLabel: 'Home',
        location: 'Lisbon, PT',
        productCount: 24,
        featured: true,
        status: 'ACTIVE',
        coverGradient: 'from-amber-300 via-rose-400 to-fuchsia-600',
        coverAlt: 'Aurora Atelier storefront',
        themeGradient: 'from-amber-300 via-rose-400 to-fuchsia-600',
        themePattern: 'rings',
        themeAccentText: 'text-amber-200',
        template: 'immersive',
        heroTitle: 'Light that lives with you',
        heroDescription: 'Each piece is finished by hand in our Lisbon studio.',
        heroCtaLabel: 'Explore the collection',
        brandStoryTitle: 'The Aurora Story',
        brandStoryContent: 'Founded in 2019, Aurora Atelier began with a simple question: what if light could feel like daylight? Our small studio in Lisbon shapes brass and opal glass into lamps that warm a room without dominating it. Every piece is hand-finished, numbered, and built to last.',
        featuredCollectionIds: JSON.stringify(['featured']),
        ambientMotion: true,
        density: 'spacious'
      }
    }),
    prisma.store.create({
      data: {
        slug: 'northbound-supply',
        sellerId: sellers[1].id,
        name: 'Northbound Supply',
        tagline: 'Gear built for long, cold distances',
        description: 'Technical outerwear and packs tested above the tree line before anything ships.',
        category: 'fashion',
        categoryLabel: 'Fashion',
        location: 'Tromsø, NO',
        productCount: 41,
        featured: true,
        status: 'ACTIVE',
        coverGradient: 'from-sky-300 via-cyan-500 to-blue-700',
        coverAlt: 'Northbound Supply storefront',
        themeGradient: 'from-sky-300 via-cyan-500 to-blue-700',
        themePattern: 'beams',
        themeAccentText: 'text-sky-200',
        template: 'minimal',
        heroTitle: 'Tested above the tree line',
        heroDescription: 'Technical gear for the long way round.',
        heroCtaLabel: 'Shop the collection',
        brandStoryTitle: 'Field-Tested',
        brandStoryContent: 'Based in Tromsø, Norway, Northbound Supply designs outerwear and packs that are tested in Arctic conditions before they ever ship. We believe gear should be simple, functional, and built to last.',
        featuredCollectionIds: JSON.stringify(['trending']),
        ambientMotion: false,
        density: 'compact'
      }
    }),
    prisma.store.create({
      data: {
        slug: 'mono-goods',
        sellerId: sellers[2].id,
        name: 'Mono Goods',
        tagline: 'One object, done properly',
        description: 'A rotating single-product shop. Each release stays until the next one is ready.',
        category: 'lifestyle',
        categoryLabel: 'Lifestyle',
        location: 'Kyoto, JP',
        productCount: 9,
        featured: true,
        status: 'ACTIVE',
        coverGradient: 'from-neutral-200 via-neutral-400 to-neutral-700',
        coverAlt: 'Mono Goods storefront',
        themeGradient: 'from-neutral-200 via-neutral-400 to-neutral-700',
        themePattern: 'grid',
        themeAccentText: 'text-neutral-200',
        template: 'minimal',
        heroTitle: 'One object at a time',
        heroDescription: 'Current release: Edition 07 Carafe',
        heroCtaLabel: 'View current edition',
        brandStoryTitle: 'The Mono Philosophy',
        brandStoryContent: 'Mono Goods operates on a simple principle: do one thing perfectly. Each release is a single object, designed and produced until the next one is ready. Based in Kyoto, Japan.',
        featuredCollectionIds: JSON.stringify(['featured']),
        ambientMotion: false,
        density: 'compact'
      }
    }),
    prisma.store.create({
      data: {
        slug: 'verdant-lab',
        sellerId: sellers[3].id,
        name: 'Verdant Lab',
        tagline: 'Skincare with a short ingredient list',
        description: 'Formulations developed in-house, batched monthly, printed with full disclosure.',
        category: 'beauty',
        categoryLabel: 'Beauty',
        location: 'Copenhagen, DK',
        productCount: 17,
        featured: false,
        status: 'ACTIVE',
        coverGradient: 'from-emerald-300 via-teal-500 to-emerald-800',
        coverAlt: 'Verdant Lab storefront',
        themeGradient: 'from-emerald-300 via-teal-500 to-emerald-800',
        themePattern: 'rings',
        themeAccentText: 'text-emerald-200',
        template: 'editorial',
        heroTitle: 'Six ingredients. No secrets.',
        heroDescription: 'Small-batch skincare with full ingredient disclosure.',
        heroCtaLabel: 'Discover the routine',
        brandStoryTitle: 'Transparent Formulation',
        brandStoryContent: 'Verdant Lab was founded in Copenhagen with a commitment to transparency. Every formulation is developed in-house, batched monthly, and printed with full ingredient disclosure. No hidden synthetics, no proprietary blends.',
        featuredCollectionIds: JSON.stringify(['featured', 'trending']),
        ambientMotion: true,
        density: 'comfortable'
      }
    }),
    prisma.store.create({
      data: {
        slug: 'slow-press',
        sellerId: sellers[4].id,
        name: 'Slow Press',
        tagline: 'Risograph prints in tiny runs',
        description: 'Independent artists, fifty copies at a time, numbered by hand in the studio.',
        category: 'lifestyle',
        categoryLabel: 'Lifestyle',
        location: 'Mexico City, MX',
        productCount: 63,
        featured: false,
        status: 'ACTIVE',
        coverGradient: 'from-orange-300 via-red-500 to-purple-700',
        coverAlt: 'Slow Press storefront',
        themeGradient: 'from-orange-300 via-red-500 to-purple-700',
        themePattern: 'grid',
        themeAccentText: 'text-orange-200',
        template: 'editorial',
        heroTitle: 'Fifty copies at a time',
        heroDescription: 'Independent risograph prints, hand-numbered in Mexico City.',
        heroCtaLabel: 'Browse the prints',
        brandStoryTitle: 'Slow by Design',
        brandStoryContent: 'Slow Press works with independent artists to produce risograph prints in tiny runs—fifty copies at a time, numbered by hand in our Mexico City studio. Each print is unique, each run is limited.',
        featuredCollectionIds: JSON.stringify(['featured']),
        ambientMotion: true,
        density: 'comfortable'
      }
    }),
    prisma.store.create({
      data: {
        slug: 'hallow-audio',
        sellerId: sellers[5].id,
        name: 'Hallow Audio',
        tagline: 'Speakers that disappear into the room',
        description: 'Cabinetry-first audio, assembled from reclaimed hardwood and open-source drivers.',
        category: 'technology',
        categoryLabel: 'Technology',
        location: 'Portland, US',
        productCount: 12,
        featured: false,
        status: 'ACTIVE',
        coverGradient: 'from-indigo-300 via-violet-500 to-slate-900',
        coverAlt: 'Hallow Audio storefront',
        themeGradient: 'from-indigo-300 via-violet-500 to-slate-900',
        themePattern: 'beams',
        themeAccentText: 'text-indigo-200',
        template: 'immersive',
        heroTitle: 'Audio that disappears',
        heroDescription: 'Cabinetry-first design with reclaimed hardwood.',
        heroCtaLabel: 'Listen to the difference',
        brandStoryTitle: 'Cabinetry First',
        brandStoryContent: 'Hallow Audio is built on a simple idea: the cabinet matters as much as the driver. Based in Portland, Oregon, we assemble speakers from reclaimed hardwood and open-source drivers. No plastic, no hidden electronics.',
        featuredCollectionIds: JSON.stringify(['featured']),
        ambientMotion: true,
        density: 'spacious'
      }
    })
  ])

  console.log('Created stores')

  // Create Products
  const products = await Promise.all([
    // Aurora Atelier Products
    prisma.product.create({
      data: {
        slug: 'opal-table-lamp',
        storeId: auroraStore.id,
        storeName: 'Aurora Atelier',
        name: 'Opal Table Lamp',
        description: 'Blown opal shade on a solid brass stem with a dimmable warm core.',
        category: 'home',
        categoryLabel: 'Home',
        price: 28900,
        currency: 'USD',
        badge: 'featured',
        availability: 'IN_STOCK',
        tags: JSON.stringify(['lighting', 'brass']),
        highlights: JSON.stringify(['Hand-blown opal glass', 'Solid brass stem', 'Dimmable LED core', 'Hand-finished in Lisbon']),
        collections: JSON.stringify(['featured', 'trending']),
        imageGradient: 'from-amber-200 to-rose-500',
        imageAlt: 'Opal table lamp'
      }
    }),
    prisma.product.create({
      data: {
        slug: 'halo-wall-sconce',
        storeId: auroraStore.id,
        storeName: 'Aurora Atelier',
        name: 'Halo Wall Sconce',
        description: 'A thin brass ring that throws light up the wall and nowhere else.',
        category: 'home',
        categoryLabel: 'Home',
        price: 19500,
        currency: 'USD',
        badge: 'new',
        availability: 'IN_STOCK',
        tags: JSON.stringify(['lighting']),
        highlights: JSON.stringify(['Solid brass ring', 'Upward-facing light', 'Minimal installation', 'Warm white LED']),
        collections: JSON.stringify(['new-arrivals']),
        imageGradient: 'from-rose-200 to-fuchsia-600',
        imageAlt: 'Halo wall sconce'
      }
    }),
    prisma.product.create({
      data: {
        slug: 'washed-linen-throw',
        storeId: auroraStore.id,
        storeName: 'Aurora Atelier',
        name: 'Washed Linen Throw',
        description: 'Heavyweight linen, stonewashed twice, finished with a hand-rolled hem.',
        category: 'home',
        categoryLabel: 'Home',
        price: 14500,
        currency: 'USD',
        availability: 'IN_STOCK',
        tags: JSON.stringify(['textiles']),
        highlights: JSON.stringify(['Heavyweight linen', 'Double stonewashed', 'Hand-rolled hem', 'Natural fiber']),
        collections: JSON.stringify(['trending']),
        imageGradient: 'from-amber-100 to-rose-400',
        imageAlt: 'Washed linen throw'
      }
    }),

    // Northbound Supply Products
    prisma.product.create({
      data: {
        slug: 'ridge-shell-jacket',
        storeId: northboundStore.id,
        storeName: 'Northbound Supply',
        name: 'Ridge Shell Jacket',
        description: 'Three-layer waterproof shell with taped seams and a helmet-ready hood.',
        category: 'fashion',
        categoryLabel: 'Fashion',
        price: 42000,
        currency: 'USD',
        badge: 'trending',
        availability: 'IN_STOCK',
        tags: JSON.stringify(['outerwear', 'waterproof']),
        highlights: JSON.stringify(['3-layer waterproof membrane', 'Fully taped seams', 'Helmet-compatible hood', 'Pit zips for ventilation']),
        collections: JSON.stringify(['trending', 'featured']),
        imageGradient: 'from-sky-200 to-blue-700',
        imageAlt: 'Ridge shell jacket'
      }
    }),
    prisma.product.create({
      data: {
        slug: 'fjord-40l-pack',
        storeId: northboundStore.id,
        storeName: 'Northbound Supply',
        name: 'Fjord 40L Pack',
        description: 'Roll-top hauler in recycled sailcloth, balanced for long approaches.',
        category: 'fashion',
        categoryLabel: 'Fashion',
        price: 23500,
        currency: 'USD',
        availability: 'IN_STOCK',
        tags: JSON.stringify(['packs']),
        highlights: JSON.stringify(['40L capacity', 'Recycled sailcloth', 'Roll-top closure', 'Frame-carry design']),
        collections: JSON.stringify(['trending']),
        imageGradient: 'from-cyan-200 to-blue-800',
        imageAlt: 'Fjord 40 litre pack'
      }
    }),
    prisma.product.create({
      data: {
        slug: 'thermal-base-layer',
        storeId: northboundStore.id,
        storeName: 'Northbound Supply',
        name: 'Thermal Base Layer',
        description: 'Merino blend knitted in one piece, so there is nothing to chafe.',
        category: 'fashion',
        categoryLabel: 'Fashion',
        price: 11800,
        currency: 'USD',
        badge: 'new',
        availability: 'LOW_STOCK',
        tags: JSON.stringify(['layers', 'merino']),
        highlights: JSON.stringify(['Seamless construction', 'Merino wool blend', 'Moisture-wicking', 'Odour-resistant']),
        collections: JSON.stringify(['new-arrivals']),
        imageGradient: 'from-slate-200 to-sky-700',
        imageAlt: 'Thermal base layer'
      }
    }),
    prisma.product.create({
      data: {
        slug: 'wool-overshirt',
        storeId: northboundStore.id,
        storeName: 'Northbound Supply',
        name: 'Wool Overshirt',
        description: 'Boiled wool that shrugs off drizzle and reads as a shirt indoors.',
        category: 'fashion',
        categoryLabel: 'Fashion',
        price: 19800,
        currency: 'USD',
        badge: 'featured',
        availability: 'IN_STOCK',
        tags: JSON.stringify(['outerwear']),
        highlights: JSON.stringify(['Boiled wool', 'Water-resistant', 'Versatile wear', 'Natural insulation']),
        collections: JSON.stringify(['featured']),
        imageGradient: 'from-blue-200 to-slate-700',
        imageAlt: 'Wool overshirt'
      }
    }),

    // Mono Goods Products
    prisma.product.create({
      data: {
        slug: 'edition-07-carafe',
        storeId: monoStore.id,
        storeName: 'Mono Goods',
        name: 'Edition 07 Carafe',
        description: 'Borosilicate carafe with a cork stopper. Current and only release.',
        category: 'home',
        categoryLabel: 'Home',
        price: 7400,
        currency: 'USD',
        badge: 'featured',
        availability: 'IN_STOCK',
        tags: JSON.stringify(['kitchen', 'limited']),
        highlights: JSON.stringify(['Borosilicate glass', 'Natural cork stopper', 'Hand-finished', 'Limited edition']),
        collections: JSON.stringify(['featured']),
        imageGradient: 'from-neutral-100 to-neutral-600',
        imageAlt: 'Edition 07 carafe'
      }
    }),
    prisma.product.create({
      data: {
        slug: 'folded-desk-tray',
        storeId: monoStore.id,
        storeName: 'Mono Goods',
        name: 'Folded Desk Tray',
        description: 'A single sheet of anodised aluminium, folded four times. Nothing else.',
        category: 'lifestyle',
        categoryLabel: 'Lifestyle',
        price: 6200,
        currency: 'USD',
        availability: 'IN_STOCK',
        tags: JSON.stringify(['desk']),
        highlights: JSON.stringify(['Single sheet construction', 'Anodised aluminium', 'Four precise folds', 'No hardware']),
        collections: JSON.stringify(['trending']),
        imageGradient: 'from-zinc-200 to-zinc-700',
        imageAlt: 'Folded desk tray'
      }
    }),
    prisma.product.create({
      data: {
        slug: 'everyday-travel-kit',
        storeId: monoStore.id,
        storeName: 'Mono Goods',
        name: 'Everyday Travel Kit',
        description: 'A waxed canvas roll sized for exactly what a week away needs.',
        category: 'lifestyle',
        categoryLabel: 'Lifestyle',
        price: 8900,
        currency: 'USD',
        badge: 'new',
        availability: 'IN_STOCK',
        tags: JSON.stringify(['travel']),
        highlights: JSON.stringify(['Waxed canvas', 'Roll design', 'Week-sized capacity', 'Simple organization']),
        collections: JSON.stringify(['new-arrivals']),
        imageGradient: 'from-stone-200 to-neutral-700',
        imageAlt: 'Everyday travel kit'
      }
    }),

    // Verdant Lab Products
    prisma.product.create({
      data: {
        slug: 'barrier-serum',
        storeId: verdantStore.id,
        storeName: 'Verdant Lab',
        name: 'Barrier Serum',
        description: 'Six ingredients, batched monthly, dated on the base of every bottle.',
        category: 'beauty',
        categoryLabel: 'Beauty',
        price: 5200,
        currency: 'USD',
        badge: 'trending',
        availability: 'IN_STOCK',
        tags: JSON.stringify(['skincare']),
        highlights: JSON.stringify(['Only 6 ingredients', 'Monthly batches', 'Dated bottles', 'Full disclosure']),
        collections: JSON.stringify(['trending', 'featured']),
        imageGradient: 'from-emerald-200 to-teal-700',
        imageAlt: 'Barrier serum bottle'
      }
    }),
    prisma.product.create({
      data: {
        slug: 'green-clay-cleanser',
        storeId: verdantStore.id,
        storeName: 'Verdant Lab',
        name: 'Green Clay Cleanser',
        description: 'A gentle clay wash that does not strip the skin it is cleaning.',
        category: 'beauty',
        categoryLabel: 'Beauty',
        price: 3400,
        currency: 'USD',
        badge: 'new',
        availability: 'IN_STOCK',
        tags: JSON.stringify(['skincare']),
        highlights: JSON.stringify(['Green clay base', 'Gentle cleansing', 'Non-stripping', 'pH balanced']),
        collections: JSON.stringify(['new-arrivals']),
        imageGradient: 'from-lime-200 to-emerald-700',
        imageAlt: 'Green clay cleanser'
      }
    }),
    prisma.product.create({
      data: {
        slug: 'night-repair-balm',
        storeId: verdantStore.id,
        storeName: 'Verdant Lab',
        name: 'Night Repair Balm',
        description: 'Thick overnight balm in a refillable glass jar, unscented by design.',
        category: 'beauty',
        categoryLabel: 'Beauty',
        price: 4800,
        currency: 'USD',
        availability: 'IN_STOCK',
        tags: JSON.stringify(['skincare']),
        highlights: JSON.stringify(['Overnight repair', 'Refillable jar', 'Unscented formula', 'Glass packaging']),
        collections: JSON.stringify(['featured']),
        imageGradient: 'from-teal-200 to-emerald-900',
        imageAlt: 'Night repair balm'
      }
    }),

    // Slow Press Products
    prisma.product.create({
      data: {
        slug: 'riso-print-set',
        storeId: slowpressStore.id,
        storeName: 'Slow Press',
        name: 'Riso Print Set',
        description: 'Three A3 risograph prints, hand-numbered from a run of fifty.',
        category: 'lifestyle',
        categoryLabel: 'Lifestyle',
        price: 9800,
        currency: 'USD',
        badge: 'featured',
        availability: 'LOW_STOCK',
        tags: JSON.stringify(['print', 'limited']),
        highlights: JSON.stringify(['3 A3 prints', 'Hand-numbered', 'Limited to 50', 'Risograph printing']),
        collections: JSON.stringify(['featured', 'trending']),
        imageGradient: 'from-orange-200 to-purple-700',
        imageAlt: 'Risograph print set'
      }
    }),
    prisma.product.create({
      data: {
        slug: 'annual-zine-no-4',
        storeId: slowpressStore.id,
        storeName: 'Slow Press',
        name: 'Annual Zine No. 4',
        description: 'Ninety pages of new work from twelve studios, saddle-stitched by hand.',
        category: 'lifestyle',
        categoryLabel: 'Lifestyle',
        price: 2600,
        currency: 'USD',
        badge: 'new',
        availability: 'IN_STOCK',
        tags: JSON.stringify(['print']),
        highlights: JSON.stringify(['90 pages', '12 studios', 'Saddle-stitched', 'Hand assembly']),
        collections: JSON.stringify(['new-arrivals']),
        imageGradient: 'from-red-200 to-purple-800',
        imageAlt: 'Annual zine number four'
      }
    }),

    // Hallow Audio Products
    prisma.product.create({
      data: {
        slug: 'alcove-bookshelf-speaker',
        storeId: hallowStore.id,
        storeName: 'Hallow Audio',
        name: 'Alcove Bookshelf Speaker',
        description: 'Reclaimed ash cabinet, paper cone driver, sold as a matched pair.',
        category: 'technology',
        categoryLabel: 'Technology',
        price: 64000,
        currency: 'USD',
        badge: 'featured',
        availability: 'IN_STOCK',
        tags: JSON.stringify(['audio', 'pair']),
        highlights: JSON.stringify(['Reclaimed ash cabinet', 'Paper cone driver', 'Matched pair', 'Open-source design']),
        collections: JSON.stringify(['featured', 'trending']),
        imageGradient: 'from-indigo-200 to-slate-800',
        imageAlt: 'Alcove bookshelf speaker'
      }
    }),
    prisma.product.create({
      data: {
        slug: 'field-amplifier',
        storeId: hallowStore.id,
        storeName: 'Hallow Audio',
        name: 'Field Amplifier',
        description: 'A twelve-watt desk amp with one knob and a very short signal path.',
        category: 'technology',
        categoryLabel: 'Technology',
        price: 38000,
        currency: 'USD',
        availability: 'IN_STOCK',
        tags: JSON.stringify(['audio']),
        highlights: JSON.stringify(['12 watts', 'Single knob control', 'Short signal path', 'Pure Class A']),
        collections: JSON.stringify(['trending']),
        imageGradient: 'from-violet-200 to-slate-900',
        imageAlt: 'Field amplifier'
      }
    }),
    prisma.product.create({
      data: {
        slug: 'thread-turntable',
        storeId: hallowStore.id,
        storeName: 'Hallow Audio',
        name: 'Thread Turntable',
        description: 'Belt-driven deck with a machined platter and no unnecessary lights.',
        category: 'technology',
        categoryLabel: 'Technology',
        price: 89000,
        currency: 'USD',
        badge: 'new',
        availability: 'LOW_STOCK',
        tags: JSON.stringify(['audio']),
        highlights: JSON.stringify(['Belt-driven', 'Machined platter', 'No indicator lights', '33/45 RPM']),
        collections: JSON.stringify(['new-arrivals', 'featured']),
        imageGradient: 'from-slate-200 to-indigo-900',
        imageAlt: 'Thread turntable'
      }
    })
  ])

  console.log('Created products')

  // Create Inventory for products
  await Promise.all(products.map(product =>
    prisma.inventory.create({
      data: {
        productId: product.id,
        quantity: 100,
        reserved: 0
      }
    })
  ))

  console.log('Created inventory')

  console.log('Database seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
