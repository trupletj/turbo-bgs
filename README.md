# BGS.MN Төсөл

BTEG bgs.mn төсөл turborepo ашиглан үүсгэсэн

## Using this example

Run the following command:

```sh
npm install
```

## What's inside?

Энэ turborepo төсөл нь доорх бүтэцтэй

### Apps and Packages

- `admin`: a [Next.js](https://nextjs.org/) app
- `employee`: another [Next.js](https://nextjs.org/) app. Ажилчдад зориулсан app ажиллуулах
- `@repo/database`:  `admin` болон `employee` applications дундаа ашиглах боломжтой db. Prisma ORM ашигласан
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo
- `@repo/actions`: Төслүүд дундаа ашилглах server action- ууд 

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### DB 
#Датабааз дээрх үйлдлүүд
db generate
```
npm run db:generate 
```
db push
```
npm run db:push
```
 db migrations
```
npm run db:migrate
```
prisma studio
```
npm run db:studio
```

### Supabase Local Development

This project uses Supabase for local development. Follow these steps to set up and work with the local Supabase instance:

#### Prerequisites
Make sure you have Docker installed and running on your system.

#### Starting Supabase Locally
```bash
# Start local Supabase services (PostgreSQL, Auth, Storage, etc.)
npx supabase start
```

#### Accessing Local Services
- **Supabase Studio**: http://localhost:54323
- **Database URL**: postgresql://postgres:postgres@localhost:54322/postgres
- **API URL**: http://localhost:54321
- **Auth URL**: http://localhost:54321/auth/v1

#### Creating and Managing Migrations

When working with local Supabase, create migrations from your local database changes:

```bash
# Create a new migration from local database changes
npx supabase db diff --local > supabase/migrations/[timestamp]_your_migration_name.sql

# Reset local database and apply all migrations
npx supabase db reset

# Apply migrations to local database
npx supabase migration up

# Generate TypeScript types from your database schema
npx supabase gen types typescript --local > types/database.types.ts
```

#### Environment Setup
Create a `supabase.local.env` file (already exists in the project) with local Supabase credentials:
```env
SUPABASE_URL=http://localhost:54321
SUPABASE_ANON_KEY=your_local_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_local_service_role_key
```

#### Working with Prisma and Supabase
When using both Prisma and Supabase:
1. Make schema changes in Prisma
2. Generate Prisma client: `npm run db:generate`
3. Push changes to local Supabase: `npm run db:push`
4. Create Supabase migration: `npx supabase db diff --local`
5. Test migrations: `npx supabase db reset`

#### Stopping Supabase
```bash
# Stop local Supabase services
npx supabase stop
```

### Build

To build all apps and packages, run the following command:

```
cd turbo-bgs
npm run build
```

### Develop

To develop all apps and packages, run the following command:

```
cd turbo-bgs
npm run dev
```

