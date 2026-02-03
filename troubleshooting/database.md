# Troubleshooting: Database Issues

Solusi untuk masalah-masalah yang berhubungan dengan Cloudflare D1 dan database.

---

## 🔴 Error: "D1 binding not found"

### Gejala
```
Error: D1 binding not found
    at Object.fetch (worker.js:1234:56)
```

### Penyebab & Solusi

#### 1. Database ID Belum di-set di `wrangler.toml`

**Cek:**
```bash
# Lihat database ID
npx wrangler d1 list
```

**Solusi:**
```toml
# wrangler.toml
[[d1_databases]]
binding = "DB"
database_name = "my-app-db"
database_id = "paste-database-id-di-sini"  # ⬅️ Pastikan ini benar
```

#### 2. Belum Login ke Wrangler

```bash
# Login terlebih dahulu
npx wrangler login

# Verifikasi
npx wrangler whoami
```

#### 3. Environment Variables Tidak Terbaca

**Cek file `.env`:**
```bash
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_DATABASE_ID=your_database_id  
CLOUDFLARE_API_TOKEN=your_api_token
```

**Verifikasi:**
```bash
# Test koneksi
npx wrangler d1 execute DB --local --command "SELECT 1"
```

---

## 🔴 Error: "table users has no column named X"

### Gejala
```
Error: table users has no column named bio
    at D1Database._send (worker.js:...)
```

### Penyebab
Schema di database tidak sinkron dengan schema di code.

### Solusi

#### 1. Jalankan Migration

```bash
# Local
npm run db:migrate:local

# Production
npm run db:migrate
```

#### 2. Verify Schema

```bash
# Cek struktur tabel
npx wrangler d1 execute DB --local --command "PRAGMA table_info(users)"
```

#### 3. Reset Database (Development Only!)

```bash
# Hapus dan buat ulang database local
rm -rf .wrangler/state/d1

# Jalankan migration lagi
npm run db:migrate:local
```

---

## 🔴 Error: "Database is locked" atau Timeout

### Gejala
```
Error: database is locked
Error: D1_EXECUTION_ERROR: Timeout
```

### Penyebab & Solusi

#### 1. Query Terlalu Lama

**Optimasi query:**
```typescript
// ✅ Tambahkan limit
const users = await locals.db.query.users.findMany({
  limit: 100 // Jangan ambil semua!
});

// ✅ Gunakan index
const user = await locals.db.query.users.findFirst({
  where: eq(users.email, email)  // Email harus indexed
});
```

#### 2. Concurrent Writes

D1 punya batasan untuk concurrent writes:
```typescript
// ❌ Hindari: Banyak write bersamaan
await Promise.all(
  users.map(u => locals.db.insert(users).values(u))
);

// ✅ Gunakan: Sequential writes
for (const user of users) {
  await locals.db.insert(users).values(user);
}
```

#### 3. Long-Running Transactions

```typescript
// ❌ Hindari: Transaction terlalu lama
// ✅ Pecah menjadi transaction lebih kecil
// ✅ Atau gunakan batch operations
```

---

## 🔴 Error: "FOREIGN KEY constraint failed"

### Gejala
```
Error: FOREIGN KEY constraint failed
```

### Penyebab
Mencoba insert data dengan foreign key yang tidak ada.

### Solusi

```typescript
// ✅ Check existence terlebih dahulu
const user = await locals.db.query.users.findFirst({
  where: eq(users.id, userId)
});

if (!user) {
  return fail(400, { error: 'User tidak ditemukan' });
}

// Insert dengan foreign key
await locals.db.insert(posts).values({
  title: 'My Post',
  authorId: userId // Foreign key
});
```

**Debug foreign keys:**
```sql
-- Check foreign key constraints
PRAGMA foreign_keys;

-- Check referential integrity
PRAGMA foreign_key_check;
```

---

## 🔴 Error: "UNIQUE constraint failed"

### Gejala
```
Error: UNIQUE constraint failed: users.email
```

### Penyebab
Mencoba insert data dengan nilai yang sudah ada.

### Solusi

```typescript
// ✅ Handle dengan graceful error
export const actions = {
  register: async ({ request, locals }) => {
    const form = await request.formData();
    const email = form.get('email');
    
    try {
      await locals.db.insert(users).values({ email });
    } catch (error) {
      if (error.message?.includes('UNIQUE constraint failed')) {
        return fail(400, { error: 'Email sudah terdaftar' });
      }
      throw error;
    }
  }
};
```

