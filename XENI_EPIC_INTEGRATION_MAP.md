# XENI ↔ E-PIC INTEGRATION MAP

## Authoritative Architecture

```
                    ┌─────────────────────────┐
                    │       E-PIC             │
                    │ Premium Marketplace     │
                    │ Customer Experience     │
                    └────────────┬────────────┘
                                 │
                                 │ API
                                 ▼
                    ┌─────────────────────────┐
                    │       XENI BACKEND      │
                    │ Go + Fiber              │
                    │ PostgreSQL              │
                    │ Redis                   │
                    │ Commerce Engine         │
                    └────────────┬────────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              ▼                  ▼                  ▼
          Products            Orders             Payments
          Inventory           Sellers             Delivery
          Variants             Shops              Commerce
```

## Repository Locations

| Repository | Type | Location | Remote URL |
|------------|------|----------|------------|
| **E-Pic Marketplace** | Customer Frontend | `/Users/air/Documents/E-Pic-Marketplace_Xeni/E-Pic-Marketplace_Xeni` | `https://github.com/CreatixaIT/E-Pic-Marketplace_Xeni.git` |
| **Xeni Backend** | Commerce Backend | `/Users/air/Desktop/INV/Xeni AI/Xeni_FB/xeni-main` | `https://github.com/CreatixaIT/Xeni_main.git` |
| **Xeni Web** | Operational Frontend | `/Users/air/Desktop/INV/Xeni AI/Xeni_FB/Xeni_Web_main` | `https://github.com/CreatixaIT/Xeni_Web_main.git` |

## Critical Finding: Public API Location

**IMPORTANT**: The Milestone 6.1 Public Commerce API exists in the local `xeni-main` directory but **NOT** in the GitHub `Xeni_main` repository.

- **Local Development**: `/Users/air/Desktop/INV/Xeni AI/Xeni_FB/xeni-main/gateway/internal/public/handler.go`
- **GitHub Repository**: `/Users/air/Desktop/INV/Xeni AI/Xeni_FB/Xeni_main/gateway/` (NO public API directory)

This means the GitHub repository does not have the public API endpoints that E-Pic needs.

## System Responsibilities

### Xeni Backend (Single Source of Truth)
- ✅ Products
- ✅ Product variants  
- ✅ Product pricing
- ✅ Inventory
- ✅ Product images
- ✅ Stores/sellers
- ✅ Categories
- ✅ Orders
- ✅ Order status
- ✅ Payment operations
- ✅ Delivery operations
- ✅ Seller commerce data
- ✅ Commerce-related business logic

### E-Pic Marketplace (Customer Experience)
- ✅ Marketplace homepage
- ✅ Product discovery
- ✅ Product presentation
- ✅ Store discovery
- ✅ Store presentation
- ✅ Search UX
- ✅ Category UX
- ✅ Customer account UI
- ✅ Cart UI
- ✅ Checkout UI
- ✅ Customer-facing order UI
- ✅ Marketplace navigation
- ✅ Premium visual experience
- ✅ English/Bangla customer experience

### Xeni Web (Operational Interface)
- ✅ Seller onboarding
- ✅ Product management
- ✅ Shop management
- ✅ Inventory management
- ✅ Order management
- ✅ Payment management
- ✅ Admin workflows
- ✅ Business analytics

## Integration Status Matrix

| E-Pic Feature | Xeni Backend Source | Xeni Web Relationship | Status |
|--------------|---------------------|----------------------|--------|
| Products | Xeni Public Product API (`/api/public/v1/products`) | Product management | ⚠️ MISSING FROM GITHUB |
| Product Detail | Xeni Product API (`/api/public/v1/products/:identifier`) | Product management | ⚠️ MISSING FROM GITHUB |
| Inventory | Xeni inventory system | Inventory management | ⚠️ MISSING FROM GITHUB |
| Stores | Xeni Shop/Public Store API (`/api/public/v1/stores`) | Shop management | ⚠️ MISSING FROM GITHUB |
| Categories | Xeni Category API (`/api/public/v1/categories`) | Category management | ⚠️ MISSING FROM GITHUB |
| Orders | Xeni Order API (requires auth) | Order management | 🔒 NOT YET INTEGRATED |
| Payments | Xeni Payment/Billing (requires auth) | Payment management | 🔒 NOT YET INTEGRATED |
| Sellers | Xeni Shop/User (requires auth) | Seller management | 🔒 NOT YET INTEGRATED |

## Xeni Backend Architecture

### Technology Stack
- **Language**: Go 1.24
- **Framework**: Fiber v2.52.6
- **Database**: PostgreSQL with GORM v1.25.12
- **Cache**: Redis v9.7.0
- **Message Queue**: RabbitMQ (amqp091-go v1.10.0)
- **Storage**: DigitalOcean Spaces (AWS S3 SDK v2)
- **Authentication**: JWT (golang-jwt/jwt/v5 v5.2.1)
- **Email**: Resend (resend-go v2.28.0)

