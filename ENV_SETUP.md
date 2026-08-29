# Environment Variables Setup

## Required Environment Variables

Create a `.env` file in the project root with the following variables:

```bash
# Database
DATABASE_URL="file:./dev.db"

# Authentication
AUTH_SECRET=your_secure_random_secret_here
```

## Generating AUTH_SECRET

A development auth secret has been provided above. For production, generate a new secure auth secret using OpenSSL:

```bash
openssl rand -base64 32
```

Or use Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Important Notes

- Never commit the `.env` file to version control
- Never share your `AUTH_SECRET` publicly
- Use different secrets for development and production
- The `AUTH_SECRET` is used to encrypt and sign JWT tokens
- The current secret is for development only
