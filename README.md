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
npm run db:migrate
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