### Database Models
- `User` - User accounts with roles (super_admin, admin, seller, customer)
- `Shop` - Store/seller profiles
- `Product` - Product catalog with variants
- `ProductVariant` - Product variants (color, size, price modifier)
- `Category` - Hierarchical categories with bilingual support
- `ProductCategory` - Many-to-many product-category relationships
- `InventoryLog` - Inventory tracking
- `Billing` - Subscription and payment tracking
- `Order` - Order management
- `Agent` / `AgentRule` - AI agent system

### API Structure

#### Existing API Routes (GitHub Repository)
- `/api/auth/*` - Authentication (register, login, OAuth, 2FA)
- `/api/user/*` - User management (authenticated)
- `/api/shops/*` - Shop management (authenticated)
- `/api/products/*` - Product management (authenticated)
- `/api/orders/*` - Order management (authenticated)
- `/api/billing/*` - Subscription and payments
- `/api/agents/*` - AI agent execution
- `/api/content/*` - Public content (hero, banner, FAQ, reviews)
- `/api/admin/*` - Admin operations
- `/webhooks/*` - Messenger and WhatsApp webhooks

#### Public API Routes (Local Development Only)
**CRITICAL**: These exist in `xeni-main` but NOT in GitHub `Xeni_main`:
- `GET /api/public/v1/products` - Public product listing
- `GET /api/public/v1/products/:identifier` - Public product details
- `GET /api/public/v1/stores` - Public store listing
- `GET /api/public/v1/stores/:identifier` - Public store details
- `GET /api/public/v1/categories` - Public category listing
- `GET /api/public/v1/categories/:slug` - Public category details

### Security Features
- JWT-based authentication with access/refresh tokens
- Redis-based token blocking
- Rate limiting (configurable per endpoint)
- CORS middleware
- Security headers middleware
- Request ID middleware
- Role-based access control (RBAC)

## Xeni Web Architecture

### Technology Stack
- **Framework**: Next.js 14.2.15
- **Language**: TypeScript
- **State Management**: Zustand v5.0.0
- **Data Fetching**: TanStack Query v5.60.0
- **Forms**: React Hook Form v7.72.1
- **Styling**: Tailwind CSS v3.4.14
- **Internationalization**: next-intl v3.25.0
- **HTTP Client**: Axios v1.7.7

### API Client Pattern
```typescript
// Uses centralized axios instance with:
// - Automatic JWT token attachment
// - Token refresh on 401
// - Subscription upgrade handling on 403
// - Base URL from NEXT_PUBLIC_API_URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
```

### Environment Configuration
- `NEXT_PUBLIC_API_URL` - Xeni Backend URL
- `NEXT_PUBLIC_WS_URL` - WebSocket URL
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` - Google OAuth
- `NEXT_PUBLIC_FACEBOOK_APP_ID` - Facebook OAuth
- Firebase configuration for push notifications

## E-Pic Architecture

### Technology Stack
- **Framework**: Next.js (latest)
- **Language**: TypeScript
- **Authentication**: Auth.js v5 (next-auth@beta)
- **Database**: SQLite with Prisma ORM
- **Styling**: Tailwind CSS
- **Internationalization**: Custom i18n system (English/Bangla)

### Commerce Provider Interface
```typescript
interface CommerceProvider {
  name: string;
  getStores(): Promise<Store[]>;
  getFeaturedStores(): Promise<Store[]>;
  getStoreBySlug(slug: string): Promise<Store | null>;
  getStoreById(storeId: string): Promise<Store | null>;
  getProducts(): Promise<Product[]>;
  getProductsByStore(storeId: string): Promise<Product[]>;
  getProductsByCategory(category: CategoryId): Promise<Product[]>;
  getCategories(): Promise<Category[]>;
  getCollection(collection: CollectionId): Promise<Product[]>;
  getPromoSlides(): Promise<PromoSlide[]>;
  getCart(): Promise<Cart>;
  getProductBySlug(slug: string): Promise<Product | null>;
}
```

### Xeni Provider Implementation
- **API Base URL**: `process.env.XENI_API_BASE_URL` (server-side)
- **Public Provider**: `process.env.NEXT_PUBLIC_COMMERCE_PROVIDER` (client-side)
- **Caching**: Next.js fetch with 5-minute revalidation
- **Error Handling**: Graceful fallbacks to empty arrays/null
- **Data Mapping**: Xeni types → E-Pic types with category mapping

### Environment Configuration
- `NEXT_PUBLIC_COMMERCE_PROVIDER` - "mock" or "xeni"
- `XENI_API_BASE_URL` - Xeni Public API URL (server-side only)

## Authentication Architecture

### Current State: Separate Systems

#### E-Pic Authentication
- **System**: Auth.js v5 with Credentials provider
- **Storage**: E-Pic SQLite database
- **User Model**: E-Pic-specific User model
- **Session**: JWT-based session management
- **Purpose**: Customer marketplace authentication

#### Xeni Authentication
- **System**: Custom JWT implementation
- **Storage**: Xeni PostgreSQL database
- **User Model**: Xeni User model with roles
- **Session**: Redis-backed JWT with refresh tokens
- **OAuth**: Google and Facebook OAuth integration
- **2FA**: TOTP-based two-factor authentication
- **Purpose**: Commerce backend authentication

### Authentication Gap
- **No Integration**: E-Pic and Xeni use separate user systems
- **No Token Sharing**: E-Pic sessions cannot access Xeni authenticated endpoints
- **Current Solution**: E-Pic uses Xeni Public API (no authentication required)
- **Future Need**: Authentication bridge for transactional operations (cart, checkout, orders)

## Critical Blockers

### 1. Missing Public API in GitHub Repository
**Status**: 🔴 CRITICAL
**Issue**: The Milestone 6.1 Public Commerce API exists only in local development (`xeni-main`) but not in the GitHub repository (`Xeni_main`)
**Impact**: E-Pic cannot connect to the official Xeni repository for catalog data
**Required Action**: Commit and push the public API implementation to the GitHub repository

### 2. Authentication Mismatch
**Status**: 🟡 MEDIUM
**Issue**: Separate authentication systems prevent transactional integration
**Impact**: Cart, checkout, and order functionality cannot be implemented
**Required Action**: Design and implement authentication bridge (future milestone)

### 3. Runtime Environment
**Status**: 🟡 MEDIUM
**Issue**: Docker and Go unavailable in current environment
**Impact**: Cannot perform runtime testing of the integration
**Required Action**: Set up proper development environment with Docker and Go

## Integration Flow (Current State)

### Catalog Data Flow (Working)
```
E-Pic Marketplace
    ↓ HTTP GET (Next.js fetch)
