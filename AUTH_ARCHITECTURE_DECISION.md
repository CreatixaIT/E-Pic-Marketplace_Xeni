# AUTHENTICATION ARCHITECTURE DECISION

**Date:** 2026-09-01
**Milestone:** 6.3.2B Part 10A
**Decision:** OPTION C - NextAuth as Frontend Session Wrapper Around Gateway Authentication

---

## Decision Summary

**Selected Architecture:** Option C

**Rationale:** Option C provides the best balance of security, development complexity, and production scalability while maintaining the benefits of NextAuth session management and establishing Gateway as the single source of truth for authentication.

## Key Benefits

1. **Security:** Gateway JWT stored in NextAuth HTTP-only cookies, single user database (PostgreSQL), consistent security model
2. **Development:** Medium complexity, manageable refactoring, can leverage existing NextAuth infrastructure
3. **Production:** High scalability, single source of truth, simplified debugging and maintenance
4. **Migration:** Progressive migration path, can preserve frontend authentication flow, can test incrementally

## Implementation Phases

**Phase 1: Gateway Integration Setup**
- Update NextAuth credentials provider to call Gateway API
- Implement token storage in NextAuth session
- Add Gateway JWT to API call headers
- Test basic authentication flow

**Phase 2: User Migration**
- Migrate existing frontend users to Gateway database
- Update frontend registration to use Gateway API
- Deprecate frontend SQLite user database
- Test user migration and authentication

**Phase 3: Role Mapping**
- Add SELLER role to Gateway user_role enum
- Implement role mapping in NextAuth callbacks
- Update frontend role checks
- Test role-based authorization

**Phase 4: Feature Parity**
- Implement Gateway features in frontend (2FA, email verification)
- Update UI to support Gateway authentication features
- Test complete authentication flow
- Remove legacy NextAuth features

**Phase 5: Cleanup**
- Remove frontend SQLite user database
- Remove NextAuth OAuth providers (use Gateway OAuth)
- Simplify NextAuth configuration
- Final testing and validation

## Acceptance Criteria

1. ✅ User registers through Gateway user system
2. ✅ User logs in through Gateway authentication system
3. ✅ Frontend receives authenticated user state securely
4. ✅ Protected frontend pages work
5. ✅ Gateway protected API requests include valid authentication
6. ✅ Refresh token flow works
7. ✅ Logout invalidates/revokes authentication correctly
8. ✅ No duplicate user database remains active
9. ✅ No JWT secrets exposed to browser code
10. ✅ No long-lived secrets stored insecurely in localStorage

## Next Step

Proceed with Step 3: Implement auth integration using Option C architecture.
