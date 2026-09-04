# E-PIC WORKFLOW VERIFICATION

**Date:** 2026-09-01
**Purpose:** Verify current E-Pic seller and buyer workflows against Xeni backend capabilities

---

## SELLER WORKFLOW VERIFICATION

### Step 1: Register
**Existing backend capability:** ✅ POST /api/auth/register
**Existing API:** ✅ Yes
**Frontend UI:** ✅ Yes (/register page)
**Status:** ✅ WORKING
**Action required:** None

### Step 2: Login
**Existing backend capability:** ✅ POST /api/auth/login
**Existing API:** ✅ Yes
**Frontend UI:** ✅ Yes (/login page)
**Status:** ✅ WORKING
**Action required:** None

### Step 3: Become seller
**Existing backend capability:** ✅ Role update via admin
**Existing API:** ⚠️ No direct API (admin only)
**Frontend UI:** ❌ No seller application UI
**Status:** ❌ NOT WORKING
**Action required:** Add seller role assignment API or manual admin assignment

### Step 4: Create shop
**Existing backend capability:** ✅ POST /api/shops
**Existing API:** ✅ Yes
**Frontend UI:** ❌ No shop creation UI
**Status:** ❌ NOT WORKING
**Action required:** Build seller shop creation UI

### Step 5: Edit shop
**Existing backend capability:** ✅ PUT /api/shops/me
**Existing API:** ✅ Yes
**Frontend UI:** ❌ No shop edit UI
**Status:** ❌ NOT WORKING
**Action required:** Build seller shop edit UI

### Step 6: Create product
**Existing backend capability:** ✅ POST /api/products
**Existing API:** ✅ Yes
**Frontend UI:** ❌ No product creation UI
**Status:** ❌ NOT WORKING
**Action required:** Build seller product creation UI

### Step 7: Upload product image
**Existing backend capability:** ✅ POST /api/products/upload
**Existing API:** ✅ Yes
**Frontend UI:** ❌ No image upload UI
**Status:** ❌ NOT WORKING
**Action required:** Build image upload UI

### Step 8: Add variants
**Existing backend capability:** ✅ ProductVariant model exists
**Existing API:** ⚠️ Variants part of Product (no separate API)
**Frontend UI:** ❌ No variant management UI
**Status:** ❌ NOT WORKING
**Action required:** Build variant management UI (integrated with product creation/edit)

### Step 9: Set inventory
**Existing backend capability:** ✅ Product.current_stock
**Existing API:** ⚠️ Part of Product (no separate API)
**Frontend UI:** ❌ No inventory management UI
**Status:** ❌ NOT WORKING
**Action required:** Build inventory management UI

### Step 10: Edit product
**Existing backend capability:** ✅ PUT /api/products/:id
**Existing API:** ✅ Yes
**Frontend UI:** ❌ No product edit UI
**Status:** ❌ NOT WORKING
**Action required:** Build seller product edit UI

### Step 11: Publish/archive product
**Existing backend capability:** ✅ Product.is_active
**Existing API:** ✅ PUT /api/products/:id
**Frontend UI:** ❌ No product archive UI
**Status:** ❌ NOT WORKING
**Action required:** Build product archive UI

### Step 12: View orders
**Existing backend capability:** ✅ GET /api/orders
**Existing API:** ✅ Yes
**Frontend UI:** ❌ No seller order UI
**Status:** ❌ NOT WORKING
**Action required:** Build seller order list UI

### Step 13: Update order status
**Existing backend capability:** ✅ PUT /api/orders/:id
**Existing API:** ✅ Yes
**Frontend UI:** ❌ No order status update UI
**Status:** ❌ NOT WORKING
**Action required:** Build order status update UI

---

## BUYER WORKFLOW VERIFICATION

### Step 1: Register
**Existing backend capability:** ✅ POST /api/auth/register
**Existing API:** ✅ Yes
**Frontend UI:** ✅ Yes (/register page)
**Status:** ✅ WORKING
**Action required:** None

### Step 2: Login
**Existing backend capability:** ✅ POST /api/auth/login
**Existing API:** ✅ Yes
**Frontend UI:** ✅ Yes (/login page)
**Status:** ✅ WORKING
**Action required:** None

### Step 3: Browse products
**Existing backend capability:** ✅ GET /api/public/v1/products
**Existing API:** ✅ Yes
**Frontend UI:** ✅ Yes (/explore page)
**Status:** ✅ WORKING
**Action required:** None

