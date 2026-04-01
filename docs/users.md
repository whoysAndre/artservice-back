# Users Module

Handles user data and role management.

## Prisma model

```prisma
model User {
  id        String   @id @default(uuid())
  googleId  String   @unique
  email     String   @unique
  name      String
  picture   String?
  role      Roles    @default(CUSTOMER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum Roles {
  DEVELOPER
  CUSTOMER
}
```

## Endpoints

All routes require a valid JWT: `Authorization: Bearer <token>`

---

### `GET /api/users`

Returns all users. Restricted to `DEVELOPER` role.

**Headers**

```
Authorization: Bearer <token>
```

**Response**

```json
[
  {
    "id": "uuid",
    "googleId": "...",
    "email": "user@gmail.com",
    "name": "John Doe",
    "picture": "https://...",
    "role": "CUSTOMER",
    "createdAt": "...",
    "updatedAt": "..."
  }
]
```

---

### `PATCH /api/users/me/role`

Updates the role of the currently authenticated user.

**Headers**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body**

```json
{
  "role": "DEVELOPER"
}
```

Accepted values: `"DEVELOPER"` | `"CUSTOMER"`

**Response**

```json
{
  "id": "uuid",
  "role": "DEVELOPER",
  ...
}
```

> Note: the JWT is not reissued after this call. The new role takes effect on the next login.

## Guards and decorators

Defined in `src/modules/auth/` and usable in any module:

### `@UseGuards(AuthGuard('jwt'), RolesGuard)`

Apply at controller or handler level. `AuthGuard('jwt')` validates the token; `RolesGuard` enforces the role requirement.

### `@RequireRoles(...roles)`

Sets which roles are allowed to access a route. Must be combined with `RolesGuard`.

```ts
@RequireRoles(Roles.DEVELOPER)           // only developers
@RequireRoles(Roles.CUSTOMER)            // only customers
@RequireRoles(Roles.DEVELOPER, Roles.CUSTOMER) // both
```

### `@CurrentUser()`

Parameter decorator that returns the JWT payload from the request.

```ts
@CurrentUser() user: JwtPayload
// user.sub   → userId
// user.email → email
// user.role  → 'CUSTOMER' | 'DEVELOPER'
```

## Usage example for new modules

```ts
@Controller('some-resource')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class SomeController {

  @Get()
  @RequireRoles(Roles.CUSTOMER)
  forCustomers(@CurrentUser() user: JwtPayload) { ... }

  @Post()
  @RequireRoles(Roles.DEVELOPER)
  forDevelopers(@CurrentUser() user: JwtPayload) { ... }
}
```
