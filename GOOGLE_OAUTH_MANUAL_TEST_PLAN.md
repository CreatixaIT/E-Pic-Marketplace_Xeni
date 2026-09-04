# Google OAuth Manual Test Plan

**Date:** 2026-09-XX
**Milestone:** Phase 3.2 - Secure Xeni Google OAuth Handoff Integration

---

## Overview

This test plan validates the secure Google OAuth handoff integration between Xeni Gateway and E-Pic Marketplace. The flow ensures that access and refresh tokens are never exposed to the browser and are exchanged server-side via a one-time handoff code.

## Architecture

```
E-Pic Login Page
  → Click "Continue with Google"
  → Redirect to Xeni: /api/auth/google/login
  → Google OAuth consent
  → Xeni callback generates one-time handoff code
  → Xeni redirects to E-Pic: FRONTEND_URL#/auth/callback?code=XYZ
  → E-Pic /auth/callback page extracts code from hash fragment
  → E-Pic POST /api/auth/exchange-handoff with code
  → Xeni validates code, returns tokens (access_token, refresh_token)
  → E-Pic stores tokens in HttpOnly cookies
  → E-Pic establishes NextAuth session via credentials provider
  → Redirect to /account with clean URL
```

## Security Requirements

1. **No tokens in URLs:** Access and refresh tokens must never appear in URL query parameters or fragments
2. **No tokens in client storage:** Tokens must not be stored in localStorage or sessionStorage
3. **HttpOnly cookies only:** Tokens must be stored in HttpOnly cookies only
4. **One-time use:** Handoff code must be consumed and invalidated after first use
5. **Expiration:** Handoff code must expire after 5 minutes
6. **URL cleanup:** Final URL must not contain the handoff code

## Pre-Test Setup

### Environment Variables

Ensure the following are set in E-Pic `.env`:

```bash
XENI_AUTH_API_BASE_URL=http://localhost:8080/api/auth
XENI_API_BASE_URL=http://localhost:8080/api/public/v1
NEXT_PUBLIC_XENI_AUTH_API_BASE_URL=http://localhost:8080/api/auth
AUTH_SECRET=<generated-secret>
```

Ensure Xeni Gateway has:

```bash
FRONTEND_URL=http://localhost:3000
GOOGLE_OAUTH_CLIENT_ID=<your-client-id>
GOOGLE_OAUTH_CLIENT_SECRET=<your-client-secret>
GOOGLE_OAUTH_REDIRECT_URI=http://localhost:8080/api/auth/google/callback
```

### Services Running

1. Xeni Gateway running on `http://localhost:8080`
2. E-Pic frontend running on `http://localhost:3000`
3. Redis running for Xeni handoff code storage

## Test Cases

### Test 1: Successful Google OAuth Flow

**Steps:**
1. Navigate to `http://localhost:3000/login`
2. Click "Continue with Google" button
3. Complete Google OAuth consent in popup/redirect
4. Wait for redirect back to E-Pic

**Expected Results:**
- User is redirected to `/auth/callback` with hash fragment containing `code=`
- Loading spinner shows "Completing authentication..."
- After 1-3 seconds, user is redirected to `/account`
- Final URL is `http://localhost:3000/account` (no code in URL)
- User is logged in (session active)
- `gateway_access_token` cookie is set and HttpOnly
- `gateway_refresh_token` cookie is set and HttpOnly

**Verification:**
```javascript
// In browser console:
document.cookie // Should NOT show gateway tokens (HttpOnly)
localStorage // Should be empty
sessionStorage // Should be empty
window.location.href // Should be http://localhost:3000/account
```

### Test 2: Handoff Code Extraction from Hash Fragment

**Steps:**
1. Start Google OAuth flow from login page
2. When redirected to `/auth/callback#code=...`, pause before page processes it

**Expected Results:**
- URL shows hash fragment: `#/auth/callback?code=...`
- Code is not in query parameters (no `?code=` before `#`)
- Page loads and extracts code from hash

**Verification:**
```javascript
// In browser console before processing:
window.location.hash // Should contain code
window.location.search // Should be empty or not contain code
```

### Test 3: No Tokens in Final URL

**Steps:**
1. Complete full Google OAuth flow
2. After redirect to `/account`, inspect URL

**Expected Results:**
- URL is `http://localhost:3000/account`
- No `access_token` in URL
- No `refresh_token` in URL
- No `code` in URL
- No hash fragment containing tokens

### Test 4: Tokens Not in localStorage

**Steps:**
1. Complete Google OAuth flow
2. Inspect browser storage

**Expected Results:**
```javascript
localStorage // Empty or no gateway tokens
sessionStorage // Empty or no gateway tokens
```

### Test 5: Tokens in HttpOnly Cookies

**Steps:**
1. Complete Google OAuth flow
2. Open browser DevTools → Application → Cookies

**Expected Results:**
- `gateway_access_token` cookie exists
- `gateway_refresh_token` cookie exists
- Both have `HttpOnly: true`
- Both have `Secure: true` in production
- Both have `SameSite: Lax`

### Test 6: Expired Handoff Code

**Steps:**
1. Initiate Google OAuth flow
2. Wait 6 minutes before completing callback
3. Or manually use a handoff code from Redis that has expired

