# ArtService API

REST API for a **developer marketplace** where customers discover and contact freelance developers. Built as a portfolio project to demonstrate production-ready NestJS architecture.

**Live docs → `http://localhost:3000/docs`** (Swagger UI, interactive)

---

## What it does

- Customers browse developer profiles, filter by specialty, leave reviews, and send contact emails
- Developers create and manage their profile, portfolio projects, and profile picture
- Authentication via Google OAuth2 — no passwords, just JWT
- Emails sent via Resend when a customer contacts a developer
- Images (profile pictures, portfolio) uploaded to Cloudinary

---

## Tech stack

| Concern | Technology |
|---|---|
| Framework | NestJS 11 + TypeScript |
| Database | PostgreSQL + Prisma ORM |
| Auth | Google OAuth2 + JWT (Passport) |
| Validation | class-validator + class-transformer |
| Email | Resend |
| File storage | Cloudinary |
| Docs | Swagger / OpenAPI |

---

## Testing the API (5 minutes)

### 1. Run locally

```bash
npm install
npx prisma migrate dev
npm run start:dev
```

### 2. Open Swagger UI

```
http://localhost:3000/docs
```

### 3. Get a JWT

Open this URL in your browser (requires a Google account):

```
http://localhost:3000/api/auth/google
```

After Google login the browser shows:

```json
{ "token": "eyJhbGci..." }
```

### 4. Authorize in Swagger

Click **Authorize** (top right of the Swagger page) → paste the token → **Authorize**.

All endpoints are now authenticated for the rest of the session (`persistAuthorization` is enabled — the token survives page refresh).

### 5. Set your role

New accounts start as `CUSTOMER`. To switch to `DEVELOPER`:

```
PATCH /api/users/me/role
{ "role": "DEVELOPER" }
```

The response includes a **fresh JWT** with the new role — copy it and re-authorize in Swagger.

---

## Role system

Every user has one of two roles, which controls what they can access:

| Endpoint group | CUSTOMER | DEVELOPER |
|---|---|---|
| Browse / search developers | ✅ | ❌ |
| View developer profile | ✅ | ❌ |
| Leave a review | ✅ | ❌ |
| Contact a developer | ✅ | ❌ |
| Create / edit own profile | ❌ | ✅ |
| Upload profile picture | ❌ | ✅ |
| Manage portfolio projects | ❌ | ✅ |

---

## API overview

All routes are prefixed with `/api`. Protected routes require `Authorization: Bearer <token>`.

### Auth
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/auth/google` | Start Google OAuth (open in browser) |

### Users
| Method | Endpoint | Role | Description |
|---|---|---|---|
| `PATCH` | `/users/me/role` | any | Change role → returns new JWT |

### Developer Profile
| Method | Endpoint | Role | Description |
|---|---|---|---|
| `GET` | `/developer-profile` | CUSTOMER | Search profiles (`?specialty=BACKEND&page=1&limit=10`) |
| `GET` | `/developer-profile/:id` | CUSTOMER | Full profile with reviews + portfolio |
| `POST` | `/developer-profile` | DEVELOPER | Create profile |
| `GET` | `/developer-profile/me` | DEVELOPER | Own profile |
| `PATCH` | `/developer-profile/me` | DEVELOPER | Update profile |
| `PATCH` | `/developer-profile/me/picture` | DEVELOPER | Upload picture (`multipart/form-data`) |

### Portfolio
| Method | Endpoint | Role | Description |
|---|---|---|---|
| `POST` | `/portfolio` | DEVELOPER | Add project (`multipart/form-data`, image optional) |
| `DELETE` | `/portfolio/:id` | DEVELOPER | Delete project |

### Reviews
| Method | Endpoint | Role | Description |
|---|---|---|---|
| `POST` | `/reviews/:developerProfileId` | CUSTOMER | Submit review (1–5 stars, one per developer) |
| `GET` | `/reviews/:developerProfileId` | any | Get all reviews for a developer |

### Contact
| Method | Endpoint | Role | Description |
|---|---|---|---|
| `POST` | `/contact/:developerProfileId` | CUSTOMER | Send email to developer via Resend |

---

## Data model

```
User
 ├── role: CUSTOMER | DEVELOPER
 └── DeveloperProfile (1:1, only for DEVELOPER role)
      ├── specialties: Specialty[]   (FRONTEND | BACKEND | FULLSTACK | MOBILE | DEVOPS)
      ├── hourlyRate: Float
      ├── githubUrl: String
      ├── Review[]                   (@@unique on [customerId, developerProfileId])
      └── PortfolioProject[]
```

---

## Project structure

```
src/
├── main.ts                   # bootstrap, Swagger setup, global prefix
├── config/envs.ts            # all env vars validated with Joi at startup
└── modules/
    ├── auth/                 # OAuth strategy, JWT strategy, guards, decorators
    ├── users/                # role update, returns fresh JWT
    ├── developer-profile/    # CRUD, search with pagination, picture upload
    ├── reviews/              # 1-5 star ratings, unique constraint enforced by DB
    ├── portfolio/            # portfolio projects, optional Cloudinary image
    ├── contact/              # sends email via Resend to developer
    ├── cloudinary/           # uploadFromBuffer() used by profile + portfolio
    ├── email/                # Resend client injected as 'RESEND' token
    └── prisma/               # PrismaService, exported globally
```

---

## Environment variables

```env
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/artservice

# Auth
SECRET_JWT_TOKEN=your-very-long-random-secret
OAUTH_CLIENT_ID=xxx.apps.googleusercontent.com
OAUTH_CLIENT_SECRET=xxx
OAUTH_CALLBACK_URL=http://localhost:3000/api/auth/google/callback  # optional, has default

# Email
RESEND_API_KEY=re_xxx

# File storage
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
```

All variables are validated by Joi on startup — the app **crashes immediately** with a descriptive error if any required variable is missing.

---

## Google Cloud Console setup

1. Go to [console.cloud.google.com](https://console.cloud.google.com) → create a project
2. APIs & Services → Credentials → **Create OAuth 2.0 Client ID** (Web application)
3. Add to **Authorized redirect URIs**:
   ```
   http://localhost:3000/api/auth/google/callback
   ```
4. Copy **Client ID** and **Client Secret** to your `.env`

---

## Deploying to production

1. Deploy the API (e.g. Railway — auto-detects NestJS, provides PostgreSQL)
2. Add the production URL to Google Cloud Console redirect URIs
3. Set `OAUTH_CALLBACK_URL=https://your-api.com/api/auth/google/callback` in env vars
4. Verify a domain on [resend.com](https://resend.com) to send emails to any address (free tier: 3,000 emails/month)

---

## Scripts

```bash
npm run start:dev                        # development with file watch
npm run build && npm run start:prod      # production
npm run test                             # unit tests
npm run lint                             # eslint --fix
npx prisma migrate dev --name <name>     # apply schema changes
npx prisma studio                        # visual DB browser
```
