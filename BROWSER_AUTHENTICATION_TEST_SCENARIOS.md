# BROWSER AUTHENTICATION TEST SCENARIOS

**Date:** 2026-09-01
**Milestone:** 6.3.2B Part 10A.1
**Frontend URL:** http://localhost:3000
**Gateway URL:** http://localhost:8080

---

## Test Account Details

**Test User:** browsertest@example.com
**Password:** TestPassword123!
**OTP Code:** 680000 (logged in Gateway logs)
**Status:** Email verified, ready for login

---

## TEST 1: Register a New Account

### Steps
1. Navigate to http://localhost:3000/register
2. Fill in registration form:
   - Email: `newuser@example.com`
   - Password: `NewPassword123!`
   - Full Name: `New Test User`
3. Click "Sign up" button
4. Check Gateway logs for OTP code
5. Verify OTP code (via API or manual)
6. Try to log in

### Expected Results
- ✅ User is created in Gateway PostgreSQL
- ✅ Password is not exposed (should be hashed)
- ✅ Invalid input is rejected (test with invalid email, weak password)
- ✅ Gateway logs show OTP code for verification
- ✅ Registration response contains user_id and email

### Verification Points
- Database: User record exists in users table
- Security: Password is bcrypt hashed
- Validation: Invalid emails should be rejected by Gateway
- OTP: Code is logged in development mode

---

## TEST 2: Log In

### Steps
1. Navigate to http://localhost:3000/login
2. Enter credentials:
   - Email: `browsertest@example.com`
   - Password: `TestPassword123!`
3. Click "Login" button
4. Check browser cookies for authentication tokens
5. Check session state

### Expected Results
- ✅ Authenticated frontend session exists
- ✅ Correct user information is displayed
- ✅ Correct role is available (should be BUYER for test user)
- ✅ Gateway tokens stored in HTTP-only cookies

### Verification Points
- Cookies: `gateway_access_token` and `gateway_refresh_token` cookies exist
- Session: NextAuth session contains user data
- Role: User role is correctly mapped (Gateway `user` → Frontend `BUYER`)
- Security: Tokens are HTTP-only and secure

---

## TEST 3: Refresh the Browser

### Steps
1. While logged in, refresh the browser page
2. Check if session persists
3. Check if user data remains available

### Expected Results
- ✅ Session remains valid when expected
- ✅ User information persists after refresh
- ✅ Gateway tokens remain valid

### Verification Points
- Session: NextAuth session persists
- Tokens: Gateway cookies still exist
- UX: User doesn't need to re-authenticate

---

## TEST 4: Protected Pages Access

### Steps
1. While logged in, navigate to http://localhost:3000/account
2. Check if account page loads
3. Check if user information is displayed

### Expected Results
- ✅ Protected pages load successfully
- ✅ User information is correctly displayed
- ✅ No authentication errors

### Verification Points
- Access: Account page loads without auth errors
- Data: User profile information is correct
- Session: Frontend session is properly checked

---

## TEST 5: Log Out

### Steps
1. Click logout button or navigate to logout endpoint
2. Check if frontend session is cleared
3. Check if Gateway tokens are cleared
4. Try to access protected page

### Expected Results
- ✅ Frontend session is cleared
- ✅ Gateway token is revoked if required by architecture
- ✅ Protected pages are inaccessible after logout

### Verification Points
- Session: NextAuth session cleared
- Tokens: Gateway cookies cleared
- Access: Protected pages redirect to login
- Backend: Gateway token blocked in Redis

---

## TEST 6: Protected API Access After Logout

### Steps
1. After logout, try to access Gateway API directly:
   ```bash
   curl -X GET http://localhost:8080/api/user/me -H "Authorization: Bearer <previously_valid_token>"
   ```
2. Check if request is rejected

### Expected Results
- ✅ Request is rejected with 401 Unauthorized
- ✅ Token revocation works correctly

### Verification Points
- API: Gateway returns 401 error
- Security: Token is properly blocked in Redis
- Session: Revocation works as expected

---

## TEST 7: SELLER Account Authorization

### Steps
1. Create a seller account via Gateway API:
   ```bash
   curl -X POST http://localhost:8080/api/auth/register -H "Content-Type: application/json" -d '{"email":"seller@example.com","password":"TestPassword123!","full_name":"Seller User"}'
   ```
2. Update user role to seller in database
3. Verify email manually
4. Login as seller
5. Check if seller role is correctly detected
6. Try to access seller-protected API endpoints

### Expected Results
- ✅ Seller role is correctly detected
- ✅ Seller can access seller-protected API
- ✅ Seller cannot access another seller's shop

### Verification Points
- Role: Gateway returns `seller` role
- Frontend: Role maps to `SELLER` in frontend
- Authorization: RBAC middleware enforces seller permissions
- Isolation: Cross-shop access is prevented

---

## TEST 8: CUSTOMER Account Authorization

### Steps
1. Use existing test user (browsertest@example.com)
2. Try to access seller-only endpoints
3. Verify access is denied

### Expected Results
- ✅ Customer cannot access seller-only endpoints
- ✅ Customer gets 403 Forbidden error
- ✅ Authorization works correctly

### Verification Points
- API: Gateway returns 403 Forbidden
- Security: RBAC middleware prevents unauthorized access
- Role: Customer role is correctly enforced

---

## TEST 9: Browser Console Check

### Steps
1. Open browser DevTools (F12)
2. Go to Console tab
3. Navigate through authentication flow
4. Check for errors

### Expected Results
- ✅ No authentication errors
- ✅ No token secrets exposed
- ✅ No unexpected CORS errors
- ✅ No console warnings related to authentication

### Verification Points
- Console: No red errors
- Security: No JWT secrets or backend secrets in console
- Network: No CORS issues between frontend and Gateway
- Authentication: No session errors

---

## TEST 10: Browser Network Requests Check

### Steps
1. Open browser DevTools (F12)
2. Go to Network tab
3. Navigate through authentication flow
4. Check network requests

### Expected Results
- ✅ No database credentials in requests
- ✅ No JWT secret in requests
- ✅ No Resend secret in requests
- ✅ No backend secrets in requests
- ✅ Authentication cookies have appropriate security settings

### Verification Points
- Security: Request headers don't contain sensitive secrets
- Cookies: HTTP-only flag is set
- Cookies: Secure flag is set (in production)
- Cookies: SameSite attribute is set correctly
- Tokens: Only tokens in Authorization header

---

## Testing Instructions

Please perform these browser tests and report back:

1. **TEST 1-6:** Core authentication flow (register, login, refresh, logout)
2. **TEST 7-8:** Authorization (seller vs customer)
3. **TEST 9-10:** Security checks (console, network)

For each test, report:
- ✅ PASS if it works as expected
- ❌ FAIL if it doesn't work
- ⚠️ PARTIAL if it partially works
- Describe any errors or unexpected behavior

---

## Current Test Environment

- **Gateway:** ✅ Running on http://localhost:8080
- **Frontend:** ✅ Running on http://localhost:3000
- **PostgreSQL:** ✅ Running on localhost:5432
- **Redis:** ✅ Running on localhost:6379
- **Test User:** browsertest@example.com (verified and ready)
- **OTP Code:** 680000 (for any additional verification needed)

---

## Note

I will continue with the other steps (cookie/token security review, OAuth audit, automated validation) while you perform the browser tests. Please report your results when complete.
