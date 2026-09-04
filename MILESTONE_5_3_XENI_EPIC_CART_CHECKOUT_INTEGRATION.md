# MILESTONE 5.3: XENI CART & CHECKOUT INTEGRATION - BLOCKED

## EXECUTIVE SUMMARY

Milestone 5.3 is **BLOCKED** due to critical Xeni backend security gaps and architectural mismatches that prevent safe implementation of real order creation for E-Pic Marketplace buyers.

The audit revealed that Xeni's checkout and cart systems are designed for shop owners (sellers) rather than public buyers, and contain critical security vulnerabilities that would allow payment fraud and inventory overselling.

**Status:** BLOCKED
**Blocker:** Critical Xeni backend security gaps
**Recommendation:** Address Xeni security gaps before proceeding with real order creation

---

## CRITICAL SECURITY GAPS

### 1. CRITICAL: Inventory Race Condition

**Issue:** Xeni checkout endpoint (`internal/checkout/handler.go` lines 106-116) decrements inventory without database-level locking.

**Code Location:**
```go
// Update product stock
for _, cartItem := range cart.CartItems {
    var product models.Product
    if err := h.DB.First(&product, cartItem.ProductID).Error; err == nil {
        product.CurrentStock -= cartItem.Quantity
        if product.CurrentStock < 0 {
            product.CurrentStock = 0
            product.IsOutOfStock = true
        }
        h.DB.Save(&product)
    }
}
```

**Impact:** Concurrent checkouts can oversell inventory. Two customers can checkout the same product simultaneously, both succeeding, but only one gets the item.

**Recommendation:** Use SELECT FOR UPDATE or optimistic locking with version checking to prevent race conditions.

**Status:** BLOCKS PRODUCTION DEPLOYMENT

---

### 2. CRITICAL: Shop Ownership Requirement for Checkout

**Issue:** Xeni checkout endpoint (`internal/checkout/handler.go` lines 60-65) requires the user to have a shop. This is designed for shop owners creating orders, not public buyers purchasing products.

**Code Location:**
```go
// Get user's shop (for order)
var shop models.Shop
err = h.DB.Where("user_id = ?", userID).First(&shop).Error
if err != nil {
    return response.BadRequest(c, "Shop not found. Please create a shop first.")
}
```

**Impact:** E-Pic buyers (who do not have shops) cannot use Xeni checkout. The Xeni checkout API is fundamentally designed for a different use case (seller order management) than E-Pic's use case (buyer checkout).

**Recommendation:** Xeni needs a separate buyer checkout endpoint that does not require shop ownership, or the existing checkout needs to be refactored to support both buyer and seller scenarios.

**Status:** BLOCKS PRODUCTION DEPLOYMENT

---

### 3. HIGH: Guest Cart Not Fully Implemented

**Issue:** Xeni cart requires authenticated user (line 37 in handler.go checks for user_id). The cart model has a session_id field but it's not used in the current implementation.

**Code Location:**
```go
func (h *Handler) GetOrCreateCart(c *fiber.Ctx) error {
    userID := c.Locals("user_id").(string)
    // ... rest of implementation uses only userID
}
```

**Impact:** E-Pic buyers cannot use Xeni cart without accounts. E-Pic must continue using localStorage for guest cart.

**Recommendation:** Implement full guest cart support with session-based ownership, or E-Pic must maintain local guest cart with sync at login.

**Status:** LIMITS FUNCTIONALITY

---

### 4. MEDIUM: Price Validation

**Finding:** Milestone 5.1 contract claimed Xeni does not validate prices server-side, but the actual code shows Xeni DOES recalculate totals from cart items on the server side (lines 71-79).

**Code Location:**
```go
// Convert cart items to order items format
orderItemsData := make([]map[string]interface{}, 0, len(cart.CartItems))
totalAmount := 0.0

for _, cartItem := range cart.CartItems {
    orderItem := map[string]interface{}{
        "product_id": cartItem.ProductID,
        "quantity":   cartItem.Quantity,
        "price":      cartItem.Product.Price,
    }
    orderItemsData = append(orderItemsData, orderItem)
    totalAmount += float64(cartItem.Quantity) * cartItem.Product.Price
}
```

