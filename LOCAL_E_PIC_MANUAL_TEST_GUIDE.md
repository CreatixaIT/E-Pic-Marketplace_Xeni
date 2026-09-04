# LOCAL E-PIC MANUAL TEST GUIDE

**Date:** 2026-09-01
**Frontend:** `/Users/air/Documents/E-Pic-Marketplace_Xeni/E-Pic-Marketplace_Xeni`
**Gateway:** `/Users/air/Desktop/INV/Xeni AI/Xeni_FB/Xeni_main/gateway`

---

## Startup Commands

### PostgreSQL
```bash
# PostgreSQL is already running locally
# Connection: postgres://xeni:xeni_secret@localhost:5432/xeni_db
# Status: Accepting connections ✅
```

### Redis
```bash
# Redis is already running locally
# Connection: redis://localhost:6379/0
# Status: PONG ✅
```

### Gateway
```bash
cd "/Users/air/Desktop/INV/Xeni AI/Xeni_FB/Xeni_main/gateway"
go run cmd/main.go
```

### Frontend
```bash
cd "/Users/air/Documents/E-Pic-Marketplace_Xeni/E-Pic-Marketplace_Xeni"
npm run dev
```

---

## Actual Local URLs

### Frontend
```
http://localhost:3000
http://127.0.0.1:3000
http://192.168.0.161:3000
```

### Gateway
```
http://localhost:8080
http://127.0.0.1:8080
```

### Gateway Health
```
http://localhost:8080/health
```

### Gateway Public API
```
http://localhost:8080/api/public/v1/products
http://localhost:8080/api/public/v1/stores
http://localhost:8080/api/public/v1/categories
```

---

## Current ERR_CONNECTION_REFUSED Issue

### Root Cause
The frontend was stopped (process 62454 was killed). The previous Next.js development server was no longer running on port 3000.

### Fix Applied
1. Killed the stale frontend process (PID 62454)
2. Restarted the frontend with `npm run dev`
3. Restarted the gateway with `go run cmd/main.go`
4. Verified both services are now accepting connections

