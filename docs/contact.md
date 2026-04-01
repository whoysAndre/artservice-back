# Contact Module

Allows a `CUSTOMER` to contact a `DEVELOPER` by sending an email to the developer's registered address via Resend.

## Endpoint

### `POST /api/contact/:developerProfileId` — rol: CUSTOMER

**Headers**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Params**

| Param | Description |
|---|---|
| `developerProfileId` | The `id` of the `DeveloperProfile` to contact |

**Body**

```json
{
  "message": "Hola, me interesa que me hagas una landing page."
}
```

`message` — max 500 characters.

**Response**

```json
{ "success": true }
```

**Errors**

| Code | Reason |
|---|---|
| `404` | Developer profile not found |
| `403` | Authenticated user is not a CUSTOMER |

## Email sent to the developer

- **From:** `ArtService <onboarding@resend.dev>`
- **To:** developer's registered email
- **Subject:** `<customer name> quiere contactarte`
- **Body:** customer name, customer email, and the message

## Dependencies

- `ResendModule` — provides the `RESEND` token (Resend client)
- `PrismaModule` — looks up the developer profile and their email