**Impact:** Server-side price recalculation is present, but prices come from cart items which could be stale if product prices changed after adding to cart.

**Recommendation:** Verify product prices at checkout time by re-fetching current product prices before creating order.

**Status:** IMPROVEMENT NEEDED

---

## CURRENT E-PIC IMPLEMENTATION

### Cart Architecture

**Storage:** localStorage-based guest cart
**Location:** `lib/cart/storage.ts`
**Features:**
- LocalStorage persistence
- Single-store constraint (prevents cross-store checkout)
- Customer preferences (name, email, phone) storage
- Cross-store checkout detection

**Cart Provider:** `lib/cart/provider.tsx`
- Client-side React context
- LocalStorage synchronization
- Backend sync attempt (currently non-functional due to Xeni authentication requirement)

**Current Behavior:**
- Guest users: Cart stored in localStorage
- Authenticated users: Cart still in localStorage (no Xeni sync implemented)
- Backend sync: Attempts to call `/api/cart/items` but fails for unauthenticated users

---

### Checkout Architecture

**Types:** `lib/checkout/types.ts`
- Customer details (name, phone, email)
- Delivery address (recipient, phone, country, city, address)
- Payment method (card, mobile-wallet, cash-on-delivery)
- Multi-step checkout flow

**UI Components:**
- Customer details form
- Delivery address form
- Payment method form
- Order review
- Order confirmation

**Server Route:** `app/api/checkout/route.ts`
- Proxies to Xeni `/api/checkout`
- Requires HttpOnly `gateway_access_token`
- Returns Xeni response

**Current Behavior:**
- Checkout UI works with local cart data
- Backend checkout call fails for users without Xeni accounts
- Backend checkout call fails for users without Xeni shops

---

### Authentication Architecture

**Xeni Integration:**
- NextAuth with Xeni OAuth handoff
- HttpOnly cookies for `gateway_access_token` and `gateway_refresh_token`
- Server-side token reading for API calls
- No client-side token exposure

**Current Status:**
- Authentication works for sellers (shop owners)
- Authentication not used for buyers (guest checkout)
- No guest authentication mechanism

---

## XENI API AUDIT

### Cart APIs

**Endpoints:**
- `GET /api/cart` - Get or create cart (requires JWT)
- `POST /api/cart/items` - Add item to cart (requires JWT)
- `PUT /api/cart/items/:id` - Update cart item (requires JWT)
- `DELETE /api/cart/items/:id` - Remove cart item (requires JWT)
- `POST /api/cart/clear` - Clear cart (requires JWT)

**Authentication:** Required (JWT)
**User Type:** Authenticated users only
**Guest Support:** Not implemented (session_id field exists but unused)

**Data Model:**
```go
type Cart struct {
    ID        uuid.UUID
    UserID    uuid.UUID      // Required - no guest support
    SessionID *string       // Exists but unused
    ExpiresAt time.Time     // 24 hours
    CartItems []CartItem
}

type CartItem struct {
    ID        uuid.UUID
    CartID    uuid.UUID
    ProductID uuid.UUID
    Quantity  int
}
```

**Status:** NOT SUITABLE FOR E-PIC BUYERS

---

### Checkout API

**Endpoint:** `POST /api/checkout`
**Authentication:** Required (JWT)
**User Type:** Authenticated shop owners only

**Request Schema:**
```go
type CheckoutRequest struct {
    CustomerName    string
    CustomerPhone   string
    CustomerAddress string
    PaymentMethod   string
}
```

**Response:** Order object

**Requirements:**
- User must have a shop
- User must have a cart
- Cart must not be empty

**Process:**
1. Get user's cart
2. Get user's shop (FAILS if no shop)
3. Calculate total from cart items
4. Create order linked to shop
5. Decrement product inventory (NO LOCKING)
6. Clear cart

**Status:** NOT SUITABLE FOR E-PIC BUYERS

---

### Order APIs

**Endpoints:**
- `GET /api/orders` - List my orders (requires JWT)
- `POST /api/orders` - Create manual order (requires JWT)
- `GET /api/orders/:id` - Get order details (requires JWT)
- `PUT /api/orders/:id` - Update order (requires JWT)

