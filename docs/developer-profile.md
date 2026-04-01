# Developer Profile Module

Manages the professional profile of users with the `DEVELOPER` role. All endpoints require a valid JWT with role `DEVELOPER`.

## Prisma model

```prisma
model DeveloperProfile {
  id          String      @id @default(uuid())
  userId      String      @unique
  user        User        @relation(fields: [userId], references: [id])
  specialties Specialty[]
  hourlyRate  Float
  githubUrl   String
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
}

enum Specialty {
  FRONTEND
  BACKEND
  FULLSTACK
  MOBILE
  DEVOPS
}
```

One-to-one with `User`. A developer can only have one profile.

## Endpoints

All routes require:
```
Authorization: Bearer <token>
```

---

### `GET /api/developer-profile` — rol: CUSTOMER

Returns all developer profiles. Optionally filter by specialty.

**Query params**

| Param | Type | Required |
|---|---|---|
| `specialty` | `Specialty` | No |

**Examples**
```
GET /api/developer-profile
GET /api/developer-profile?specialty=BACKEND
```

**Response**

```json
[
  {
    "id": "uuid",
    "specialties": ["BACKEND", "FULLSTACK"],
    "hourlyRate": 45,
    "githubUrl": "https://github.com/username",
    "user": {
      "name": "John Doe",
      "picture": "https://...",
      "email": "john@gmail.com"
    }
  }
]
```

---

### `POST /api/developer-profile`

Creates the developer's profile. Throws `409 Conflict` if a profile already exists for this user.

**Body**

```json
{
  "specialties": ["BACKEND", "FULLSTACK"],
  "hourlyRate": 45,
  "githubUrl": "https://github.com/username"
}
```

**Response** — the created profile.

---

### `GET /api/developer-profile/me`

Returns the authenticated developer's profile. Throws `404` if not created yet.

---

### `PATCH /api/developer-profile/me`

Updates the authenticated developer's profile. All fields are optional.

**Body** (any subset)

```json
{
  "hourlyRate": 60,
  "specialties": ["FRONTEND"]
}
```