Xeni Public API (Local Development)
    ↓ GORM Query
PostgreSQL Database
    ↓ Response
E-Pic Commerce Provider
    ↓ Data Mapping
E-Pic UI Components
```

### Operational Flow (Intended)
```
Seller/Admin
    ↓ Xeni Web UI
Xeni Backend API (Authenticated)
    ↓ GORM Operations
PostgreSQL Database
    ↓ Data Changes
Xeni Public API
    ↓ HTTP GET
E-Pic Marketplace
```

## Next Steps

### Immediate (Milestone 6.3 Part 3)
1. ✅ Repository discovery and verification
2. ✅ Architecture documentation
3. ✅ Integration mapping
4. ⏳ Runtime environment setup
5. ⏳ Real API testing
6. ⏳ Security verification

### Critical Path (Post-Milestone 6.3)
1. **Commit Public API to GitHub**: Push `internal/public/` to `Xeni_main` repository
2. **Runtime Testing**: Start Xeni backend and test public endpoints
3. **E-Pic Connection**: Configure E-Pic to connect to real Xeni API
4. **Data Validation**: Verify real catalog data flows correctly
5. **Authentication Bridge**: Design auth system for transactional operations

### Future Milestones
- Cart backend integration
- Checkout flow integration
- Order management integration
- Payment integration
- Customer order history
- Seller onboarding integration

## Security Considerations

### Current Security Posture
- ✅ Public API has rate limiting (100 req/min)
- ✅ Public API excludes sensitive data (credentials, internal configs)
- ✅ Environment variables properly gitignored
- ✅ No hardcoded secrets in E-Pic Xeni provider
- ✅ Server-side API URL configuration (XENI_API_BASE_URL)

### Security Gaps Identified
- ⚠️ GitHub repository `.env.example` contains real credentials (needs cleanup)
- ⚠️ No authentication on public API (by design, but needs monitoring)
- ⚠️ No API key mechanism for public API (consider adding for abuse prevention)

### Recommended Security Enhancements
1. Clean up real credentials from GitHub `.env.example` files
2. Add API key mechanism for public API rate limit tracking
3. Implement request signing for public API (optional)
4. Add CORS configuration for E-Pic domain
5. Monitor public API usage for abuse patterns

## Performance Considerations

### Current Optimizations
- ✅ Next.js fetch caching (5-minute revalidation)
- ✅ Redis caching in Xeni backend
- ✅ Database query optimization with GORM
- ✅ Rate limiting to prevent abuse

### Recommended Optimizations
1. Implement CDN for product images
2. Add database query caching layer
3. Implement pagination for all list endpoints
4. Add response compression middleware
5. Consider GraphQL for complex queries

## Monitoring & Observability

### Current Monitoring
- ✅ Request ID middleware for tracing
- ✅ Structured logging with slog
- ✅ Health check endpoint (`/health`)
- ✅ Prometheus metrics endpoint (`/metrics`)

### Recommended Monitoring
1. Add application performance monitoring (APM)
2. Implement distributed tracing
3. Add business metrics (product views, add-to-cart, etc.)
4. Set up alerting for API failures
5. Monitor database query performance

## Conclusion

The integration architecture is sound, with clear separation of concerns:

- **Xeni Backend**: Commerce engine and single source of truth
- **Xeni Web**: Operational interface for sellers and admins
- **E-Pic Marketplace**: Customer-facing premium experience

**Critical Issue**: The Public Commerce API from Milestone 6.1 must be committed to the GitHub repository before E-Pic can connect to the official Xeni backend.

**Next Priority**: Set up runtime environment, test real API connections, and verify data flow between systems.

---

*Document generated during Milestone 6.3 Part 3 - Xeni Repository Alignment + Real Runtime Preparation*
