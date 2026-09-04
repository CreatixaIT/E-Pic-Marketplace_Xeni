# E-Pic Production Environment Configuration

## Required Environment Variables

### Database
```bash
DATABASE_URL="file:./dev.db"
```
Note: Currently using SQLite for local development. For production, consider PostgreSQL.

### Authentication
```bash
AUTH_SECRET="<production-auth-secret>"
```
Generate a secure secret for production:
```bash
openssl rand -base64 32
```

### Commerce Provider
```bash
NEXT_PUBLIC_COMMERCE_PROVIDER="xeni"
```

### Xeni Gateway API (Production)
```bash
XENI_API_BASE_URL="https://api.e-pic.co/api/public/v1"
XENI_AUTH_API_BASE_URL="https://api.e-pic.co/api/auth"
NEXT_PUBLIC_XENI_AUTH_API_BASE_URL="https://api.e-pic.co/api/auth"
```

## Production Deployment Steps

### 1. Set Environment Variables
Configure the following environment variables in your deployment platform (Vercel, etc.):

- `AUTH_SECRET` - Generate a secure secret
- `XENI_API_BASE_URL` - Set to https://api.e-pic.co/api/public/v1
- `XENI_AUTH_API_BASE_URL` - Set to https://api.e-pic.co/api/auth
- `NEXT_PUBLIC_XENI_AUTH_API_BASE_URL` - Set to https://api.e-pic.co/api/auth
- `NEXT_PUBLIC_COMMERCE_PROVIDER` - Set to "xeni"

### 2. Remove Localhost References
The codebase has been updated to use production API URLs. Ensure no localhost references remain in environment configuration.

### 3. Deploy
Deploy to production using your existing deployment method (likely Vercel).

## Important Notes

- Never commit actual secrets to the repository
- Use different AUTH_SECRET for production vs development
- The .env file is gitignored for security
- Production API URL must be https://api.e-pic.co
