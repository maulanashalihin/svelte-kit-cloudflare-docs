# Project Structure

Struktur folder dan file di project SvelteKit Cloudflare Starter.

## 🗂️ Struktur Direktori

```
sveltekit-cf-starter/
│
├── 📁 .svelte-kit/           # Generated files (auto-generated)
├── 📁 .wrangler/             # Local D1 database (SQLite)
│   └── state/v3/d1/
│
├── 📁 drizzle/               # Database migrations
│   ├── 0000_initial.sql      # Initial schema
│   ├── 0001_auth.sql         # Auth tables
│   └── 0002_add_user_profile_fields.sql
│
├── 📁 src/
│   │
│   ├── 📁 lib/               # Shared code
│   │   ├── 📁 auth/          # Authentication logic
│   │   │   ├── lucia.ts      # Lucia auth config
│   │   │   ├── google.ts     # Google OAuth setup
│   │   │   └── password.ts   # Password hashing
│   │   │
│   │   ├── 📁 db/            # Database layer
│   │   │   ├── schema.ts     # Drizzle schema definition
│   │   │   ├── index.ts      # DB client factory
│   │   │   └── types.ts      # TypeScript types
│   │   │
│   │   ├── 📁 email/         # Email service
│   │   │   ├── resend.ts     # Resend client
│   │   │   └── templates/    # Email templates
│   │   │
│   │   └── 📁 storage/       # File storage (R2)
│   │       └── r2.ts
│   │
│   ├── 📁 routes/            # SvelteKit routes (file-based)
│   │   │
│   │   ├── 📁 +layout.svelte # Root layout (navigation)
│   │   ├── 📁 +page.svelte   # Home page
│   │   │
│   │   ├── 📁 api/           # API endpoints
│   │   │   ├── 📁 profile/
│   │   │   │   ├── +server.ts    # GET/PUT profile
│   │   │   │   └── types.ts
│   │   │   ├── 📁 users/
│   │   │   │   └── +server.ts    # GET users list
│   │   │   └── 📁 upload/
│   │   │       └── +server.ts    # File upload
│   │   │
│   │   ├── 📁 auth/          # Authentication routes
│   │   │   ├── 📁 login/
│   │   │   │   └── +server.ts    # POST login
│   │   │   ├── 📁 register/
│   │   │   │   └── +server.ts    # POST register
│   │   │   ├── 📁 logout/
│   │   │   │   └── +server.ts
│   │   │   └── 📁 google/
│   │   │       ├── +server.ts    # OAuth init
│   │   │       └── 📁 callback/
│   │   │           └── +server.ts # OAuth callback
│   │   │
│   │   ├── 📁 dashboard/
│   │   │   └── +page.svelte      # Dashboard UI
│   │   │
│   │   ├── 📁 profile/
│   │   │   └── +page.svelte      # Profile UI
│   │   │
│   │   ├── 📁 login/
│   │   │   └── +page.svelte      # Login UI
│   │   │
│   │   └── 📁 register/
│   │       └── +page.svelte      # Register UI
│   │
│   ├── 📁 app.css            # Global styles
│   ├── 📁 app.html           # HTML template
│   ├── 📁 app.d.ts           # Type declarations
│   └── 📁 hooks.server.ts    # Server hooks (auth + db)
│
├── 📁 static/                # Static assets (images, fonts)
├── 📁 docs/                  # Documentation
│
├── .env                      # Environment variables (gitignored)
├── .env.example              # Template
├── drizzle.config.ts         # Drizzle CLI config
├── svelte.config.js          # SvelteKit config
├── tailwind.config.js        # Tailwind config
├── vite.config.ts            # Vite config
└── wrangler.toml             # Cloudflare config
```

## 📂 File Penting

### Config Files

| File | Purpose |
|------|---------|
| `wrangler.toml` | Cloudflare Workers/Pages config, D1 binding |
| `drizzle.config.ts` | Drizzle ORM configuration |
| `svelte.config.js` | SvelteKit adapter dan options |
| `tailwind.config.js` | Tailwind CSS theme dan plugins |
| `vite.config.ts` | Vite build configuration |
| `.env` | Environment variables (secrets) |

### Core Application Files

| File | Purpose |
|------|---------|
| `src/hooks.server.ts` | Server hooks - inject DB, auth validation |
| `src/app.html` | HTML template |
| `src/app.css` | Global styles |
| `src/lib/db/schema.ts` | Database schema definition |

## 🔄 Routing Convention

SvelteKit menggunakan file-based routing:

```
src/routes/
├── +page.svelte              # /
├── about/+page.svelte        # /about
├── blog/+page.svelte         # /blog
├── blog/[slug]/+page.svelte  # /blog/hello-world
├── api/users/+server.ts      # /api/users (API endpoint)
```

### Special Files

| File | Description |
|------|-------------|
| `+page.svelte` | Page component |
| `+page.server.ts` | Server-side load function dan actions |
| `+layout.svelte` | Layout wrapper |
| `+layout.server.ts` | Layout load function |
| `+server.ts` | API endpoint |
| `+error.svelte` | Error page |

## 📚 Resources

- [SvelteKit Routing](https://kit.svelte.dev/docs/routing)
- [Project Structure](https://kit.svelte.dev/docs/project-structure)
