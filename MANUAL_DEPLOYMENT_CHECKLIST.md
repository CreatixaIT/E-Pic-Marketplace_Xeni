# E-Pic + Xeni Production Deployment Checklist

## XENI DEPLOYMENT

### Step 1: SSH to Production VPS
```bash
ssh root@109.199.122.238
```

### Step 2: Navigate to Xeni Directory
```bash
cd /opt/xeni/xeni-main
```

### Step 3: Check Current Status
```bash
git status
git branch
git log --oneline -5
```

### Step 4: Fetch Latest from GitHub
```bash
git fetch origin main
```

### Step 5: Check for Local Changes
```bash
git diff
```
If local changes exist, inspect them before proceeding. Do not blindly reset.

### Step 6: Checkout Latest Main
```bash
git checkout main
git pull origin main
```

### Step 7: Verify CORS Commit
```bash
git log --oneline -1
```
Should show: `28ea13f feat: configure CORS for multiple trusted frontend origins`

### Step 8: Verify Environment
```bash
cat gateway/.env | grep FRONTEND_URLS
```
Should contain: `FRONTEND_URLS=https://e-pic.co,https://www.e-pic.co`

### Step 9: Deploy Gateway Only
```bash
cd gateway
docker compose up -d --no-deps --build gateway
```

If container conflict:
```bash
docker stop xeni-gateway
docker rm xeni-gateway
docker compose up -d --no-deps --build gateway
```

### Step 10: Verify Gateway Running
```bash
docker ps | grep xeni-gateway
docker inspect xeni-gateway | grep FRONTEND_URLS
```

### Step 11: Verify Health
```bash
curl -i http://127.0.0.1:8080/health
curl -i https://api.e-pic.co/health
```
Both should return HTTP 200.

### Step 12: Verify CORS
```bash
curl -i -X OPTIONS https://api.e-pic.co/api/auth/login \
  -H "Origin: https://e-pic.co" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type,Authorization"
```
Expected: `Access-Control-Allow-Origin: https://e-pic.co`

```bash
curl -i -X OPTIONS https://api.e-pic.co/api/auth/login \
  -H "Origin: https://www.e-pic.co" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type,Authorization"
```
Expected: `Access-Control-Allow-Origin: https://www.e-pic.co`

```bash
curl -i -X OPTIONS https://api.e-pic.co/api/auth/login \
  -H "Origin: https://evil.example" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type,Authorization"
```
Expected: NO `Access-Control-Allow-Origin` header

### Step 13: Verify Buyer Commerce Endpoints
```bash
curl -i https://api.e-pic.co/health
curl -i https://api.e-pic.co/api/public/v1/products
curl -i https://api.e-pic.co/api/public/v1/stores
```

## E-PIC DEPLOYMENT

### Step 1: Configure Production Environment Variables

In your deployment platform (Vercel or other), set:

```bash
AUTH_SECRET="<generate-with-openssl-rand-base64-32>"
XENI_API_BASE_URL="https://api.e-pic.co/api/public/v1"
XENI_AUTH_API_BASE_URL="https://api.e-pic.co/api/auth"
NEXT_PUBLIC_XENI_AUTH_API_BASE_URL="https://api.e-pic.co/api/auth"
NEXT_PUBLIC_COMMERCE_PROVIDER="xeni"
```

### Step 2: Generate Production Auth Secret
```bash
openssl rand -base64 32
```
Use the output for AUTH_SECRET.

### Step 3: Deploy E-Pic to Production

If using Vercel:
1. Connect GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy from GitHub main branch
4. Configure custom domains: e-pic.co, www.e-pic.co

If using other deployment method:
1. Build locally: `npm run build`
2. Deploy output to production server
3. Configure environment variables
4. Configure domain DNS

### Step 4: Verify Production E-Pic
```bash
curl -i https://e-pic.co
curl -i https://www.e-pic.co
```
Both should return HTTP 200.

### Step 5: Verify API Configuration
- Open browser DevTools on https://e-pic.co
- Check Network tab for API calls
- Verify calls go to https://api.e-pic.co
- Verify no calls to localhost

## POST-DEPLOYMENT VERIFICATION

### Test Authentication Flow
1. Navigate to https://e-pic.co
2. Click Register
3. Fill registration form
4. Submit
5. Verify account created
6. Login with credentials
7. Verify session persists
8. Check for HttpOnly cookies
9. Logout
10. Verify session cleared

### Test Commerce Flow
1. Browse products
2. View product details
3. Add to cart (guest)
4. Update quantity
5. Remove item
6. Login
7. Verify cart persistence
8. Add more items (authenticated)
9. Proceed to checkout
10. Fill customer details
11. Select COD
12. Place order
13. Verify order created
14. View order history
15. View order details

### Test CORS
1. Test from https://e-pic.co
2. Test from https://www.e-pic.co
3. Verify API calls succeed
4. Verify no CORS errors in console

## SECURITY VERIFICATION

### Check Cookies
- Ensure HttpOnly flag set on auth cookies
- Ensure Secure flag set (HTTPS)
- Ensure SameSite=Lax or appropriate
- No auth tokens in localStorage
- No auth tokens in sessionStorage

### Check API
- No wildcard CORS
- Only explicit origins allowed
- Credentials enabled

### Check Secrets
- No secrets in git history
- No secrets in browser bundles
- No secrets in console logs

## ROLLBACK PLAN

If deployment fails:

### Xeni Rollback
```bash
cd /opt/xeni/xeni-main
git checkout <previous-commit>
docker compose up -d --no-deps --build gateway
```

### E-Pic Rollback
- Rollback to previous deployment in deployment platform
- Restore previous environment variables

## POST-LAUNCH HARDENING TASKS

### Security
1. Remove Firebase service-account.json from repository
2. Remove id_rsa_recovered from repository
3. Close unnecessary Xeni ports (if safe)
4. Implement checkout idempotency
5. Add rate limiting to public APIs

### Features
1. Implement guest cart synchronization on login
2. Complete cart response mapping
3. Migrate UI to new CommerceProvider methods
4. Implement online payment gateways

## CONTACT

If issues arise during deployment:
- Do not modify JebKharch
- Do not restart databases unless required
- Do not delete production data
- Contact with specific error details

## FINAL CHECKLIST

- [ ] Xeni gateway deployed with CORS fix
- [ ] Xeni health endpoint returns 200
- [ ] CORS returns correct headers for e-pic.co
- [ ] CORS returns correct headers for www.e-pic.co
- [ ] CORS rejects evil.example
- [ ] E-Pic deployed with production API URLs
- [ ] E-Pic production health check passes
- [ ] Authentication flow works
- [ ] Guest cart works
- [ ] Authenticated cart works
- [ ] Checkout works
- [ ] COD order creation works
- [ ] Order history works
- [ ] No localhost references in production
- [ ] No secrets exposed
- [ ] JebKharch unchanged
