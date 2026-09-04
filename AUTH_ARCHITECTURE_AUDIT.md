# AUTHENTICATION ARCHITECTURE AUDIT

**Date:** 2026-09-01
**Milestone:** 6.3.2B Part 10A
**Purpose:** Audit and plan integration of split authentication systems

---

## Current Authentication Architecture

### Frontend Authentication (Next.js + NextAuth)

**Technology Stack:**
- NextAuth v5 (beta)
- Prisma ORM
- SQLite database
- JWT session strategy

**Configuration:**
- File: `/Users/air/Documents/E-Pic-Marketplace_Xeni/E-Pic-Marketplace_Xeni/lib/auth.ts`
- Session Strategy: JWT
- Provider: Credentials (email/password)

**Database Schema (SQLite):**
- **User** table with fields:
  - `id` (String, CUID)
  - `name` (String?)
  - `email` (String, unique)
  - `emailVerified` (DateTime?)
  - `password` (String)
  - `role` (String, default: "BUYER")
  - `status` (String, default: "ACTIVE")
  - `image` (String?)
  - `createdAt` (DateTime)
  - `updatedAt` (DateTime)

**User Roles (Frontend):**
- BUYER
- SELLER
- ADMIN

**Session Management:**
- JWT-based sessions
- Session tokens stored in HTTP-only cookies
- Refresh token mechanism via NextAuth

**Authentication Flow:**
1. User registers via `/register` page
2. NextAuth credentials provider validates email/password
3. Password hashed with bcrypt
4. User stored in SQLite database
5. JWT session token issued
6. Session token stored in HTTP-only cookie

**Protected Routes:**
- Account dashboard (`/account`)
- Profile management
- Order history (UI exists, no backend integration)

---

### Gateway Authentication (Go + Custom JWT)

**Technology Stack:**
- Fiber web framework
- GORM ORM
- PostgreSQL database
- Custom JWT implementation
- Redis for session management

**Configuration:**
- File: `/Users/air/Desktop/INV/Xeni AI/Xeni_FB/Xeni_main/gateway/internal/auth/handler.go`
- JWT Secret: `28d7aaf2cfc71339d34b6a0f7d519ed9b04d55774bf7343ebaae6d63374bf3de`
- Access Token Expiry: 15 minutes
- Refresh Token Expiry: 168 hours (7 days)

**Database Schema (PostgreSQL):**
- **User** table with fields:
  - `id` (UUID, primary key)
  - `email` (String, unique, not null)
  - `password_hash` (String?, nullable)
  - `full_name` (String, not null)
  - `avatar_url` (String?)
  - `role` (user_role enum: user, admin, super_admin)
  - `status` (user_status enum: pending, active, suspended)
  - `auth_provider` (auth_provider enum: email, google, facebook)
  - `google_id` (String?, unique)
  - `facebook_id` (String?, unique)
  - `is_email_verified` (Boolean, default: false)
  - `two_fa_enabled` (Boolean, default: false)
  - `two_fa_secret` (String?)
  - `preferred_language` (String, default: "en")
  - `last_login_at` (DateTime?)
  - `suspended_reason` (String?)
  - `whatsapp_number` (String?)
  - `suspended_at` (DateTime?)
  - `deleted_at` (DateTime?)
  - `admin_note` (String?)
  - `created_at` (DateTime)
  - `updated_at` (DateTime)

- **RefreshToken** table:
  - `id` (UUID, primary key)
  - `user_id` (UUID, foreign key)
  - `token_hash` (String, SHA-256 hash)
  - `device_info` (String?)
  - `ip_address` (String?)
  - `expires_at` (DateTime)
  - `revoked` (Boolean, default: false)
  - `created_at` (DateTime)

- **OTPCode** table:
  - `id` (UUID, primary key)
  - `user_id` (UUID, foreign key)
  - `code_hash` (String, bcrypt hash)
  - `purpose` (otp_purpose enum: email_verify, password_reset, two_fa)
  - `expires_at` (DateTime)
  - `used` (Boolean, default: false)
  - `created_at` (DateTime)

**User Roles (Gateway):**
- user
- admin
- super_admin

