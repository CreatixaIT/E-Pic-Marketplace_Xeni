# Database Setup Guide

## Environment Variables

Create a `.env` file in the project root with the following variable:

```bash
# Database Configuration
# For local development with SQLite (no database server required):
DATABASE_URL="file:./dev.db"

# For PostgreSQL (recommended for production):
# DATABASE_URL="postgresql://user:password@localhost:5432/epic_marketplace?schema=public"

# For Vercel Postgres:
# DATABASE_URL="postgres://user:password@host:port/database?sslmode=require"
```

**Current Configuration**: SQLite (`file:./dev.db`) for local development.

## Database Options

### Option 1: SQLite (Current - Development Only)
- No database server required
- File-based storage (`dev.db`)
- Good for local development
- Not recommended for production
- Currently in use for Part 2 implementation

### Option 2: PostgreSQL (Recommended for Production)
- Production-ready database
- Better performance and scalability
- Supports concurrent connections
- Required for production deployment
- To switch: Change `provider` in `prisma/schema.prisma` from `sqlite` to `postgresql`

### Option 3: Vercel Postgres (Deployment)
- Managed PostgreSQL database
- Automatic scaling
- Built-in backups
- Easy integration with Vercel deployment

## Setup Commands

### Initial Setup (Already Completed)
```bash
# Install dependencies
npm install prisma@^5 @prisma/client@^5 --save-dev
npm install tsx --save-dev

# Initialize Prisma
npx prisma init

# Configure schema (prisma/schema.prisma)

# Generate Prisma Client
npx prisma generate

# Create database migration
npx prisma migrate dev --name init

# Seed the database
npm run db:seed
```

### Development Workflow
```bash
# After schema changes:
npx prisma migrate dev --name describe_your_changes

# View database in Prisma Studio
npx prisma studio

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Format schema
npx prisma format

# Re-seed database after reset
npm run db:seed
```

### Production Deployment
```bash
# Generate Prisma Client for production
npx prisma generate

# Apply migrations to production database
npx prisma migrate deploy

# Seed production database (if needed)
npm run db:seed
```

## Database Schema

The database includes the following core entities:

### User & Authentication
- `User` - User accounts with roles (buyer, seller, admin)
- `Profile` - Extended user information
- `Address` - User delivery addresses

### Seller & Store Management
- `Seller` - Seller registration and verification
- `Store` - Store profiles and configurations

### Product Catalogue
- `Category` - Marketplace taxonomy
- `Product` - Product details and pricing
- `ProductImage` - Product images
- `Inventory` - Stock management

### Cart & Orders
- `Cart` - Shopping carts
- `CartItem` - Cart line items
- `Order` - Customer orders
- `OrderItem` - Order line items

### Reviews & Wishlist
- `Review` - Product reviews
- `Wishlist` - User wishlists
- `WishlistItem` - Wishlist items

### Payments (Future)
- `Payment` - Payment transactions

### Platform Settings (Future)
- `PlatformSettings` - Platform configuration

## Implementation Details

### Current Database: SQLite
- **File**: `dev.db` in project root
- **Provider**: SQLite (easier for local development)
- **Schema**: Full marketplace schema implemented
- **Migration**: `20260829222233_init` applied

### Core Entities Implemented
- ✅ User, Profile, Address
- ✅ Seller, Store
- ✅ Category, Product, ProductImage, Inventory
- ✅ Cart, CartItem
- ✅ Order, OrderItem
- ✅ Review, Wishlist, WishlistItem
- ✅ Payment (future-ready)
- ✅ PlatformSettings (future-ready)

### Data Integrity Features
- All monetary values use integer minor units (1000 = 10.00)
- Unique slugs for products and stores
- Proper foreign key relationships with cascade deletes
- Indexed fields for performance
- Timestamps for audit trails (createdAt, updatedAt)
- Status fields for entities (active, suspended, pending)

## Seed Data

The seed script (`prisma/seed.ts`) includes:
- 6 stores from the mock marketplace (Aurora Atelier, Northbound Supply, Mono Goods, Verdant Lab, Slow Press, Hallow Audio)
- 18 products from the mock marketplace
- 5 categories (Fashion, Technology, Home, Beauty, Lifestyle)
- 7 sample users (1 buyer, 6 sellers)
- Inventory records for all products

### Running Seed
```bash
npm run db:seed
```

## Migration to PostgreSQL

When ready to switch to PostgreSQL for production:

1. Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

2. Update `.env`:
```bash
DATABASE_URL="postgresql://user:password@localhost:5432/epic_marketplace?schema=public"
```

3. Create new migration:
```bash
npx prisma migrate dev --name switch_to_postgresql
```

4. Seed the new database:
```bash
npm run db:seed
```

## Security Notes

- Never commit `.env` file to version control (already in .gitignore)
- Use strong passwords for production databases
- Enable SSL for database connections in production
- Regular database backups
- Monitor database access logs
- Use environment variables for sensitive data

## Troubleshooting

### Prisma Client Not Found
```bash
npx prisma generate
```

### Migration Issues
```bash
# Reset database (warning: deletes data)
npx prisma migrate reset

# Then re-seed
npm run db:seed
```

### Seed Data Issues
```bash
# Clear and re-seed
npm run db:seed
```

## Files Modified/Created

### Created
- `prisma/schema.prisma` - Database schema definition
- `prisma/seed.ts` - Seed data script
- `prisma/migrations/20260829222233_init/migration.sql` - Initial migration
- `dev.db` - SQLite database file
- `DATABASE_SETUP.md` - This documentation

### Modified
- `package.json` - Added Prisma dependencies and seed script
- `.env` - Database configuration (local)

## Next Steps

The database foundation is now ready for:
- Part 3: Authentication System (Auth.js implementation)
- Part 4: Commerce Service Layer (real data access)
- Part 5: Cart & Order System (database-backed operations)