**Authentication:** Required (JWT)
**User Type:** Authenticated shop owners only

**Order Model:**
```go
type Order struct {
    ID              uuid.UUID
    ShopID          uuid.UUID      // Order belongs to a shop
    CustomerName    *string
    CustomerPhone   *string
    CustomerAddress *string
    OrderItems      JSON           // JSONB array
    TotalAmount     float64
    PaymentStatus   OrderPaymentStatus
    DeliveryStatus  OrderDeliveryStatus
    // ... other fields
}
```

**Status:** NOT SUITABLE FOR E-PIC BUYERS (no buyer order listing)

---

## ARCHITECTURAL MISMATCH

### Xeni Design vs E-Pic Requirements

| Aspect | Xeni Design | E-Pic Requirement | Compatibility |
|--------|-------------|-------------------|---------------|
| User Type | Shop owners (sellers) | Public buyers | INCOMPATIBLE |
| Cart Auth | Required JWT | Guest + Authenticated | PARTIAL |
| Checkout Auth | Required JWT + Shop | Guest + Authenticated | INCOMPATIBLE |
| Order Ownership | Shop-owned orders | Buyer-owned orders | INCOMPATIBLE |
| Guest Cart | Not implemented | Required | INCOMPATIBLE |
| Buyer Orders | Not available | Required | INCOMPATIBLE |

**Conclusion:** Xeni is designed as a seller platform, not a buyer marketplace. E-Pic requires buyer-facing commerce APIs that Xeni does not currently provide.

---

## IMPLEMENTATION DECISIONS

### What Can Be Implemented Safely

**1. Authenticated Cart (Limited)**
- Xeni cart APIs work for authenticated users
- E-Pic sellers can use Xeni cart for their own purchases
- Cannot be used for public buyers

**2. Local Guest Cart (Current)**
- Continue using localStorage for guest cart
- Works for current architecture
- No security risk

**3. Checkout UI (Current)**
- Continue using current checkout UI
- Works with local cart data
- No real order creation

### What Cannot Be Implemented Safely

**1. Real Order Creation for Buyers**
- BLOCKED: Xeni checkout requires shop ownership
- BLOCKED: Xeni checkout has inventory race condition
- BLOCKED: No buyer order listing endpoint

**2. Guest Cart Sync to Xeni**
- BLOCKED: Xeni does not support guest carts
- BLOCKED: Session_id field unused

**3. Multi-Store Checkout**
- BLOCKED: Xeni cart is single-user, not multi-store aware
- E-Pic already has single-store constraint

---

## PRODUCTION BLOCKERS

### Critical Blockers

1. **Inventory Race Condition** - Prevents safe inventory management
2. **Shop Ownership Requirement** - Prevents buyer checkout
3. **No Buyer Order Listing** - Prevents order history for buyers
4. **No Guest Cart Support** - Prevents guest checkout with Xeni

### Required Xeni Enhancements

1. **Add database-level locking to inventory operations**
   - Use SELECT FOR UPDATE or optimistic locking
   - Prevent concurrent checkout overselling

2. **Create buyer checkout endpoint**
   - Separate from seller order creation
   - Does not require shop ownership
   - Validates prices at checkout time

3. **Implement guest cart support**
   - Use session_id field in Cart model
   - Allow cart operations without JWT
   - Session-based ownership validation

4. **Add buyer order listing endpoint**
   - Allow buyers to view their order history
   - Filter by customer phone/email instead of shop_id

5. **Add price revalidation at checkout**
   - Re-fetch current product prices before creating order
   - Detect price changes since cart creation
   - Alert customer to price changes

---

## RECOMMENDED ACTION PLAN

### Option 1: Wait for Xeni Enhancements (Recommended)

**Timeline:** 2-4 weeks for Xeni backend changes

**Steps:**
1. Xeni implements inventory locking
2. Xeni creates buyer checkout endpoint
3. Xeni implements guest cart support
4. Xeni adds buyer order listing
5. E-Pic implements integration with new endpoints

**Advantages:**
- Safe production deployment
- No architectural compromises
- Proper security posture

**Disadvantages:**
- Delayed implementation
- Dependent on Xeni team

