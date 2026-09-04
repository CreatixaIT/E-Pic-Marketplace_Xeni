# XENI_EPIC_CAPABILITY_MATRIX

**Date:** 2026-09-01
**Purpose:** Audit existing Xeni backend capabilities to determine what can be reused vs what needs to be built

---

## AUTHENTICATION

| Feature | Database Model Exists | Backend Logic Exists | API Exists | Working | E-Pic UI Exists | Required Action |
| ------- | --------------------- | -------------------- | ---------- | ------- | --------------- | --------------- |
| Registration | ✅ User model | ✅ auth handler | ✅ POST /api/auth/register | ✅ | ✅ Register page | Do nothing - reuse |
| Login | ✅ User model | ✅ auth handler | ✅ POST /api/auth/login | ✅ | ✅ Login page | Do nothing - reuse |
| Logout | ✅ RefreshToken model | ✅ auth handler | ✅ POST /api/auth/logout | ✅ | ✅ Logout endpoint | Do nothing - reuse |
| JWT | ✅ RefreshToken model | ✅ jwt pkg | ✅ Generated on login | ✅ | ✅ Stored in cookies | Do nothing - reuse |
| Refresh token | ✅ RefreshToken model | ✅ auth handler | ✅ POST /api/auth/refresh | ✅ | ✅ Auto-refresh | Do nothing - reuse |
| Roles | ✅ UserRole enum | ✅ middleware | ✅ RBAC middleware | ✅ | ✅ Role mapping | Do nothing - reuse |
| Seller role | ✅ RoleSeller | ✅ auth handler | ✅ Role update | ✅ | ✅ Mapped to SELLER | Do nothing - reuse |
| Email verification | ✅ User.is_email_verified | ✅ auth handler | ✅ POST /api/auth/verify-email | ✅ | ⚠️ No UI | Add UI for OTP entry |
| Password reset | ✅ User model | ✅ auth handler | ✅ POST /api/auth/forgot-password | ✅ | ⚠️ No UI | Add UI for password reset |

---

## SHOPS AND SELLERS

| Feature | Database Model Exists | Backend Logic Exists | API Exists | Working | E-Pic UI Exists | Required Action |
| ------- | --------------------- | -------------------- | ---------- | ------- | --------------- | --------------- |
| Create shop | ✅ Shop model | ✅ shop handler | ✅ POST /api/shops | ✅ | ❌ No UI | Build seller shop creation UI |
| Update shop | ✅ Shop model | ✅ shop handler | ✅ PUT /api/shops/me | ✅ | ❌ No UI | Build seller shop edit UI |
| Seller profile | ✅ User + Shop models | ✅ user handler | ✅ GET /api/user/me | ✅ | ❌ No UI | Build seller profile UI |
| Shop ownership | ✅ Shop.user_id | ✅ middleware | ✅ Auth checks user_id | ✅ | ❌ No UI | Verify ownership in UI |
| Shop authorization | ✅ Shop.user_id | ✅ middleware | ✅ RBAC middleware | ✅ | ❌ No UI | Verify RBAC in UI |
| Shop settings | ✅ Shop model | ✅ shop handler | ✅ GET/PUT /api/shops/integrations | ✅ | ❌ No UI | Build shop settings UI |

---

## PRODUCTS