**Authentication Flow:**
1. User registers via `POST /api/auth/register`
2. Email validation (server-side)
3. Password validation (min 8 chars, max 128 chars)
4. Password hashed with bcrypt (cost 12)
5. User stored in PostgreSQL database
6. OTP code generated for email verification
7. OTP sent via Resend API
8. User must verify email before login
9. JWT access token + refresh token pair issued
10. Refresh token hash stored in PostgreSQL
11. Access token stored in client (Bearer token)
12. Refresh token rotation on each refresh

**Security Features:**
- Email verification required (OTP-based)
- 2FA support (TOTP)
- Password reset via OTP
- Refresh token rotation
- Token revocation (logout blocks JWT in Redis)
- Rate limiting (Redis-based)
- Account suspension support
- OAuth providers (Google, Facebook)

**Protected Routes:**
- All API endpoints require `Authorization: Bearer <token>` header
- JWT validation middleware
- Role-based access control (RBAC)
- JWT blocklist in Redis for logout

---

## Key Differences

### Database
| Aspect | Frontend | Gateway |
|--------|----------|---------|
| Database | SQLite | PostgreSQL |
| User ID | CUID (String) | UUID |
| Password Field | `password` (String) | `password_hash` (String?) |
| Name Field | `name` (String?) | `full_name` (String) |
| Email Verification | `emailVerified` (DateTime?) | `is_email_verified` (Boolean) |
| Status | `status` (String) | `status` (user_status enum) |
| Role | `role` (String) | `role` (user_role enum) |
| OAuth Support | Limited (NextAuth OAuth) | Google, Facebook, Email |
| 2FA Support | No | Yes (TOTP) |
| Email Verification | Optional | Required (OTP) |

### User Roles
| Frontend | Gateway | Mapping |
|---------|---------|---------|
| BUYER | user | Direct mapping |
| SELLER | user | SELLER role not in Gateway |
| ADMIN | admin | Direct mapping |
| - | super_admin | No equivalent in Frontend |

### Session Management
| Aspect | Frontend | Gateway |
|--------|----------|---------|
| Token Type | JWT (NextAuth) | JWT (Custom) |
| Token Storage | HTTP-only cookies | Bearer header (client storage) |
| Refresh Mechanism | NextAuth built-in | Custom refresh token rotation |
| Token Revocation | NextAuth session invalidation | Redis blocklist + DB revocation |
| Access Token Expiry | Configurable (NextAuth) | 15 minutes |
| Refresh Token Expiry | Configurable (NextAuth) | 168 hours (7 days) |

### Security Features
| Feature | Frontend | Gateway |
|---------|----------|---------|
| Password Hashing | bcrypt | bcrypt (cost 12) |
| Email Verification | Optional | Required (OTP) |
| 2FA | No | Yes (TOTP) |
| Rate Limiting | No | Yes (Redis) |
| Account Suspension | No | Yes |
| OAuth Providers | NextAuth OAuth | Google, Facebook, Email |
| Token Revocation | Session invalidation | Redis blocklist + DB revocation |

---

## Root Cause of Split Authentication

### Historical Context
The split authentication system appears to have developed because:

1. **Frontend-First Development:** The E-Pic frontend was built as a Next.js application with NextAuth for user authentication, targeting a simpler e-commerce model with local SQLite database.

2. **Gateway-First Backend:** The Xeni Gateway was built as a comprehensive commerce backend with PostgreSQL, designed for enterprise-grade features like multi-tenant commerce, subscription management, and AI agent integration.

3. **No Integration Planning:** The two systems were developed independently without a unified authentication strategy.

4. **Different Use Cases:**
   - Frontend: Buyer-facing marketplace with simple user accounts
   - Gateway: Commerce backend with seller accounts, subscriptions, and AI features

### Current Problems
1. **User Database Duplication:** Two separate user databases with different schemas
2. **No User Synchronization:** Users registered in frontend cannot access Gateway API
3. **Role Mismatch:** Frontend has SELLER role, Gateway does not
4. **Different Authentication Flows:** Frontend uses cookies, Gateway uses Bearer tokens
5. **No Single Sign-On:** Users must authenticate separately for each system
6. **Inconsistent Security:** Different security features and policies

---