### Step 4: Search products
**Existing backend capability:** ⚠️ No search API (public API lists all)
**Existing API:** ⚠️ No search endpoint
**Frontend UI:** ⚠️ Client-side filtering only
**Status:** ⚠️ PARTIAL
**Action required:** Add search API or use client-side filtering

### Step 5: Filter products
**Existing backend capability:** ⚠️ Limited filtering (category, store_id)
**Existing API:** ⚠️ GET /api/public/v1/products?category=...
**Frontend UI:** ⚠️ Basic filtering
**Status:** ⚠️ PARTIAL
**Action required:** Enhance filtering in API and UI

### Step 6: View product
**Existing backend capability:** ✅ GET /api/public/v1/products/:id
**Existing API:** ✅ Yes
**Frontend UI:** ✅ Yes (/products/[slug] page)
**Status:** ✅ WORKING
**Action required:** None

### Step 7: View store
**Existing backend capability:** ✅ GET /api/public/v1/stores/:identifier
**Existing API:** ✅ Yes
**Frontend UI:** ✅ Yes (/stores/[slug] page)
**Status:** ✅ WORKING
**Action required:** None

### Step 8: Add to cart
**Existing backend capability:** ❌ No cart API
**Existing API:** ❌ No cart endpoint
**Frontend UI:** ✅ Yes (local cart only)
**Status:** ⚠️ PARTIAL (local only)
**Action required:** Build backend cart API

### Step 9: Checkout
**Existing backend capability:** ❌ No checkout API
**Existing API:** ❌ No checkout endpoint
**Frontend UI:** ⚠️ Checkout page (placeholder)
**Status:** ❌ NOT WORKING
**Action required:** Build backend checkout API

### Step 10: Create order
**Existing backend capability:** ✅ POST /api/orders
**Existing API:** ✅ Yes
**Frontend UI:** ❌ No order creation UI
**Status:** ❌ NOT WORKING
**Action required:** Build order creation UI (integrated with checkout)

### Step 11: Pay
**Existing backend capability:** ✅ POST /api/billing/subscribe/sslcommerz
**Existing API:** ✅ Yes (for subscriptions)
**Frontend UI:** ❌ No payment UI
**Status:** ❌ NOT WORKING
**Action required:** Build payment UI (for orders, not subscriptions)

### Step 12: View order
**Existing backend capability:** ✅ GET /api/orders/:id
**Existing API:** ✅ Yes
**Frontend UI:** ❌ No buyer order UI
**Status:** ❌ NOT WORKING
**Action required:** Build buyer order detail UI

---

## SUMMARY

### Seller Workflow Status
- ✅ Register: WORKING
- ✅ Login: WORKING
- ❌ Become seller: NOT WORKING (no UI)
- ❌ Create shop: NOT WORKING (no UI)
- ❌ Edit shop: NOT WORKING (no UI)
- ❌ Create product: NOT WORKING (no UI)
- ❌ Upload product image: NOT WORKING (no UI)
- ❌ Add variants: NOT WORKING (no UI)
- ❌ Set inventory: NOT WORKING (no UI)
- ❌ Edit product: NOT WORKING (no UI)
- ❌ Publish/archive product: NOT WORKING (no UI)
- ❌ View orders: NOT WORKING (no UI)
- ❌ Update order status: NOT WORKING (no UI)

**Seller Workflow Progress:** 2/13 steps working (15%)

### Buyer Workflow Status
- ✅ Register: WORKING
- ✅ Login: WORKING
- ✅ Browse products: WORKING
- ⚠️ Search products: PARTIAL (client-side only)
- ⚠️ Filter products: PARTIAL (basic)
- ✅ View product: WORKING
- ✅ View store: WORKING
- ⚠️ Add to cart: PARTIAL (local only)
- ❌ Checkout: NOT WORKING (placeholder)
- ❌ Create order: NOT WORKING (no UI)
- ❌ Pay: NOT WORKING (no UI)
- ❌ View order: NOT WORKING (no UI)

**Buyer Workflow Progress:** 5/12 steps working (42%)

---

## KEY GAPS

### Seller UI Missing
- Shop creation UI
- Shop edit UI
- Product creation UI
- Product edit UI
- Image upload UI
- Variant management UI
- Inventory management UI
- Order list UI
- Order status update UI

### Buyer Backend Missing
- Cart API
- Checkout API
- Order payment API (separate from subscription payment)

### Buyer UI Missing
- Order creation UI
- Payment UI
- Order detail UI

---

## RECOMMENDATION

**Priority 1:** Build seller UI (all seller features exist in backend)
**Priority 2:** Build cart API (missing entirely)
**Priority 3:** Build checkout API (missing entirely)
**Priority 4:** Build buyer order UI (backend exists)