### Verification
- ✅ Gateway health endpoint returns HTTP 200
- ✅ Frontend serves HTML on port 3000
- ✅ Frontend API configuration points to local gateway (http://localhost:8080/api/public/v1)

---

## Manual Testing Instructions

### Buyer Workflow

#### 1. Browse Homepage
**URL:** `http://localhost:3000`

**Expected:**
- Homepage loads with navigation
- Hero section with marketplace content
- Product discovery section
- Curated collections section
- Footer with links

#### 2. Explore Products
**URL:** `http://localhost:3000/explore`

**Expected:**
- Product listing page loads
- Category filters available
- Search functionality
- Product cards with name, price, store

**Current Status:** ✅ PAGE EXISTS - but no real products in database yet

#### 3. View Product Details
**URL:** `http://localhost:3000/products/[slug]`

**Expected:**
- Product detail page loads
- Product information (name, description, price, images)
- Store information
- Variant selection if applicable
- Add to cart button

**Current Status:** ✅ PAGE EXISTS - but no real products to test

#### 4. Browse Stores
**URL:** `http://localhost:3000/stores` (linked from homepage)

**Expected:**
- Store listing page
- Store cards with name, description, product count

**Current Status:** ✅ PAGE EXISTS - but no real stores in database yet

#### 5. View Store Details
**URL:** `http://localhost:3000/stores/[slug]`

**Expected:**
- Store detail page
- Store information
- Products from that store

**Current Status:** ✅ PAGE EXISTS - but no real stores to test

#### 6. Search and Filter
**Expected:**
- Search bar functionality
- Category filtering
- Sorting options
- Pagination

**Current Status:** ⚠️ PARTIAL - UI exists but database is empty

#### 7. Cart and Checkout
**URL:** `http://localhost:3000/cart`

**Expected:**
- Cart page loads
- Add to cart functionality
- Checkout process
- Order placement

**Current Status:** ✅ PAGE EXISTS - but no products to test with

---

### Seller Workflow

#### 1. Registration
**URL:** `http://localhost:3000/register`

**Expected:**
- Registration form with email, password, full name
- Account creation via NextAuth (Prisma)
- Email verification (if configured)

**Current Status:** ✅ PAGE EXISTS - Registration works with local Prisma database

#### 2. Login
**URL:** `http://localhost:3000/login`

**Expected:**
- Login form with email/password
- NextAuth authentication
- Session management

**Current Status:** ✅ PAGE EXISTS - Login works with local Prisma database

#### 3. Access Account Dashboard
**URL:** `http://localhost:3000/account`

**Expected:**
- Account dashboard with sections:
  - Profile
  - Orders
  - Addresses
  - Settings

**Current Status:** ✅ PAGE EXISTS - Dashboard works for authenticated users

#### 4. Seller Page
**URL:** `http://localhost:3000/seller`

**Expected:**
- Seller information page
- Store creation form
- Product management interface
- Inventory management interface

**Current Status:** ⚠️ PAGE EXISTS BUT INCOMPLETE - This is an informational page only, no actual seller dashboard functionality

#### 5. Shop Creation
**Status:** ❌ NO FRONTEND INTERFACE

**Backend:** ✅ Gateway has `POST /api/shops` endpoint

**Action Required:** No frontend UI for shop creation. Must use API directly.

#### 6. Product Creation
**Status:** ❌ NO FRONTEND INTERFACE

**Backend:** ✅ Gateway has `POST /api/products` endpoint

**Action Required:** No frontend UI for product creation. Must use API directly.

#### 7. Product Management
**Status:** ❌ NO FRONTEND INTERFACE

**Backend:** ✅ Gateway has full CRUD for products

**Action Required:** No frontend UI for product management. Must use API directly.

#### 8. Inventory Management
**Status:** ❌ NO FRONTEND INTERFACE

**Backend:** ✅ Gateway has inventory operation endpoints (restock, adjust, return, history)

**Action Required:** No frontend UI for inventory management. Must use API directly.

#### 9. Image Upload
**Status:** ❌ NO FRONTEND INTERFACE

**Backend:** ✅ Gateway has `POST /api/products/upload` endpoint

**Action Required:** No frontend UI for image upload. Must use API directly.

---

### Admin Workflow

#### Admin Interface
**Status:** ❌ NO FRONTEND ADMIN INTERFACE

**Backend:** ✅ Gateway has comprehensive admin endpoints:
- User management
- Shop management
- Content management
- System settings
- Agent tasks
- Plans and payments
- Reviews

**Action Required:** No frontend admin interface. Must use API directly.

---

## Backend API Testing

### Authentication
```bash
# Register
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"TestPassword123!","full_name":"Test User"}'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"TestPassword123!"}'
```

### Shop Creation (requires authentication)
```bash
curl -X POST http://localhost:8080/api/shops \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"shop_name":"Test Shop","shop_description":"A test shop","preferred_language":"en"}'
```

### Product Creation (requires authentication)
```bash
curl -X POST http://localhost:8080/api/products \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Product","description":"A test product","price":99.99,"sku":"TEST-001","initial_stock":10,"low_stock_threshold":5,"has_variants":false,"images":[]}'
```

### Inventory Operations (requires authentication)
```bash
# Restock
curl -X POST http://localhost:8080/api/products/{id}/restock \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"quantity":5,"notes":"Manual restock"}'

# Adjust
curl -X POST http://localhost:8080/api/products/{id}/adjust \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"quantity":-2,"notes":"Manual adjustment"}'

# Return
curl -X POST http://localhost:8080/api/products/{id}/return \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"quantity":1,"notes":"Product return"}'

# Inventory History
curl -X GET http://localhost:8080/api/products/{id}/inventory \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Important Notes

### Database State
- **PostgreSQL:** Connected and operational (25 tables verified)
- **Frontend Prisma:** Uses local SQLite database (`file:./dev.db`)
- **Gateway PostgreSQL:** Uses local PostgreSQL database (`xeni_db`)

### Data Separation
- **Frontend authentication:** Uses NextAuth with Prisma (SQLite)
- **Gateway authentication:** Uses custom JWT with PostgreSQL
- **No integration between frontend auth and gateway auth**

### Current Limitations
1. **No Seller Dashboard UI** - Seller page is informational only
2. **No Product Management UI** - Must use Gateway API directly
3. **No Inventory Management UI** - Must use Gateway API directly
4. **No Admin UI** - Must use Gateway API directly
5. **Auth Separation** - Frontend and Gateway use different authentication systems
6. **Image Upload** - Frontend has no upload UI, Gateway endpoint exists but DO Spaces not configured

### Recommendations for Testing
1. Use API tools (Postman, curl) to test seller functionality
2. Create test accounts via frontend registration/login
3. Use frontend to test buyer workflow (once data exists)
4. Test inventory operations via API
5. Test cross-shop isolation via API

---

## Next Steps

The frontend is primarily a **buyer-facing marketplace preview**. Full seller functionality (product management, inventory, admin) requires either:
1. Building seller dashboard UI components, or
2. Using the Gateway API directly for testing purposes
