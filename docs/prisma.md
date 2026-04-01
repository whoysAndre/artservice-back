# Prisma Module

Provides the `PrismaService` as a shared, global database client.

## PrismaService

Extends `PrismaClient` and connects to the database on module initialization.

```ts
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SomeService {
  constructor(private readonly prisma: PrismaService) {}
}
```

`PrismaModule` is imported by any module that needs database access. It exports `PrismaService` so it is available for injection.

## Environment variable

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |

Example:
```
DATABASE_URL=postgresql://user:password@localhost:5432/artservice
```

## Common Prisma commands

```bash
# Apply schema changes to the database and generate client
npx prisma migrate dev --name <migration-name>

# Regenerate the Prisma client after schema changes without migrating
npx prisma generate

# Open Prisma Studio (visual DB browser)
npx prisma studio

# Reset the database (drops all data)
npx prisma migrate reset
```

## Schema location

`prisma/schema.prisma` — all models are defined here. After every change to this file, run `npx prisma migrate dev`.
