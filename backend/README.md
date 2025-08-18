# mailValidator API (Express + TypeScript + MongoDB)

Production-ready backend with email OTP auth (JWT access + refresh), MongoDB Atlas, validation, and security middlewares. Deployable on Render.

## Environment
Create `.env` with:

```
NODE_ENV=development
PORT=10000
MONGODB_URI=your_mongodb_uri
JWT_ACCESS_SECRET=replace_me
JWT_REFRESH_SECRET=replace_me
OTP_PEPPER=replace_me
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your@gmail.com
SMTP_PASS=your_app_password
APP_BASE_URL=http://localhost:5173
CORS_ORIGINS=
LOG_LEVEL=info
```

## Install & Run

```bash
npm i
npm run dev
```

Build & start:

```bash
npm run build
npm start
```

## Seeding Campuses

```bash
npm run seed:campuses
```

## API

- POST /v1/auth/request-otp { email }
- POST /v1/auth/verify-otp { email, otp }
- POST /v1/auth/refresh (HttpOnly cookie)
- POST /v1/auth/logout
- GET /v1/me (Bearer access)
- GET /v1/campuses
- GET /v1/campuses/contains?lng=&lat=
- GET /health

All errors: `{ error: { code, message, details? } }`

## Deployment on Render
- Set env vars in dashboard.
- Healthcheck: GET /health
- Build command: `npm run build`
- Start command: `npm start`
- Ensure PORT is set by Render.

## Notes
- Rate-limit: /auth/request-otp is limited by IP (5/min) and email (3/hour).
- Refresh cookie: HttpOnly, Secure in production, SameSite=Lax.
- TTL indexes clean OTPs and expired refresh tokens automatically.
