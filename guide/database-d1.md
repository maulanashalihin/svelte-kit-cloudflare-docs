# Database Setup - Cloudflare D1

Panduan setup database Cloudflare D1 (SQLite).

## 📋 Overview

Cloudflare D1 adalah database SQLite yang berjalan di edge network Cloudflare.

**Keuntungan:**
- 🌍 Global - Data direplikasi di 300+ lokasi
- 🚀 Cepat - Query di edge terdekat dengan user
- 💰 Murah - 500MB storage gratis
- 📱 Edge-compatible - Works dengan Cloudflare Workers/Pages

## 🚀 Setup Database

### 1. Create Database

```bash
# Login ke Wrangler (jika belum login)
npx wrangler login

# Create database
npx wrangler d1 create DB
```

Output contoh:
```
✅ Successfully created DB 'DB' in region APAC

[[d1_databases]]
binding = "DB"
database_name = "DB"
database_id = "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
```

### 2. Update wrangler.toml

Copy output di atas ke `wrangler.toml`:

```toml
name = "my-app"
compatibility_date = "2024-01-01"

[[d1_databases]]
binding = "DB"
database_name = "DB"
database_id = "a1b2c3d4-e5f6-7890-abcd-ef1234567890"  # Ganti dengan ID Anda
```

### 3. Apply Migrations

```bash
# Untuk local development
npm run db:migrate:local

# Untuk production
npm run db:migrate
```

### 4. (Optional) Seed Data

```bash
# Seed database dengan data awal
npm run db:seed:local
```

## 🗄️ Database Schema

### Tables

**users**
```sql
- id (TEXT PRIMARY KEY) - UUID
- email (TEXT UNIQUE)
- name (TEXT)
- password_hash (TEXT, nullable)
- provider ('email' | 'google')
- google_id (TEXT, nullable)
- avatar (TEXT, nullable)
- email_verified (BOOLEAN)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

**sessions** (Lucia Auth)
```sql
- id (TEXT PRIMARY KEY)
- user_id (TEXT FOREIGN KEY)
- expires_at (TIMESTAMP)
```

**password_reset_tokens**
```sql
- id (TEXT PRIMARY KEY)
- user_id (TEXT FOREIGN KEY)
- token_hash (TEXT)
- expires_at (TIMESTAMP)
- used (BOOLEAN)
```

**email_verification_tokens**
```sql
- id (TEXT PRIMARY KEY)
- user_id (TEXT FOREIGN KEY)
- token_hash (TEXT)
- expires_at (TIMESTAMP)
- used (BOOLEAN)
```

**posts** (Example)
```sql
- id (INTEGER PRIMARY KEY AUTOINCREMENT)
- title (TEXT)
- content (TEXT)
- published (BOOLEAN)
- author_id (TEXT FOREIGN KEY)
- created_at (TIMESTAMP)
```

## 🛠️ Database Commands

```bash
# Generate migration dari schema changes
npm run db:generate

# Apply migrations
npm run db:migrate              # Production
npm run db:migrate:local        # Local development

# Open Drizzle Studio (GUI)
npm run db:studio

# Execute SQL
npx wrangler d1 execute DB --local --command "SELECT * FROM users"
```

## 📊 Drizzle Studio

GUI untuk manage database:

```bash
npm run db:studio
```

Buka http://local.drizzle.studio

Fitur:
- 📋 View all tables
- 🔍 Query data
- ➕ Insert/update/delete rows
- 📈 Schema visualization

## 🧪 Testing Database

### Check Database Health

```bash
curl http://localhost:5173/api/health
```

Response:
```json
{
  "status": "ok",
  "db": "connected",
  "timestamp": "2024-01-..."
}
```

### Query via API

```bash
# List users
curl http://localhost:5173/api/users

# Create user
curl -X POST http://localhost:5173/api/users \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","name":"Test"}'
```

## 🔧 Advanced

### Manual SQL Execution

```bash
# Local
npx wrangler d1 execute DB --local --file=./drizzle/custom.sql

# Production
npx wrangler d1 execute DB --remote --file=./drizzle/custom.sql
```

### Backup Database

```bash
# Export data
npx wrangler d1 export DB --local --output=./backup.sql

# Import data
npx wrangler d1 execute DB --local --file=./backup.sql
```

### Delete Database

```bash
npx wrangler d1 delete DB
```

## 💰 Pricing

| Usage | Free Tier | Paid |
|-------|-----------|------|
| Storage | 500 MB | $0.75/GB-month |
| Read requests | 5 million/day | - |
| Write requests | 100,000/day | - |

## 🐛 Troubleshooting

| Error | Solusi |
|-------|--------|
| "D1 binding not found" | Check `wrangler.toml` database_id |
| "Database does not exist" | Pastikan database sudah dibuat |
| "Migration failed" | Check SQL syntax di `drizzle/` folder |
| "Permission denied" | Check API token punya permission D1:Edit |

---

## 📖 Resources

- [Cloudflare D1 Docs](https://developers.cloudflare.com/d1/)
- [Drizzle ORM Docs](https://orm.drizzle.team/docs)
- [SQLite Docs](https://www.sqlite.org/docs.html)