## Architecture Options

### Option A: Keep NextAuth and Integrate Gateway JWT

**Description:**
- Keep NextAuth for frontend authentication
- Use Gateway JWT for API calls
- Implement token exchange mechanism
- Frontend obtains Gateway JWT after NextAuth login

**Implementation:**
1. User logs in via NextAuth (credentials)
2. NextAuth validates against Gateway user database
3. NextAuth issues session token (JWT)
4. Frontend exchanges NextAuth session for Gateway JWT
5. Gateway JWT stored securely for API calls
6. Refresh token flow handled by frontend

**Pros:**
- Leverages existing NextAuth investment
- Frontend session management remains unchanged
- Progressive migration path
- Frontend can work independently if Gateway is down

**Cons:**
- Complex token exchange logic
- Two JWT tokens to manage
- Still maintaining two user databases
- Token synchronization complexity
- Increased attack surface (two authentication systems)
- Higher development complexity

**Security Considerations:**
- Token exchange endpoint must be secure
- Gateway JWT storage in frontend must be secure
- Risk of token leakage if not properly handled
- CSRF protection needed for token exchange

**Development Complexity:** HIGH
**Security Risk:** MEDIUM
**Scalability:** MEDIUM

---

### Option B: Remove NextAuth and Use Gateway Authentication Directly

**Description:**
- Remove NextAuth entirely
- Frontend calls Gateway authentication endpoints directly
- Gateway JWT stored in HTTP-only cookies
- Frontend acts as pure UI client

**Implementation:**
1. Remove NextAuth dependencies
2. Frontend calls `POST /api/auth/register` on Gateway
3. Frontend calls `POST /api/auth/login` on Gateway
4. Gateway issues JWT access + refresh tokens
5. Frontend stores tokens in HTTP-only cookies
6. Frontend includes Bearer token in API calls
7. Refresh token flow handled by frontend

**Pros:**
- Single source of truth for authentication
- Single user database (PostgreSQL)
- Consistent security model
- Simplified architecture
- No token exchange complexity
- Lower attack surface
- Easier to maintain and debug

**Cons:**
- Requires significant frontend refactoring
- Loses NextAuth OAuth providers (must use Gateway OAuth)
- Frontend depends entirely on Gateway availability
- Migration effort for existing frontend users
- Session management must be reimplemented

**Security Considerations:**
- Token storage in HTTP-only cookies (secure)
- No token exchange needed
- Consistent security model across systems
- Risk of Gateway availability affecting authentication

**Development Complexity:** MEDIUM
**Security Risk:** LOW
**Scalability:** HIGH

---

### Option C: Use NextAuth as Frontend Session Wrapper Around Gateway Authentication

**Description:**
- NextAuth acts as session manager
- Gateway handles actual authentication
- NextAuth credentials provider calls Gateway API
- Gateway JWT returned to NextAuth
- NextAuth manages session with Gateway JWT

**Implementation:**
1. User logs in via NextAuth credentials provider
2. NextAuth calls Gateway `POST /api/auth/login`
3. Gateway validates credentials and issues JWT
4. NextAuth stores Gateway JWT in session
5. Frontend uses NextAuth session for authentication
6. API calls include Gateway JWT from session
7. Refresh token flow handled by NextAuth callback

**Pros:**
- Leverages NextAuth session management
- Gateway remains source of truth for authentication
- Single user database (PostgreSQL)
- Frontend users preserved
- Progressive migration path
- Can still use NextAuth OAuth (with Gateway backend)

**Cons:**
- NextAuth becomes a wrapper (overhead)
- Still depends on NextAuth library
- Token refresh logic must be integrated
- NextAuth callbacks must be carefully implemented
- Complexity in NextAuth configuration

**Security Considerations:**
- Gateway JWT stored in NextAuth session
- NextAuth HTTP-only cookies (secure)
- Token refresh handled by NextAuth
- Risk of token synchronization issues

**Development Complexity:** MEDIUM
**Security Risk:** LOW
**Scalability:** HIGH

---

## Architecture Comparison

