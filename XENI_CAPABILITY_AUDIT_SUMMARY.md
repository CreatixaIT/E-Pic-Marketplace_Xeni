# XENI CAPABILITY AUDIT SUMMARY

**Date:** 2026-09-01
**Status:** Part 1 Complete - Awaiting Part 2 Approval

---

## EXISTING XENI FEATURES WE WILL REUSE

**Authentication:**
- ✅ Registration, login, logout (complete with JWT, refresh tokens)
- ✅ Role-based access control (user, seller, admin, super_admin)
- ✅ Email verification (OTP system)
- ✅ Password reset (forgot password flow)

**Shop Management:**
- ✅ Shop creation and management
- ✅ Shop ownership and authorization (user_id unique constraint)
- ✅ Shop settings and integrations

**Product Management:**
- ✅ Product CRUD operations
- ✅ Product variants (SKU, color, size, price modifier, stock)
- ✅ Product categories and category hierarchy
- ✅ Product images (JSON array)
- ✅ Product pricing and availability

**Inventory Management:**
- ✅ Stock tracking (current_stock, initial_stock, low_stock_threshold)
- ✅ Inventory movements (restock, adjust, return)
- ✅ Inventory logs (audit trail with old_stock, new_stock, quantity, type)
- ✅ Inventory history API

**Order Management:**
- ✅ Order creation and management
- ✅ Order items (JSON array)
- ✅ Order status (payment_status, delivery_status)
- ✅ Order updates (confirm payment, reject payment)
- ✅ Order stats and manual review

**Customer Features:**
- ✅ Reviews (submission, approval, rejection)
- ✅ Conversations (messenger-based)
- ✅ Messages (inbound/outbound, AI/human sender)
- ✅ Notifications (WebSocket-based)

**Image Storage:**
- ✅ DigitalOcean Spaces integration (AWS S3-compatible)
- ✅ Image upload API (multipart)
- ✅ Image URL generation (CDN support)
- ✅ Upload from URL (for Messenger screenshots)

**Billing:**
- ✅ Subscription plans (tier, pricing, features)
- ✅ Subscription management (active, past_due, cancelled)
- ✅ Payment processing (SSLCommerz integration)
- ✅ Payment history and status

---

## E-PIC FRONTEND FEATURES THAT ARE MISSING

**Seller Dashboard:**
- ❌ Shop creation UI
- ❌ Shop edit UI
- ❌ Shop settings UI
- ❌ Seller profile UI
- ❌ Seller role assignment UI

**Product Management:**
- ❌ Product creation UI
- ❌ Product edit UI
- ❌ Product delete/archive UI
- ❌ Image upload UI
- ❌ Variant management UI
- ❌ SKU validation UI
- ❌ Inventory management UI (restock, adjust, return)
- ❌ Inventory history UI

**Order Management:**
- ❌ Seller order list UI
- ❌ Seller order detail UI
- ❌ Order status update UI
- ❌ Buyer order list UI
- ❌ Buyer order detail UI

**Checkout:**
- ❌ Cart integration with backend (currently local only)
- ❌ Checkout process UI (currently placeholder)
- ❌ Payment UI for orders (subscription payment exists but not for orders)

**Customer Features:**
- ❌ Review submission UI
- ❌ Conversation UI
- ❌ Message UI
- ❌ Notification UI

**Authentication:**
- ❌ Email verification UI (OTP entry)
- ❌ Password reset UI

---

## BACKEND API GAPS

**Cart System:**
- ❌ No Cart model exists
- ❌ No CartItem model exists
- ❌ No cart handler exists
- ❌ No cart API routes exist
- **Action Required:** Create Cart model, CartItem model, cart handler, and cart API routes

**Checkout System:**
- ❌ No Checkout model exists
- ❌ No checkout handler exists
- ❌ No checkout API routes exist
- **Action Required:** Create checkout handler and checkout API routes

