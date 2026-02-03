# Environment Variables - Konfigurasi Lengkap

Panduan lengkap mengisi file `.env` untuk semua layanan.

## 📋 File .env.example

Project ini sudah include `.env.example` dengan semua variabel yang dibutuhkan.

```bash
# Copy template
cp .env.example .env

# Edit file
nano .env  # atau code .env, vim .env, dll
```

---

## 🔴 WAJIB (Minimal Setup)

### Cloudflare D1 Database

| Variable | Dari Mana | Contoh |
|----------|-----------|--------|
| `CLOUDFLARE_ACCOUNT_ID` | Dashboard kanan atas / Workers & Pages | `1a2b3c4d5e6f7g8h9i0j` |
| `CLOUDFLARE_DATABASE_ID` | `wrangler d1 create` output / wrangler.toml | `abc123def-456...` |
| `CLOUDFLARE_API_TOKEN` | Profile → API Tokens → Create | `abcd1234...` |

#### Cara Mendapatkan:

**Account ID:**
1. Dashboard Cloudflare → Lihat sidebar kanan
2. Atau Workers & Pages → Account ID di panel kanan

**Database ID:**
1. Setelah `npx wrangler d1 create DB`, copy ID
2. Atau lihat di `wrangler.toml`

**API Token:**
1. Dashboard → My Profile (kanan atas) → API Tokens
2. Create Token → Custom token
3. Permissions:
   - Account: D1:Edit
   - Zone: Read (opsional)
4. Continue → Create
5. Copy token (hanya muncul sekali!)

---

## 🟡 OPTIONAL (Fitur Tambahan)

### Google OAuth (Login dengan Google)

| Variable | Dari Mana |
|----------|-----------|
| `GOOGLE_CLIENT_ID` | Google Cloud Console → Credentials |
| `GOOGLE_CLIENT_SECRET` | Google Cloud Console → Credentials |

**Setup:** [Google OAuth Setup Guide](./google-oauth)

```env
GOOGLE_CLIENT_ID=123456789-abc123.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxx
```

---

### Resend Email (Email Verification)

| Variable | Dari Mana |
|----------|-----------|
| `RESEND_API_TOKEN` | Resend Dashboard → API Keys |
| `FROM_EMAIL` | Domain yang diverifikasi di Resend |

**Setup:** [Resend Email Setup](./resend-email)

```env
RESEND_API_TOKEN=re_xxxxxxxx
FROM_EMAIL=noreply@yourdomain.com
```

**Note:** Untuk development bisa pakai `onboarding@resend.dev`

---

### Cloudflare R2 (File Upload)

| Variable | Dari Mana |
|----------|-----------|
| `R2_ACCOUNT_ID` | Sama dengan Cloudflare Account ID |
| `R2_ACCESS_KEY_ID` | R2 → Manage R2 API Tokens |
| `R2_SECRET_ACCESS_KEY` | R2 → Manage R2 API Tokens |
| `R2_BUCKET_NAME` | Nama bucket yang dibuat |
| `R2_PUBLIC_URL` | R2 → Bucket → Settings → Public URL |

**Setup:** [R2 Setup Guide](./cloudflare-r2)

```env
R2_ACCOUNT_ID=1a2b3c4d5e6f7g8h9i0j
R2_ACCESS_KEY_ID=abc123...
R2_SECRET_ACCESS_KEY=xyz789...
R2_BUCKET_NAME=my-app-uploads
R2_PUBLIC_URL=https://pub-abc123.r2.dev
```

---

### Node Environment

```env
NODE_ENV=development  # atau production
```

---

## 📝 Contoh .env Lengkap

```bash
# ============================================================================
# REQUIRED - Database (WAJIB)
# ============================================================================
CLOUDFLARE_ACCOUNT_ID=1a2b3c4d5e6f7g8h9i0j
CLOUDFLARE_DATABASE_ID=a1b2c3d4-e5f6-7890-abcd-ef1234567890
CLOUDFLARE_API_TOKEN=abcd1234xxxxxxxx

# ============================================================================
# OPTIONAL - Google Login
# ============================================================================
GOOGLE_CLIENT_ID=123456789-abc123.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxx

# ============================================================================
# OPTIONAL - Email Verification
# ============================================================================
RESEND_API_TOKEN=re_xxxxxxxx
FROM_EMAIL=noreply@yourdomain.com

# ============================================================================
# OPTIONAL - File Upload
# ============================================================================
R2_ACCOUNT_ID=1a2b3c4d5e6f7g8h9i0j
R2_ACCESS_KEY_ID=abc123...
R2_SECRET_ACCESS_KEY=xyz789...
R2_BUCKET_NAME=my-app-uploads
R2_PUBLIC_URL=https://pub-abc123.r2.dev

# ============================================================================
# Environment
# ============================================================================
NODE_ENV=development
```

---

## 🔒 Keamanan

### Jangan pernah:

- ❌ Commit `.env` ke git (sudah di `.gitignore`)
- ❌ Share API token di chat/email
- ❌ Hardcode credentials di code

### Best Practices:

- ✅ Gunakan `.env.example` untuk template
- ✅ Rotate API tokens secara berkala
- ✅ Gunakan token dengan permission minimal
- ✅ Different tokens untuk dev dan production

---

## 🚀 Production Deployment

Untuk production di Cloudflare Pages:

1. Build project: `npm run build`
2. Deploy: `npm run deploy`
3. Dashboard Cloudflare → Pages → Your Project → Settings → Functions
4. Add Environment Variables disana

**Note:** Environment variables di Cloudflare Pages terpisah dari local `.env`

---

## 🐛 Common Issues

| Error | Penyebab | Solusi |
|-------|----------|--------|
| "D1 binding not found" | Database ID salah | Check `wrangler.toml` dan `.env` |
| "API token invalid" | Token expired/salah | Buat token baru |
| "Cannot access R2" | Access key salah | Check R2 API Tokens |
| "Email not sent" | Resend token salah | Verifikasi token di Resend dashboard |
