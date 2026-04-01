# Auth Module

Handles Google OAuth2 authentication and JWT issuance.

## Dependencies

| Package | Purpose |
|---|---|
| `passport-google-oauth20` | Google OAuth2 strategy |
| `passport-jwt` | JWT strategy for protected routes |
| `@nestjs/jwt` | JWT signing and verification |
| `@nestjs/passport` | Passport integration for NestJS |

## Environment variables required

| Variable | Description |
|---|---|
| `OAUTH_CLIENT_ID` | Google OAuth2 client ID |
| `OAUTH_CLIENT_SECRET` | Google OAuth2 client secret |
| `SECRET_JWT_TOKEN` | Secret used to sign JWTs |

## Endpoints

### `GET /api/auth/google`

Initiates the Google OAuth2 flow. Must be opened in a browser — redirects the user to Google's consent screen.

No request body or headers required.

---

### `GET /api/auth/google/callback`

Google redirects here after the user grants permission. Handled internally by the OAuth strategy.

- If the user does not exist in the database, they are created with role `CUSTOMER`.
- If the user already exists, their record is returned as-is.

**Response**

```json
{
  "token": "<jwt>"
}
```

The JWT expires in **7 days** and contains the following payload:

```json
{
  "sub": "<userId>",
  "email": "user@gmail.com",
  "role": "CUSTOMER"
}
```

## Strategies

### `OAuthStrategy` (`strategies/oauth.strategy.ts`)

Registered as `'oauth2'`. Calls `AuthService.validateOAuthUser(profile)` which delegates to `UsersService.findOrCreate()`.

Callback URL is hardcoded to `http://localhost:3000/api/auth/google/callback` — update this for production.

### `JwtStrategy` (`strategies/jwt.strategy.ts`)

Registered as `'jwt'` (default strategy). Extracts the token from the `Authorization: Bearer <token>` header. Returns the decoded payload as `req.user`.

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