| Feature | Database Model Exists | Backend Logic Exists | API Exists | Working | E-Pic UI Exists | Required Action |
| ------- | --------------------- | -------------------- | ---------- | ------- | --------------- | --------------- |
| Create product | ✅ Product model | ✅ products handler | ✅ POST /api/products | ✅ | ❌ No UI | Build seller product creation UI |
| Update product | ✅ Product model | ✅ products handler | ✅ PUT /api/products/:id | ✅ | ❌ No UI | Build seller product edit UI |
| Delete product | ✅ Product model | ✅ products handler | ✅ DELETE /api/products/:id | ✅ | ❌ No UI | Build seller product delete UI |
| Archive product | ✅ Product.is_active | ✅ products handler | ✅ PUT /api/products/:id (set is_active) | ✅ | ❌ No UI | Build seller product archive UI |
| Product listing | ✅ Product model | ✅ public handler | ✅ GET /api/public/v1/products | ✅ | ✅ Explore page | Do nothing - reuse |
| Product detail | ✅ Product model | ✅ public handler | ✅ GET /api/public/v1/products/:id | ✅ | ✅ Product page | Do nothing - reuse |
| Variants | ✅ ProductVariant model | ✅ products handler | ✅ In Product response | ✅ | ⚠️ Display only | Build variant management UI |
| SKU validation | ✅ ProductVariant.sku | ✅ products handler | ✅ Unique constraint | ✅ | ❌ No UI | Build SKU validation UI |
| Pricing | ✅ Product.price | ✅ products handler | ✅ In Product model | ✅ | ✅ Display | Do nothing - reuse |
| Categories | ✅ Category model | ✅ public handler | ✅ GET /api/public/v1/categories | ✅ | ✅ Filter | Do nothing - reuse |
| Product images | ✅ Product.images (JSON) | ✅ products handler | ✅ POST /api/products/upload | ✅ | ❌ No UI | Build image upload UI |

---

## INVENTORY

| Feature | Database Model Exists | Backend Logic Exists | API Exists | Working | E-Pic UI Exists | Required Action |
| ------- | --------------------- | -------------------- | ---------- | ------- | --------------- | --------------- |
| Stock tracking | ✅ Product.current_stock | ✅ products handler | ✅ In Product model | ✅ | ⚠️ Display only | Build inventory UI |
| Restock | ✅ InventoryLog model | ✅ products handler | ✅ POST /api/products/:id/restock | ✅ | ❌ No UI | Build restock UI |
| Adjust stock | ✅ InventoryLog model | ✅ products handler | ✅ POST /api/products/:id/adjust | ✅ | ❌ No UI | Build adjust stock UI |
| Return stock | ✅ InventoryLog model | ✅ products handler | ✅ POST /api/products/:id/return | ✅ | ❌ No UI | Build return stock UI |
| Inventory logs | ✅ InventoryLog model | ✅ products handler | ✅ GET /api/products/:id/inventory | ✅ | ❌ No UI | Build inventory history UI |
| Inventory history | ✅ InventoryLog model | ✅ products handler | ✅ GET /api/products/:id/inventory | ✅ | ❌ No UI | Build inventory history UI |

---

## COMMERCE

| Feature | Database Model Exists | Backend Logic Exists | API Exists | Working | E-Pic UI Exists | Required Action |
| ------- | --------------------- | -------------------- | ---------- | ------- | --------------- | --------------- |
| Cart | ❌ No Cart model | ❌ No cart logic | ❌ No cart API | ❌ | ✅ Local cart (client-side) | Build backend cart API |
| Cart items | ❌ No CartItem model | ❌ No cart logic | ❌ No cart API | ❌ | ✅ Local cart items | Build backend cart API |
| Checkout | ❌ No Checkout model | ❌ No checkout logic | ❌ No checkout API | ❌ | ✅ Checkout page (placeholder) | Build backend checkout API |
| Orders | ✅ Order model | ✅ orders handler | ✅ POST /api/orders | ✅ | ❌ No buyer UI | Build buyer order UI |
| Order items | ✅ Order.order_items (JSON) | ✅ orders handler | ✅ In Order model | ✅ | ❌ No UI | Build order items UI |
| Order status | ✅ Order.payment_status | ✅ orders handler | ✅ PUT /api/orders/:id | ✅ | ❌ No UI | Build order status UI |
| Payment | ✅ Payment model (billing) | ✅ billing handler | ✅ POST /api/billing/subscribe | ✅ | ❌ No UI | Build payment UI |
| Payment status | ✅ Payment.status | ✅ billing handler | ✅ In Payment model | ✅ | ❌ No UI | Build payment status UI |
| Invoices | ❌ No Invoice model | ❌ No invoice logic | ❌ No invoice API | ❌ | ❌ No UI | Build invoice system (optional) |