---

### Option 2: Temporary Workaround (Not Recommended)

**Approach:** Use Xeni order creation endpoint directly with shop ownership workaround

**Steps:**
1. Create a "system shop" in Xeni for all E-Pic orders
2. All E-Pic buyers place orders through this system shop
3. E-Pic manages order routing to actual shops

**Advantages:**
- Faster implementation
- Can start with existing Xeni APIs

**Disadvantages:**
- Architectural hack
- Still has inventory race condition
- Shop ownership requirement bypassed
- Not a long-term solution

**Security Risk:** HIGH - This workaround introduces significant security and data integrity issues.

---

### Option 3: Hybrid Approach (Partial Implementation)

**Approach:** Implement what's safe, defer what's not

**Steps:**
1. Implement authenticated cart for sellers (safe)
2. Keep local guest cart for buyers (safe)
3. Implement checkout UI with local cart (safe)
4. Implement Xeni order creation for sellers only (safe)
5. Block real order creation for buyers (safe)
6. Wait for Xeni enhancements for buyer checkout

**Advantages:**
- Progress on safe functionality
- No security compromises
- Can iterate incrementally

**Disadvantages:**
- Incomplete buyer experience
- Still dependent on Xeni enhancements

**Recommendation:** This is the safest path forward.

---

## FILES AUDITED

### E-Pic Files

**Cart Implementation:**
- `lib/cart/types.ts` - Cart types definition
- `lib/cart/storage.ts` - LocalStorage cart persistence
- `lib/cart/provider.tsx` - Cart React context
- `lib/cart/index.ts` - Cart exports
- `app/api/cart/items/route.ts` - Cart API proxy (incomplete)
- `app/cart/page.tsx` - Cart page
- `components/cart/cart-client.tsx` - Cart UI component

**Checkout Implementation:**
- `lib/checkout/types.ts` - Checkout types definition
- `lib/checkout/provider.tsx` - Checkout React context
- `lib/checkout/index.ts` - Checkout exports
- `app/api/checkout/route.ts` - Checkout API proxy
- `app/checkout/page.tsx` - Checkout page
- `components/checkout/checkout-client.tsx` - Checkout UI component
- `components/checkout/customer-details-form.tsx` - Customer details form
- `components/checkout/delivery-address-form.tsx` - Delivery address form
- `components/checkout/payment-method-form.tsx` - Payment method form
- `components/checkout/order-review.tsx` - Order review component
- `components/checkout/order-confirmation.tsx` - Order confirmation component

### Xeni Files

**Cart Implementation:**
- `internal/cart/handler.go` - Cart handler (requires JWT)
- `internal/models/cart.go` - Cart models

**Checkout Implementation:**
- `internal/checkout/handler.go` - Checkout handler (requires JWT + shop)
- `internal/models/shop.go` - Shop models

**Order Implementation:**
- `internal/orders/handler.go` - Order handler (requires JWT)
- `internal/models/order.go` - Order models

---

## CURRENT FUNCTIONALITY

### What Works

1. **Guest Cart** - LocalStorage-based cart works for guest users
2. **Cart UI** - Cart page and components work with local data
3. **Checkout UI** - Checkout flow works with local data
4. **Seller Authentication** - Sellers can authenticate with Xeni
5. **Product/Store Browsing** - Read integration from Milestone 5.2 works

### What Doesn't Work

1. **Real Order Creation** - BLOCKED by Xeni requirements
2. **Guest Cart Sync to Xeni** - BLOCKED by Xeni authentication
3. **Buyer Order History** - BLOCKED by missing Xeni endpoint
4. **Inventory Safety** - BLOCKED by race condition
5. **Buyer Checkout** - BLOCKED by shop ownership requirement

---

## SECURITY AUDIT

### Token Security

**Status:** VERIFIED - SAFE
- No client-side Xeni tokens exposed
- HttpOnly cookies used for token storage
- Server-side token reading for API calls
- No secrets in source code

### IDOR Protection

**Status:** VERIFIED - SAFE
- Xeni validates cart ownership via user_id
- Xeni validates order ownership via shop_id
- E-Pic API routes proxy authentication correctly

### Price Tampering