Atau check dulu sebelum insert:

```typescript
// ✅ Check existing
const existing = await locals.db.query.users.findFirst({
  where: eq(users.email, email)
});

if (existing) {
  return fail(400, { error: 'Email sudah terdaftar' });
}
```

---

## 🔴 Drizzle Studio Tidak Bisa Connect

### Gejala
```
Error: Cannot connect to database
Drizzle Studio connection failed
```

### Solusi

#### 1. Pastikan `.env` Terisi

```bash
# .env
CLOUDFLARE_ACCOUNT_ID=xxx
CLOUDFLARE_DATABASE_ID=xxx
CLOUDFLARE_API_TOKEN=xxx
```

#### 2. Cek `drizzle.config.ts`

```typescript
export default defineConfig({
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  driver: 'd1-http',
  dbCredentials: {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
    databaseId: process.env.CLOUDFLARE_DATABASE_ID,
    token: process.env.CLOUDFLARE_API_TOKEN
  }
});
```

#### 3. Run dengan benar

```bash
# Load environment variables terlebih dahulu
export $(cat .env | xargs)

# Buka Drizzle Studio
npm run db:studio
```

---

## 🔴 Migration Gagal

### Gejala
```
Error: Migration failed
Error: table users already exists
```

### Solusi

#### 1. Check Migration Status

```bash
# Lihat applied migrations
npx wrangler d1 migrations list DB --local
```

#### 2. Migration Conflict

```bash
# Force apply (hati-hati!)
npx wrangler d1 migrations apply DB --local --force
```

#### 3. Reset Migrations (Development Only)

```bash
# Hapus semua migrations
cd drizzle && rm *.sql

# Generate ulang
npm run db:generate

# Apply
npm run db:migrate:local
```

---

## 🔴 Data Tidak Persist

### Gejala
Data hilang setelah restart dev server.

### Penyebab
Mode development menggunakan in-memory database.

### Solusi

#### 1. Pastikan Menggunakan Local D1

```bash
# Check wrangler.toml
# Harus ada:
# [[d1_databases]]
# binding = "DB"
# database_id = "..."

# Jalankan dengan --persist (jika perlu)
npx wrangler dev --persist
```

#### 2. Data Tersimpan di `.wrangler/`

```bash
# Local database location
.wrangler/state/d1/DB/
```

---

## 🔴 Query Lambat

### Diagnosis

```bash
# Analyze query
npx wrangler d1 execute DB --local --command "EXPLAIN QUERY PLAN SELECT * FROM users WHERE email = 'test@example.com'"
```

### Solusi

#### 1. Tambahkan Index

```typescript
// schema.ts
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  // ...
}, (table) => ({
  // Tambahkan index
  emailIdx: index('email_idx').on(table.email),
  nameIdx: index('name_idx').on(table.name)
}));
```

#### 2. Limit Results

```typescript
// ✅ Selalu pakai limit
const users = await locals.db.query.users.findMany({
  limit: 20,
  offset: page * 20
});
```

#### 3. Select Kolom yang Diperlukan Saja

```typescript
// ✅ Select specific columns
const users = await locals.db.select({
  id: users.id,
  name: users.name
}).from(users);

// ❌ Hindari select all untuk data besar
// const users = await locals.db.select().from(users);
```

---

## 🔧 Debug Commands

### Check Database Status

```bash
# List tables
npx wrangler d1 execute DB --local --command ".tables"

# Check table structure
npx wrangler d1 execute DB --local --command "PRAGMA table_info(users)"

# Count records
npx wrangler d1 execute DB --local --command "SELECT COUNT(*) FROM users"

# Check indexes
npx wrangler d1 execute DB --local --command "PRAGMA index_list(users)"
```

### Export/Import Data

```bash
# Export
npx wrangler d1 export DB --local --output backup.sql

# Import
npx wrangler d1 execute DB --local --file backup.sql
```

---

## 🆘 Masih Error?

### Checklist Debug

- [ ] `wrangler.toml` sudah benar?
- [ ] `database_id` sudah sesuai?
- [ ] Sudah login ke Wrangler?
- [ ] Migration sudah dijalankan?
- [ ] `.env` terisi dengan benar?
- [ ] Restart dev server setelah perubahan?

### Resources

- [Cloudflare D1 Docs](https://developers.cloudflare.com/d1/)
- [Drizzle ORM Docs](https://orm.drizzle.team/docs)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)