---

## CUSTOMER FEATURES

| Feature | Database Model Exists | Backend Logic Exists | API Exists | Working | E-Pic UI Exists | Required Action |
| ------- | --------------------- | -------------------- | ---------- | ------- | --------------- | --------------- |
| Reviews | ✅ Review model | ✅ content handler | ✅ POST /api/content/reviews | ✅ | ❌ No UI | Build review UI |
| Conversations | ✅ Conversation model | ✅ conversations handler | ✅ GET /api/conversations | ✅ | ❌ No UI | Build conversation UI |
| Messages | ✅ Message model | ✅ conversations handler | ✅ POST /api/conversations/:id/messages | ✅ | ❌ No UI | Build message UI |
| Notifications | ❌ No Notification model | ✅ notifications service | ⚠️ WebSocket only | ✅ | ❌ No UI | Build notification UI |

---

## IMAGE AND FILE STORAGE

| Feature | Database Model Exists | Backend Logic Exists | API Exists | Working | E-Pic UI Exists | Required Action |
| ------- | --------------------- | -------------------- | ---------- | ------- | --------------- | --------------- |
| DigitalOcean Spaces | ✅ SpacesConfig | ✅ storage pkg | ✅ UploadFile function | ✅ | ❌ No UI | Integrate upload UI |
| DO Spaces | ✅ SpacesConfig | ✅ storage pkg | ✅ UploadFile function | ✅ | ❌ No UI | Integrate upload UI |
| AWS S3 | ✅ AWS SDK v2 | ✅ storage pkg | ✅ S3-compatible | ✅ | ❌ No UI | Do nothing - DO Spaces works |
| Object storage | ✅ S3-compatible | ✅ storage pkg | ✅ UploadFile function | ✅ | ❌ No UI | Integrate upload UI |
| Upload | ✅ multipart handler | ✅ products handler | ✅ POST /api/products/upload | ✅ | ❌ No UI | Build upload UI |
| Multipart | ✅ multipart handler | ✅ storage pkg | ✅ UploadFile function | ✅ | ❌ No UI | Do nothing - reuse |
| Media | ✅ Product.images (JSON) | ✅ products handler | ✅ In Product model | ✅ | ⚠️ Display only | Build media management UI |
| Images | ✅ Product.images (JSON) | ✅ products handler | ✅ POST /api/products/upload | ✅ | ⚠️ Display only | Build image upload UI |

---

## SUMMARY BY CATEGORY

### CATEGORY A — COMPLETE (Do nothing, reuse)
- ✅ Authentication (register, login, logout, JWT, refresh token, roles)
- ✅ Seller role
- ✅ Shop ownership and authorization
- ✅ Product listing and detail (public API)
- ✅ Categories
- ✅ Orders (backend)
- ✅ Payment (backend)
- ✅ Conversations (backend)
- ✅ Messages (backend)
- ✅ Reviews (backend)
- ✅ DigitalOcean Spaces (backend)
- ✅ Image upload (backend)

### CATEGORY B — BACKEND EXISTS, FRONTEND MISSING
- ⚠️ Email verification UI
- ⚠️ Password reset UI
- ⚠️ Seller shop creation UI
- ⚠️ Seller shop edit UI
- ⚠️ Seller profile UI
- ⚠️ Shop settings UI
- ⚠️ Seller product creation UI
- ⚠️ Seller product edit UI
- ⚠️ Seller product delete/archive UI
- ⚠️ Variant management UI
- ⚠️ SKU validation UI
- ⚠️ Image upload UI
- ⚠️ Inventory management UI (restock, adjust, return)
- ⚠️ Inventory history UI
- ⚠️ Buyer order UI
- ⚠️ Order status UI
- ⚠️ Payment UI
- ⚠️ Review UI
- ⚠️ Conversation UI
- ⚠️ Message UI
- ⚠️ Notification UI