| Criteria | Option A | Option B | Option C |
|----------|----------|----------|----------|
| **Security** | MEDIUM | HIGH | HIGH |
| **Development Complexity** | HIGH | MEDIUM | MEDIUM |
| **Existing Code Changes** | LOW | HIGH | MEDIUM |
| **Production Scalability** | MEDIUM | HIGH | HIGH |
| **Cookie Security** | HIGH | HIGH | HIGH |
| **Token Refresh** | COMPLEX | SIMPLE | SIMPLE |
| **Seller Authorization** | COMPLEX | SIMPLE | SIMPLE |
| **API Authorization** | COMPLEX | SIMPLE | SIMPLE |
| **Migration Effort** | LOW | HIGH | MEDIUM |
| **Single Source of Truth** | NO | YES | YES |
| **OAuth Support** | MAINTAINED | CHANGED | MAINTAINED |
| **Frontend Independence** | YES | NO | PARTIAL |

---

## Recommended Architecture

### **RECOMMENDATION: Option C**

**Rationale:**

1. **Best Balance of Trade-offs:**
   - Maintains NextAuth session management benefits
   - Gateway becomes single source of truth for authentication
   - Progressive migration path without major disruption
   - Security benefits of Gateway authentication

2. **Security Benefits:**
   - Gateway JWT stored in NextAuth HTTP-only cookies
   - Single user database (PostgreSQL)
   - Consistent security model
   - No token exchange complexity

3. **Development Benefits:**
   - Medium complexity (manageable)
   - Frontend refactoring required but not complete rewrite
   - Can leverage existing NextAuth infrastructure
   - Clear migration path

4. **Production Benefits:**
   - High scalability
   - Single source of truth for user data
   - Simplified debugging and maintenance
   - Consistent authorization model

5. **Migration Benefits:**
   - Can migrate existing frontend users to Gateway
   - Can preserve frontend authentication flow
   - Can gradually deprecate frontend SQLite database
   - Can test integration incrementally

### Implementation Plan

**Phase 1: Gateway Integration Setup**
1. Update NextAuth credentials provider to call Gateway API
2. Implement token storage in NextAuth session
3. Add Gateway JWT to API call headers
4. Test basic authentication flow

**Phase 2: User Migration**
1. Migrate existing frontend users to Gateway database
2. Update frontend registration to use Gateway API
3. Deprecate frontend SQLite user database
4. Test user migration and authentication

**Phase 3: Role Mapping**
1. Add SELLER role to Gateway user_role enum
2. Implement role mapping in NextAuth callbacks
3. Update frontend role checks
4. Test role-based authorization

**Phase 4: Feature Parity**
1. Implement Gateway features in frontend (2FA, email verification)
2. Update UI to support Gateway authentication features
3. Test complete authentication flow
4. Remove legacy NextAuth features

**Phase 5: Cleanup**
1. Remove frontend SQLite user database
2. Remove NextAuth OAuth providers (use Gateway OAuth)
3. Simplify NextAuth configuration
4. Final testing and validation

---

## Risk Assessment

### Low Risk
- Token storage in NextAuth session (well-established pattern)
- Gateway API integration (standard HTTP calls)
- User migration (one-time data migration)

### Medium Risk
- NextAuth callback complexity (requires careful implementation)
- Token refresh synchronization (must handle edge cases)
- Role mapping and authorization (must ensure consistency)

### High Risk
- Gateway availability dependency (frontend becomes dependent)
- OAuth provider changes (must use Gateway OAuth instead of NextAuth OAuth)
- Migration of existing users (data loss risk if not handled carefully)

### Mitigation Strategies
1. **Gateway Availability:** Implement fallback caching for authentication state
2. **OAuth Changes:** Support both NextAuth OAuth and Gateway OAuth during transition
3. **User Migration:** Implement careful backup and rollback procedures
4. **Token Refresh:** Comprehensive testing of refresh edge cases
5. **Role Mapping:** Implement role validation and migration scripts

---

## Conclusion

**Option C** provides the best balance of security, development complexity, and production scalability. It maintains the benefits of NextAuth while establishing Gateway as the single source of truth for authentication.

The recommended approach allows for a progressive migration path, reducing risk while ensuring the final architecture is production-ready and maintainable.

**Next Step:** Implement Option C authentication integration following the phased approach outlined above.
