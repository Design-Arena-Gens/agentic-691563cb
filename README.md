# Gmail ➜ WhatsApp Automation Dashboard

Application Next.js prête pour Vercel qui transforme les emails Gmail correspondant à un filtre donné en messages WhatsApp via l'API Twilio.

## ⚙️ Configuration

1. Crée un projet Google Cloud avec l'API Gmail activée et génère un refresh token (scope `https://www.googleapis.com/auth/gmail.modify`).
2. Active WhatsApp Business dans Twilio, récupère l'expéditeur approuvé (`whatsapp:+...`) et l'`ACCOUNT_SID`/`AUTH_TOKEN`.
3. Ajoute les variables d'environnement dans Vercel ou un `.env.local` en t'appuyant sur `.env.example`.

## 🧪 Développement local

```bash
npm install
npm run dev
```

Tests unitaires et build :

```bash
npm run test
npm run build
```

## 🚀 Fonctionnalités

- Déclenchement manuel via le tableau de bord `/` ou via l'API `POST /api/automation`.
- Gabarits de message personnalisables (`{{from}}`, `{{subject}}`, `{{body}}`, `{{id}}`).
- Option pour marquer automatiquement les emails traités comme lus.
- Composant statique prêt pour une planification Cron Vercel.

## 🔐 Variables d'environnement

| Clé | Description |
| --- | --- |
| `GOOGLE_CLIENT_ID` | Client OAuth2 Google |
| `GOOGLE_CLIENT_SECRET` | Secret OAuth2 |
| `GOOGLE_REFRESH_TOKEN` | Refresh token Gmail pour l'utilisateur cible |
| `GOOGLE_REDIRECT_URI` | URI configurée côté Google (ex. Playground) |
| `GMAIL_SENDER_ADDRESS` | Adresse Gmail surveillée |
| `TWILIO_ACCOUNT_SID` | Identifiant de compte Twilio |
| `TWILIO_AUTH_TOKEN` | Token d'authentification Twilio |
| `TWILIO_WHATSAPP_FROM` | Expéditeur WhatsApp (format `whatsapp:+...`) |
| `DEFAULT_WHATSAPP_TO` | Destinataire par défaut (facultatif) |
| `WHATSAPP_MESSAGE_TEMPLATE` | Message par défaut (facultatif) |
| `GMAIL_SEARCH_QUERY` | Requête de filtre Gmail (facultatif) |

## 🛰️ API

`POST /api/automation`

```json
{
  "limit": 5,
  "markAsRead": true,
  "to": "whatsapp:+33600000000",
  "templateOverride": "Email de {{from}}: {{subject}}"
}
```

Renvoie un rapport détaillant les succès, les échecs et le nombre d'emails contrôlés.

`GET /api/automation` déclenche la synchronisation avec les paramètres par défaut pour un usage via Cron.

## 📄 Licence

MIT