### CATEGORY C — MODEL/SERVICE EXISTS BUT API IS MISSING
- ❌ Cart API (no Cart model exists)
- ❌ Checkout API (no Checkout model exists)
- ❌ Invoice API (no Invoice model exists)

### CATEGORY D — TRULY MISSING
- ❌ Cart model and API
- ❌ Checkout model and API
- ❌ Invoice model and API

---

## API ROUTES VERIFICATION

### Authentication

**Feature: Register**
- Method: POST
- Route: /api/auth/register
- Authentication: Not required
- Role: None
- Ownership check: N/A
- Current E-Pic frontend uses it: ✅ Yes

**Feature: Login**
- Method: POST
- Route: /api/auth/login
- Authentication: Not required
- Role: None
- Ownership check: N/A
- Current E-Pic frontend uses it: ✅ Yes

**Feature: Logout**
- Method: POST
- Route: /api/auth/logout
- Authentication: Required
- Role: Any
- Ownership check: N/A
- Current E-Pic frontend uses it: ✅ Yes

### Shop Management

**Feature: Create Shop**
- Method: POST
- Route: /api/shops
- Authentication: Required
- Role: Any
- Ownership check: N/A (creates new shop)
- Current E-Pic frontend uses it: ❌ No

**Feature: Get My Shop**
- Method: GET
- Route: /api/shops/me
- Authentication: Required
- Role: Any
- Ownership check: ✅ Yes (checks user_id)
- Current E-Pic frontend uses it: ❌ No

**Feature: Update My Shop**
- Method: PUT
- Route: /api/shops/me
- Authentication: Required
- Role: Any
- Ownership check: ✅ Yes (checks user_id)
- Current E-Pic frontend uses it: ❌ No

### Products

**Feature: Create Product**
- Method: POST
- Route: /api/products
- Authentication: Required
- Role: Any
- Ownership check: ⚠️ Needs verification
- Current E-Pic frontend uses it: ❌ No

**Feature: List Products**
- Method: GET
- Route: /api/products
- Authentication: Required
- Role: Any
- Ownership check: ⚠️ Needs verification (filters by shop_id)
- Current E-Pic frontend uses it: ❌ No

**Feature: Update Product**
- Method: PUT
- Route: /api/products/:id
- Authentication: Required
- Role: Any
- Ownership check: ⚠️ Needs verification
- Current E-Pic frontend uses it: ❌ No

**Feature: Delete Product**
- Method: DELETE
- Route: /api/products/:id
- Authentication: Required
- Role: Any
- Ownership check: ⚠️ Needs verification
- Current E-Pic frontend uses it: ❌ No

**Feature: Upload Image**
- Method: POST
- Route: /api/products/upload
- Authentication: Required
- Role: Any
- Ownership check: N/A
- Current E-Pic frontend uses it: ❌ No

### Inventory

**Feature: Restock**
- Method: POST
- Route: /api/products/:id/restock
- Authentication: Required
- Role: Any
- Ownership check: ⚠️ Needs verification
- Current E-Pic frontend uses it: ❌ No

**Feature: Adjust Stock**
- Method: POST
- Route: /api/products/:id/adjust
- Authentication: Required
- Role: Any
- Ownership check: ⚠️ Needs verification
- Current E-Pic frontend uses it: ❌ No

**Feature: Return Stock**
- Method: POST
- Route: /api/products/:id/return
- Authentication: Required
- Role: Any
- Ownership check: ⚠️ Needs verification
- Current E-Pic frontend uses it: ❌ No

**Feature: Inventory History**
- Method: GET
- Route: /api/products/:id/inventory
- Authentication: Required
- Role: Any
- Ownership check: ⚠️ Needs verification
- Current E-Pic frontend uses it: ❌ No

### Orders

**Feature: Create Order**
- Method: POST
- Route: /api/orders
- Authentication: Required
- Role: Any
- Ownership check: N/A (creates new order)
- Current E-Pic frontend uses it: ❌ No