**Invoice System:**
- ❌ No Invoice model exists
- ❌ No invoice handler exists
- ❌ No invoice API routes exist
- **Action Required:** Create Invoice model, invoice handler, and invoice API routes

**Search API:**
- ⚠️ No dedicated search endpoint (currently client-side filtering only)
- **Action Required:** Add search API or enhance existing public API with search parameters

**Filtering API:**
- ⚠️ Limited filtering (category, store_id only)
- **Action Required:** Enhance public API with more filtering options (price range, availability, etc.)

**Seller Role Assignment:**
- ⚠️ No direct API for seller role assignment (admin only)
- **Action Required:** Add seller role assignment API or manual admin assignment

---

## TRULY MISSING FEATURES

**Cart System:**
- **Feature:** Shopping cart and cart items
- **Files searched:** internal/models/*.go, internal/handlers/*.go, internal/router/router.go
- **Existing related implementation:** E-Pic has local cart (client-side state only)
- **Why it cannot be reused:** Cart functionality does not exist in Xeni backend. Xeni's Order system is for Facebook Messenger orders (AI-driven). E-Pic needs a different cart system for web checkout.
- **Minimum work required:** Create Cart model, CartItem model, cart handler, cart API routes, connect E-Pic local cart to Xeni backend cart

**Checkout System:**
- **Feature:** Checkout process
- **Files searched:** internal/models/*.go, internal/handlers/*.go, internal/router/router.go
- **Existing related implementation:** E-Pic has checkout page (placeholder), Xeni has Order creation API
- **Why it cannot be reused:** Checkout process does not exist in Xeni backend. Xeni's Order system is for Facebook Messenger orders. E-Pic needs a different checkout process for web orders.
- **Minimum work required:** Create checkout handler, checkout API routes, connect E-Pic checkout page to Xeni backend checkout, convert cart to order during checkout

**Invoice System:**
- **Feature:** Invoice generation
- **Files searched:** internal/models/*.go, internal/handlers/*.go, internal/router/router.go
- **Existing related implementation:** Xeni has Payment model (for subscriptions)
- **Why it cannot be reused:** Invoice functionality does not exist in Xeni backend. Xeni's Payment system is for subscriptions, not orders.
- **Minimum work required:** Create Invoice model, invoice handler, invoice API routes, generate invoices after order completion, connect E-Pic to invoice system

---

## FEATURES THAT MUST NOT BE REBUILT

**DO NOT REBUILD:**
- ❌ Authentication system (use existing Xeni auth)
- ❌ User management (use existing Xeni user model)
- ❌ Shop management (use existing Xeni shop model and API)
- ❌ Product management (use existing Xeni product model and API)
- ❌ Inventory management (use existing Xeni inventory logs and API)
- ❌ Order management (use existing Xeni order model and API)
- ❌ Payment processing (use existing Xeni payment system)
- ❌ Image storage (use existing Xeni DO Spaces integration)
- ❌ Category management (use existing Xeni category model and API)
- ❌ Reviews (use existing Xeni review model and API)
- ❌ Conversations (use existing Xeni conversation model and API)
- ❌ Messages (use existing Xeni message model and API)
- ❌ Notifications (use existing Xeni notification service)

**ARCHITECTURE RULE:**
- ONE authentication system (Xeni Gateway)
- ONE product system (Xeni Gateway)
- ONE inventory system (Xeni Gateway)
- ONE order system (Xeni Gateway)
- ONE database (Xeni PostgreSQL)

**NO DUPLICATE BACKEND LOGIC.**

---

## FAST PRODUCTION PLAN

**Priority 1: Seller Product Management UI**
- Build seller shop creation UI (POST /api/shops)
- Build seller shop edit UI (PUT /api/shops/me)
- Build seller product creation UI (POST /api/products)
- Build seller product edit UI (PUT /api/products/:id)
- Build image upload UI (POST /api/products/upload)
- Build variant management UI (integrated with product creation/edit)
- Build inventory management UI (POST /api/products/:id/restock, adjust, return)
- Build inventory history UI (GET /api/products/:id/inventory)

**Priority 2: Cart Backend API**
- Create Cart model in Xeni backend
- Create CartItem model in Xeni backend
- Create cart handler in Xeni backend
- Add cart API routes (POST /api/cart, GET /api/cart, PUT /api/cart/:id, DELETE /api/cart/:id)
- Connect E-Pic local cart to Xeni backend cart

**Priority 3: Checkout Backend API**
- Create checkout handler in Xeni backend
- Add checkout API routes (POST /api/checkout)
- Connect E-Pic checkout page to Xeni backend checkout
- Convert cart to order during checkout

**Priority 4: Order Management UI**
- Build seller order list UI (GET /api/orders)
- Build seller order detail UI (GET /api/orders/:id)
- Build order status update UI (PUT /api/orders/:id)
- Build buyer order list UI (GET /api/orders)
- Build buyer order detail UI (GET /api/orders/:id)

**Priority 5: Authentication UI**
- Build email verification UI (POST /api/auth/verify-email)
- Build password reset UI (POST /api/auth/forgot-password, POST /api/auth/reset-password)

**Priority 6: Shop Settings UI**
- Build shop settings UI (GET/PUT /api/shops/integrations)
- Build seller profile UI (GET /api/user/me)

**Priority 7: Payment UI for Orders**
- Build payment UI for orders (separate from subscription payment)
- Connect to existing SSLCommerz integration

**Priority 8: Customer Features UI**
- Build review submission UI (POST /api/content/reviews)
- Build conversation UI (GET /api/conversations)
- Build message UI (POST /api/conversations/:id/messages)

**Priority 9: Search and Filter Enhancement**
- Add search API or enhance existing public API with search parameters
- Enhance public API with more filtering options (price range, availability, etc.)

**Priority 10: Invoice System**
- Create Invoice model in Xeni backend
- Create invoice handler in Xeni backend
- Add invoice API routes
- Generate invoices after order completion
- Connect E-Pic to invoice system

---

## WHAT ALREADY EXISTS, WHAT NEEDS FRONTEND INTEGRATION, AND WHAT GENUINELY NEEDS TO BE BUILT

**What Already Exists (Reuse):**
- Complete authentication system (register, login, logout, JWT, refresh tokens, roles)
- Complete shop management (create, update, settings, integrations)
- Complete product management (CRUD, variants, categories, images)
- Complete inventory management (stock tracking, movements, logs, history)
- Complete order management (create, update, status, stats)
- Complete payment processing (SSLCommerz, subscriptions)
- Complete image storage (DO Spaces, upload, CDN)
- Complete customer features (reviews, conversations, messages, notifications)

**What Needs Frontend Integration (Build UI):**
- Seller shop creation and edit UI
- Seller product management UI (create, edit, delete, archive)
- Image upload UI
- Variant management UI
- Inventory management UI (restock, adjust, return, history)
- Seller order management UI (list, detail, status update)
- Buyer order management UI (list, detail)
- Authentication UI (email verification, password reset)
- Shop settings UI
- Seller profile UI
- Customer features UI (reviews, conversations, messages)

**What Genuinely Needs to Be Built (Backend + Frontend):**
- Cart system (model, handler, API, UI)
- Checkout system (handler, API, UI)
- Invoice system (model, handler, API, UI)
- Search API enhancement
- Filter API enhancement
- Seller role assignment API
- Payment UI for orders (separate from subscription payment)

---

**Part 1 Status:** ✅ COMPLETE
**Part 2 Status:** ⏳ AWAITING APPROVAL
**Capability Matrix:** ✅ XENI_EPIC_CAPABILITY_MATRIX.md
**Workflow Verification:** ✅ E-PIC_WORKFLOW_VERIFICATION.md
**Next Step:** Proceed to Part 2 (Build Minimum Production MVP) only after approval
