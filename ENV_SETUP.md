# Environment Configuration for E-Pic Marketplace

## Required Environment Variables

### Database
```
DATABASE_URL="file:./dev.db"
```
Used for local development with SQLite.

### Authentication
```
AUTH_SECRET="your-auth-secret-here"
```
Generate a secure secret for Auth.js session management. You can generate one with:
```bash
openssl rand -base64 32
```

### Commerce Provider
```
NEXT_PUBLIC_COMMERCE_PROVIDER="mock"
```
Options:
- `"mock"` - Uses mock data for development (default)
- `"xeni"` - Connects to Xeni Public Commerce API

### Xeni API Configuration
```
XENI_API_BASE_URL="http://localhost:8080/api/public/v1"
```
Required when using `xeni` provider. Set to your Xeni Public API base URL.

## Setup Instructions

1. Create a `.env` file in the project root with the required variables

2. Edit `.env` and fill in the required values:
   - Set `AUTH_SECRET` to a secure random string
   - Set `NEXT_PUBLIC_COMMERCE_PROVIDER` to `"mock"` or `"xeni"`
   - If using `"xeni"`, set `XENI_API_BASE_URL` to your Xeni API endpoint

3. For production deployment, set these environment variables in your hosting platform's configuration.

## Example .env File

```bash
# Database
DATABASE_URL="file:./dev.db"

# Authentication
AUTH_SECRET="your-generated-auth-secret-here"

# Commerce Provider Selection
NEXT_PUBLIC_COMMERCE_PROVIDER="mock"

# Xeni API Configuration (required when using xeni provider)
XENI_API_BASE_URL="http://localhost:8080/api/public/v1"
```

## Switching Between Providers

To switch from mock to Xeni provider:

1. Update `.env`:
```bash
NEXT_PUBLIC_COMMERCE_PROVIDER="xeni"
XENI_API_BASE_URL="http://localhost:8080/api/public/v1"
```

2. Restart your development server

For production Xeni API:
```bash
NEXT_PUBLIC_COMMERCE_PROVIDER="xeni"
XENI_API_BASE_URL="https://api.xeni.com/api/public/v1"
```

## Development Notes

- The `.env` file is gitignored for security
- Never commit real secrets or production API URLs
- Use different values for development and production
- The mock provider is recommended for UI development without backend dependency
- The Xeni provider requires a running Xeni backend with the Public API enabled