**Status:** RISK DETECTED
- Xeni recalculates totals server-side (good)
- But prices come from cart items which could be stale
- No price revalidation at checkout time

### Quantity Tampering

**Status:** RISK DETECTED
- Xeni validates cart item ownership
- But inventory decrement has race condition
- No quantity revalidation at checkout time

### CSRF Protection

**Status:** NOT ASSESSED
- Xeni CSRF protection not audited
- E-Pic CSRF protection not audited

---

## PRODUCTION READINESS

### Current State

**Production Ready:**
- Guest cart (localStorage)
- Cart UI
- Checkout UI
- Seller authentication
- Product/store browsing

**Not Production Ready:**
- Real order creation
- Buyer checkout
- Inventory safety
- Guest cart sync
- Buyer order history

### Recommendations

**For Current State:**
1. Keep guest cart as localStorage
2. Keep checkout UI as is (demo mode)
3. Clearly label checkout as "demo" or "coming soon"
4. Do not expose real order creation to buyers

**For Production State:**
1. Wait for Xeni enhancements
2. Implement inventory locking
3. Implement buyer checkout endpoint
4. Implement guest cart support
5. Implement buyer order listing
6. Add price revalidation
7. Full security audit before deployment

---

## NEXT STEPS

### Immediate (This Milestone)

1. **Document findings** ✅
2. **Block real order creation** ✅
3. **Maintain current functionality** ✅
4. **Commit documentation** 🔄

### Short Term (Next Milestone)

1. **Coordinate with Xeni team** on required enhancements
2. **Define API contracts** for buyer checkout
3. **Define API contracts** for guest cart
4. **Define API contracts** for buyer orders

### Medium Term (Future Milestones)

1. **Implement Xeni inventory locking**
2. **Implement Xeni buyer checkout**
3. **Implement Xeni guest cart**
4. **Implement Xeni buyer order listing**
5. **Integrate E-Pic with new Xeni endpoints**

---

## FILES CREATED

- `MILESTONE_5_3_XENI_EPIC_CART_CHECKOUT_INTEGRATION.md` - This documentation

---

## FILES MODIFIED

NONE - No code changes made due to blockers

---

## DATABASE CHANGES

NONE - No database changes made in E-Pic or Xeni

---

## JEBKHARCH

UNCHANGED - No modifications to JebKharch

---

## TYPECHECK

NOT RUN - No code changes to typecheck

---

## LINT

NOT RUN - No code changes to lint

---

## BUILD

NOT RUN - No code changes to build

---

## MANUAL QA

NOT APPLICABLE - No code changes to test

---

## PRODUCTION BLOCKERS

1. **CRITICAL:** Inventory race condition in Xeni checkout
2. **CRITICAL:** Shop ownership requirement for Xeni checkout
3. **HIGH:** No guest cart support in Xeni
4. **HIGH:** No buyer order listing in Xeni
5. **MEDIUM:** Price revalidation needed at checkout

---

## COMMIT

NONE - No code changes to commit

---

## IMPORTANT

Milestone 5.3 is **BLOCKED** due to critical Xeni backend security gaps and architectural mismatches. 

E-Pic Marketplace cannot implement real cart and checkout integration with the current Xeni Gateway without introducing serious security vulnerabilities and architectural compromises.

The Xeni Gateway is designed as a seller platform (shop owners managing their own orders), not as a buyer marketplace (public customers purchasing from multiple sellers). To support E-Pic's use case, Xeni requires significant backend enhancements including:

1. Inventory locking to prevent race conditions
2. Buyer checkout endpoint that doesn't require shop ownership
3. Guest cart support for unauthenticated users
4. Buyer order listing endpoint
5. Price revalidation at checkout time

Until these enhancements are implemented in Xeni, E-Pic should:
- Continue using localStorage for guest cart
- Continue using current checkout UI in demo mode
- Not expose real order creation to buyers
- Coordinate with Xeni team on required enhancements

Do not attempt to bypass these blockers with workarounds, as they would introduce serious security risks and data integrity issues.

---

**Document Version:** 1.0
**Created:** 2025-09-05
**Author:** Devin AI Agent
**Status:** BLOCKED
