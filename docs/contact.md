# Contact Module

Allows a `CUSTOMER` to contact a `DEVELOPER` by sending an email to the developer's registered address via Resend.

## Endpoint

### `POST /api/contact/:developerProfileId` — role: CUSTOMER

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
  "message": "Hi, I need a landing page for my startup."
}
```

`message` — max 500 characters.

**Response**

```json
{ "success": true }
```

Always returns `{ success: true }` — see email delivery note below.

**Errors**

| Code | Reason |
|---|---|
| `404` | Developer profile not found |
| `403` | Authenticated user is not a CUSTOMER |

## Email delivery

- **From:** `ArtService <artservice@resend.dev>`
- **To:** developer's registered email
- **Subject:** `<customer name> quiere contactarte`
- **Body:** customer name, customer email, and the message

If Resend cannot deliver the email (e.g. sandbox restrictions, unverified domain), the service logs the full email payload to the console and still returns `{ success: true }` — the endpoint never fails due to email issues.

**For production:** verify a domain on [resend.com](https://resend.com) and update the `from` address to use it. Free tier includes 3,000 emails/month.

## Dependencies

- `ResendModule` — provides the `RESEND` token (Resend client)
- `PrismaModule` — looks up the developer profile and their email
