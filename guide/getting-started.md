# 🚀 Getting Started - 5 Menit Setup

Setup project SvelteKit Cloudflare dari nol sampai bisa coding.

---

## ✅ Prerequisites

| Requirement | Cara Cek | Install |
|-------------|----------|---------|
| Node.js 18+ | `node --version` | [nodejs.org](https://nodejs.org) |
| Git | `git --version` | [git-scm.com](https://git-scm.com) |
| Akun Cloudflare | - | [dash.cloudflare.com](https://dash.cloudflare.com/sign-up) |

---

## 📋 Step-by-Step

### Step 1: Clone & Install (1 menit)

```bash
# Clone repository
git clone https://github.com/yourusername/sveltekit-cf-starter.git my-app
cd my-app

# Install dependencies
npm install
```

---

### Step 2: Login Cloudflare (1 menit)

```bash
# Login ke Cloudflare (buka browser otomatis)
npx wrangler login

# Verifikasi login
npx wrangler whoami
```

---

### Step 3: Buat Database (1 menit)

```bash
# Buat database D1
npx wrangler d1 create my-app-db
```

**Output yang muncul:**
```
✅ Successfully created DB 'my-app-db'

[[d1_databases]]
binding = "DB"
database_name = "my-app-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"  ← Simpan ini!
```

**Update `wrangler.toml`:**

Buka file `wrangler.toml` dan ganti bagian `[[d1_databases]]`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "my-app-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"  # Ganti dengan ID kamu
```

---

### Step 4: Setup Environment (1 menit)

```bash
# Copy template environment
cp .env.example .env
```

Edit `.env` dan isi:

```bash
# Cloudflare (Required)
CLOUDFLARE_ACCOUNT_ID=your_account_id_here
CLOUDFLARE_DATABASE_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
CLOUDFLARE_API_TOKEN=your_api_token_here
```

**Cara dapatkan values:**

| Variable | Cara Mendapatkan |
|----------|-----------------|
| `CLOUDFLARE_ACCOUNT_ID` | Dashboard Cloudflare → sidebar kanan "Account ID" |
| `CLOUDFLARE_DATABASE_ID` | Dari Step 3, atau `npx wrangler d1 list` |
| `CLOUDFLARE_API_TOKEN` | Dashboard → My Profile → API Tokens → Create Token → Custom token dengan permission: Account:D1:Edit |

---

### Step 5: Apply Migration (30 detik)

```bash
# Buat tabel database
npm run db:migrate:local
```

**Verifikasi berhasil:**
```bash
npx wrangler d1 execute DB --local --command ".tables"
# Output: email_verification_tokens  password_reset_tokens  posts  sessions  users
```

---

### Step 6: Jalankan Development Server (30 detik)

```bash
npm run dev
```

🎉 **Buka browser: http://localhost:5173**

---

## ✅ Verifikasi Setup

Coba fitur berikut untuk memastikan semua berjalan:

- [ ] Home page terbuka
- [ ] Bisa register akun baru
- [ ] Bisa login
- [ ] Dashboard bisa diakses setelah login

**Test Register:**
1. Klik "Register" di navbar
2. Isi: Name: Test, Email: test@test.com, Password: password123
3. Click "Register" → harusnya redirect ke Dashboard

---

## 🎯 Apa Selanjutnya?

Pilih jalur sesuai kebutuhan:

| Jika kamu... | Lanjut ke... |
|--------------|--------------|
| Mau langsung coding fitur | [Development Flow](./development-flow) |
| Mau pakai AI untuk coding | [AI-First Development](./ai-first-development) |
| Mau deploy ke production | [Deployment](./deployment) |
| Mau tambah fitur (OAuth, Email, Upload) | [Features](./features) |

---

## 🐛 Troubleshooting

### Error: "D1 binding not found"
```bash
# Check database_id di wrangler.toml
npx wrangler d1 list
```

### Error: "Database not available"
```bash
# Jalankan migration lagi
npm run db:migrate:local
```

### Error: Port 5173 already in use
```bash
# Gunakan port lain
npm run dev -- --port 3000
```

---

## 📝 Command Cheat Sheet

```bash
# Development
npm run dev              # Start dev server
npm run dev -- --host    # Expose ke network

# Database
npm run db:migrate:local # Apply migrations (local)
npm run db:migrate       # Apply migrations (production)
npm run db:studio        # Buka Drizzle Studio GUI

# Build & Deploy
npm run build            # Build untuk production
npm run preview          # Preview production build
npm run deploy           # Deploy ke Cloudflare Pages

# Utility
npx wrangler whoami      # Check login status
npx wrangler d1 list     # List databases
```

---

**Selamat! 🎉 Kamu sudah siap mulai development!**
