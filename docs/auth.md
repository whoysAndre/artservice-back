# Auth Module

Handles Google OAuth2 authentication and JWT issuance.

## Dependencies

| Package | Purpose |
|---|---|
| `passport-google-oauth20` | Google OAuth2 strategy |
| `passport-jwt` | JWT strategy for protected routes |
| `@nestjs/jwt` | JWT signing and verification |
| `@nestjs/passport` | Passport integration for NestJS |

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `OAUTH_CLIENT_ID` | Yes | Google OAuth2 client ID |
| `OAUTH_CLIENT_SECRET` | Yes | Google OAuth2 client secret |
| `SECRET_JWT_TOKEN` | Yes | Secret used to sign JWTs |
| `OAUTH_CALLBACK_URL` | No | Callback URL (default: `http://localhost:3000/api/auth/google/callback`) |

## Endpoints

### `GET /api/auth/google`

Initiates the Google OAuth2 flow. Must be opened in a browser — redirects the user to Google's consent screen.

---

### `GET /api/auth/google/callback`

Google redirects here after the user grants permission. Handled internally by the OAuth strategy.

- If the user does not exist, they are created with role `CUSTOMER`.
- If the user already exists, their record is returned as-is.

**Response**

```json
{ "token": "<jwt>" }
```

The JWT expires in **7 days** and contains:

```json
{
  "sub": "<userId>",
  "email": "user@gmail.com",
  "name": "John Doe",
  "role": "CUSTOMER"
}
```

## Strategies

### `OAuthStrategy` (`strategies/oauth.strategy.ts`)

Registered as `'oauth2'`. Calls `AuthService.validateOAuthUser(profile)` → `UsersService.findOrCreate()`.

Callback URL is read from `envs.oauthCallbackUrl` — set `OAUTH_CALLBACK_URL` in `.env` for production.

### `JwtStrategy` (`strategies/jwt.strategy.ts`)

Registered as `'jwt'` (default strategy). Extracts the token from `Authorization: Bearer <token>`. Returns the decoded payload as `req.user`.

## Guards & decorators

Defined in `auth/` and usable across all modules:

```ts
@UseGuards(AuthGuard('jwt'), RolesGuard)  // always together
@RequireRoles(Roles.DEVELOPER)            // restrict to role
@CurrentUser() user: JwtPayload           // inject JWT payload
// JwtPayload: { sub, email, name, role }
```

## Internal flow

```
Browser → GET /api/auth/google
        → Google consent screen
        → GET /api/auth/google/callback
        → OAuthStrategy.validate()
        → AuthService.validateOAuthUser()
        → UsersService.findOrCreate()
        → AuthService.generateJwt()
        → { token }
```