**Feature: List Orders**
- Method: GET
- Route: /api/orders
- Authentication: Required
- Role: Any
- Ownership check: ⚠️ Needs verification (filters by shop_id)
- Current E-Pic frontend uses it: ❌ No

**Feature: Update Order**
- Method: PUT
- Route: /api/orders/:id
- Authentication: Required
- Role: Any
- Ownership check: ⚠️ Needs verification
- Current E-Pic frontend uses it: ❌ No

### Payments

**Feature: Subscribe**
- Method: POST
- Route: /api/billing/subscribe/sslcommerz
- Authentication: Required
- Role: Any
- Ownership check: N/A
- Current E-Pic frontend uses it: ❌ No

**Feature: Get Payments**
- Method: GET
- Route: /api/billing/payments
- Authentication: Required
- Role: Any
- Ownership check: ✅ Yes (filters by user_id)
- Current E-Pic frontend uses it: ❌ No

### Uploads

**Feature: Upload Image**
- Method: POST
- Route: /api/products/upload
- Authentication: Required
- Role: Any
- Ownership check: N/A
- Current E-Pic frontend uses it: ❌ No

---

## CATEGORY D DETAILS

### Cart

**Feature:** Cart and Cart Items

**Files searched:**
- internal/models/*.go
- internal/handlers/*.go
- internal/router/router.go

**Existing related implementation:**
- ❌ No Cart model found
- ❌ No CartItem model found
- ❌ No cart handler found
- ❌ No cart API routes found
- ✅ E-Pic has local cart (client-side state only)

**Why it cannot be reused:**
- Cart functionality does not exist in Xeni backend
- Xeni's Order system is for Facebook Messenger orders (AI-driven)
- E-Pic needs a different cart system for web checkout

**Minimum work required:**
- Create Cart model in Xeni backend
- Create CartItem model in Xeni backend
- Create cart handler in Xeni backend
- Add cart API routes to Xeni backend
- Connect E-Pic local cart to Xeni backend cart

### Checkout

**Feature:** Checkout process

**Files searched:**
- internal/models/*.go
- internal/handlers/*.go
- internal/router/router.go

**Existing related implementation:**
- ❌ No Checkout model found
- ❌ No checkout handler found
- ❌ No checkout API routes found
- ✅ E-Pic has checkout page (placeholder)
- ✅ Xeni has Order creation API

**Why it cannot be reused:**
- Checkout process does not exist in Xeni backend
- Xeni's Order system is for Facebook Messenger orders
- E-Pic needs a different checkout process for web orders

**Minimum work required:**
- Create checkout handler in Xeni backend
- Add checkout API routes to Xeni backend
- Connect E-Pic checkout page to Xeni backend checkout
- Convert cart to order during checkout

### Invoice

**Feature:** Invoice generation

**Files searched:**
- internal/models/*.go
- internal/handlers/*.go
- internal/router/router.go

**Existing related implementation:**
- ❌ No Invoice model found
- ❌ No invoice handler found
- ❌ No invoice API routes found
- ✅ Xeni has Payment model (for subscriptions)

**Why it cannot be reused:**
- Invoice functionality does not exist in Xeni backend
- Xeni's Payment system is for subscriptions, not orders

**Minimum work required:**
- Create Invoice model in Xeni backend
- Create invoice handler in Xeni backend
- Add invoice API routes to Xeni backend
- Generate invoices after order completion
- Connect E-Pic to invoice system

---

## CONCLUSION

**Category A (Complete):** 23 features - Reuse as-is
**Category B (Backend exists, frontend missing):** 21 features - Build frontend UI
**Category C (Model/service exists, API missing):** 3 features - Add API routes
**Category D (Truly missing):** 3 features - Build from scratch

**Key Finding:** Xeni backend has extensive functionality for sellers, products, inventory, orders, and payments. The main gaps are:
1. Cart system (missing entirely)
2. Checkout process (missing entirely)
3. Invoice system (missing entirely)
4. Frontend UI for seller features (missing entirely)

**Recommendation:** Focus on building frontend UI for existing backend features, then add missing cart/checkout/invoice APIs.
