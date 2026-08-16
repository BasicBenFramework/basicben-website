# BasicBen Website

The marketing and documentation site for [BasicBen](https://github.com/BasicBenFramework/core) — a full-stack React framework with zero runtime dependencies.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view your app.

## Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Run production server
npm run test         # Run tests

npm run migrate      # Run database migrations
npm run migrate:fresh   # Reset and re-run all migrations
npm run seed         # Load sample data
```

## Deployment

The site builds to a Node server plus a static client bundle, and ships a
Dockerfile that runs on any container host (Fly, Railway, Render, Cloud Run):

```bash
docker build -t basicben-website .
docker run -p 3001:3001 \
  -e APP_KEY=<32-char secret> \
  -e CORS_ORIGIN=https://your-domain \
  -v basicben-data:/app/data \
  basicben-website
```

Two things to get right:

- **Mount a volume at `/app/data`.** SQLite lives there, and without a volume
  the database is discarded on every redeploy.
- **Set `APP_KEY`.** It signs the JWTs. Changing it invalidates every session.

Migrations run on boot and are idempotent, so a redeploy is safe.

To deploy without Docker, run `npm run build` and then `npm run start` with
`NODE_ENV=production`. The server serves the built client from `dist/client`,
including a history fallback so deep links survive a refresh.

## Project Structure

```
src/
├── main.jsx              # React entry point
├── routes/
│   ├── App.jsx           # Client routes
│   └── api/              # API routes (auto-loaded)
├── controllers/          # Business logic
├── models/               # Database queries
├── middleware/           # Route middleware
├── helpers/              # Utility functions
└── client/
    ├── layouts/          # Layout components
    ├── pages/            # Page components
    └── components/       # Reusable UI
```

## Scaffolding

```bash
npx basicben make:controller User
npx basicben make:model User
npx basicben make:route users
npx basicben make:migration create_users
```

## Configuration

Edit `basicben.config.js` to customize server settings, CORS, database, and more.

## Documentation

Full documentation: [github.com/BasicBenFramework/core](https://github.com/BasicBenFramework/core)
