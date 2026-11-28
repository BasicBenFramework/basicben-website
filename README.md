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

### basicben.com

basicben.com is a static site on Cloudflare Pages. Pages builds `main` on every
push and serves the client bundle, `dist/client`; there is nothing to run by
hand. The build command and output directory live in the Pages project's
settings, not in this repo: the command must be `npm run build`, which is
`basicben build` with `prerender: true` set in `basicben.config.js`. On Pages
(`CF_PAGES` set) the build then drops `dist/client/.basicben/`, which only the
Node server reads (`scripts/pages-postbuild.js`).

The framework's prerender writes one HTML file per public page
(`/docs/routing` → `docs/routing.html`) with its own title, description,
canonical and Open Graph tags, plus `404.html`, `sitemap.xml` and `robots.txt`.
Each page's title and description live in `src/client/seo.js`, which gives them
to the routes in `src/routes/App.jsx` as their `head`. A public page is listed
in both; one that is only in App.jsx still works but is marked noindex and left
out of the sitemap.

Only the client is deployed. No Node server runs behind basicben.com, so
`/api/*` answers with the app's `index.html`. The docs and the home page are
client-side and need nothing else. The app pages need the API, so they are
hidden: sign-in, registration and the Feed are commented out in
`src/routes/App.jsx` and in the nav (`src/client/components/Nav/`), and My
Posts and Profile cannot be reached without signing in. To bring them back,
deploy the server (below) and restore each route together with its nav entry.

### The full app

To run the whole app, with the API, auth and the database, deploy the Node
server as well. The repo ships a Dockerfile that runs on any container host
(Fly, Railway, Render, Cloud Run):

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
