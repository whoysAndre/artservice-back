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

All routes require: `Authorization: Bearer <token>`

---

### `GET /api/users` — role: DEVELOPER

Returns all registered users.

**Response**

```json
[
  {
    "id": "uuid",
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

### `PATCH /api/users/me/role` — role: any

Updates the role of the currently authenticated user. Returns a **fresh JWT** with the new role — no need to re-login.

**Body**

```json
{ "role": "DEVELOPER" }
```

Accepted values: `"DEVELOPER"` | `"CUSTOMER"`

**Response**

```json
{ "token": "<new-jwt-with-updated-role>" }
```

Use this token immediately to authenticate subsequent requests with the new role.

## Guards and decorators

Defined in `src/modules/auth/` and usable in any module:

### `@UseGuards(AuthGuard('jwt'), RolesGuard)`

Apply at controller or handler level. `AuthGuard('jwt')` validates the token; `RolesGuard` enforces the role.

### `@RequireRoles(...roles)`

Sets which roles can access a route. Must be combined with `RolesGuard`.

```ts
@RequireRoles(Roles.DEVELOPER)
@RequireRoles(Roles.CUSTOMER)
```

### `@CurrentUser()`

Parameter decorator that injects the JWT payload.

```ts
@CurrentUser() user: JwtPayload
// user.sub   → userId
// user.email → email
// user.role  → 'CUSTOMER' | 'DEVELOPER'
```