**Expected Results:**
- Error message displayed: "Failed to exchange authorization code" or similar
- User redirected to login page with error
- No tokens stored in cookies
- User not logged in

### Test 7: Invalid Handoff Code

**Steps:**
1. Manually navigate to `http://localhost:3000/auth/callback#code=invalid_test_code`
2. Wait for processing

**Expected Results:**
- Error message displayed
- No tokens stored
- User not logged in
- Redirect to login page

### Test 8: Reused Handoff Code

**Steps:**
1. Complete Google OAuth flow successfully
2. Copy the handoff code from network request or Redis
3. Immediately navigate to `/auth/callback#code=<copied_code>` again

**Expected Results:**
- Second attempt fails with error
- Handoff code is one-time use only
- Xeni invalidates code after first exchange

### Test 9: Xeni Unavailable

**Steps:**
1. Stop Xeni Gateway
2. Attempt Google OAuth flow from E-Pic

**Expected Results:**
- Error message displayed
- User redirected to login page
- No tokens stored
- Graceful error handling (no console errors in browser)

### Test 10: Network Error During Exchange

**Steps:**
1. Use browser DevTools to throttle network or block `/api/auth/exchange-handoff`
2. Attempt Google OAuth flow

**Expected Results:**
- Error message displayed after timeout
- User redirected to login page
- No partial session state created

### Test 11: Session Establishment

**Steps:**
1. Complete Google OAuth flow
2. Navigate to a protected page (e.g., `/account`)

**Expected Results:**
- Page loads successfully
- User data is displayed
- No redirect to login
- NextAuth session is active

**Verification:**
```javascript
// In browser console on a protected page:
useSession() // Should return authenticated user data
```

### Test 12: Logout After Google OAuth

**Steps:**
1. Complete Google OAuth flow
2. Click logout button
3. Verify session cleared

**Expected Results:**
- `gateway_access_token` cookie deleted
- `gateway_refresh_token` cookie deleted
- NextAuth session cleared
- Redirected to login page
- Can still log in with Google again

### Test 13: Concurrent Sessions

**Steps:**
1. Log in with Google in one browser tab
2. Open new tab and log in with Google again (same Google account)

**Expected Results:**
- Both tabs can be authenticated
- Each has valid session
- Tokens stored in cookies are accessible across tabs (expected for HttpOnly cookies)

### Test 14: Mixed Authentication Methods

**Steps:**
1. Log in with email/password
2. Logout
3. Log in with Google
4. Logout
5. Log in with email/password again

**Expected Results:**
- Both methods work correctly
- Logout clears tokens properly for both
- No token conflicts

## Security Validation

### Token Exposure Check

After completing Google OAuth flow, verify:

```javascript
// In browser console:
// Check URL
window.location.href // Should not contain tokens

// Check storage
localStorage.getItem('gateway_access_token') // Should be null
localStorage.getItem('gateway_refresh_token') // Should be null
sessionStorage.getItem('gateway_access_token') // Should be null
sessionStorage.getItem('gateway_refresh_token') // Should be null

// Check document.cookie (should not show HttpOnly cookies)
document.cookie // Should NOT show gateway_access_token or gateway_refresh_token

// Check cookies in DevTools Application tab
// Both gateway tokens should be present with HttpOnly: true
```

### Network Request Inspection

Using browser DevTools Network tab:

1. **Initial redirect:** Request to Xeni `/api/auth/google/login`
2. **Google OAuth:** Request to Google OAuth endpoints
3. **Callback:** Redirect to E-Pic `/auth/callback#code=...`
4. **Exchange:** POST to `/api/auth/exchange-handoff` with `{ code: "..." }`
5. **Response:** `{ data: { access_token: "...", refresh_token: "...", user_id: "...", email: "..." } }`
6. **Session:** POST to `/api/auth/callback/credentials` for NextAuth
7. **Final redirect:** Navigate to `/account`

**Critical checks:**
- Tokens only appear in `/api/auth/exchange-handoff` response body
- Tokens never appear in URLs
- Tokens never appear in localStorage/sessionStorage
- Handoff code appears only in hash fragment and exchange request body

## Regression Tests

Ensure existing functionality still works:

1. Email/password login still works
2. Registration still works
3. Logout still works
4. Protected routes still work
5. Role-based access still works
6. Refresh token flow still works (for password login)

## Known Limitations

1. **Client-side gateway-api.ts:** The `GatewayApiClient` class now only works server-side. Client components cannot directly call it. This is intentional for security.
2. **Test coverage:** No automated tests were added in this phase (project lacks test infrastructure). Manual testing is required.
3. **Xeni dependency:** E-Pic requires Xeni Gateway to be running for Google OAuth to work.

## Sign-Off

- [ ] All successful flow tests pass
- [ ] All error handling tests pass
- [ ] Security validation passes (no token exposure)
- [ ] Network requests are as expected
- [ ] Regression tests pass
- [ ] Production build succeeds
- [ ] No lint errors in auth-related files
- [ ] No type errors in auth-related files

## Notes

- The handoff code in Xeni expires after 5 minutes
- The handoff code is one-time use (deleted after exchange)
- Tokens in E-Pic cookies have the same expiration as before (15 min access, 7 days refresh)
- The Google OAuth flow is entirely owned by Xeni; E-Pic only consumes the handoff
