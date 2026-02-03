# 🚀 Quick Start - 5 Menit Setup

Panduan setup project SvelteKit Cloudflare D1 dari nol sampai bisa diakses di browser.

---

## ✅ Prerequisites (Yang Harus Dipersiapkan)

Sebelum mulai, pastikan Anda punya:

| Requirement | Cara Cek | Install Jika Belum |
|-------------|----------|-------------------|
| **Node.js 18+** | `node --version` | [Download](https://nodejs.org) |
| **npm** | `npm --version` | Ikut dengan Node.js |
| **Akun Cloudflare** | - | [Daftar gratis](https://dash.cloudflare.com/sign-up) |

**Command untuk verify:**
```bash
node --version  # Harus v18.0.0 atau lebih tinggi
npm --version   # Harus v8.0.0 atau lebih tinggi
```

---

## 📋 Step-by-Step Setup

### Step 1: Clone & Install (2 menit)

```bash
# Clone repository
git clone https://github.com/yourusername/sveltekit-cf-d1-boilerplate.git

# Masuk ke folder project
cd sveltekit-cf-d1-boilerplate

# Install dependencies (~1 menit)
npm install
```

**Output yang diharapkan:**
```
added XXX packages in XXs
```

---

### Step 2: Login ke Cloudflare Wrangler (1 menit)

Wrangler adalah CLI tool dari Cloudflare untuk manage project.

```bash
# Login ke Cloudflare (akan membuka browser)
npx wrangler login

# Verifikasi sudah login
npx wrangler whoami
# Output: Anda login sebagai user@email.com
```

**Catatan:** Jika browser tidak terbuka otomatis, copy URL yang muncul di terminal.

---

### Step 3: Buat Database D1 (2 menit)

D1 adalah database SQLite yang akan kita gunakan.

```bash
# Buat database baru
npx wrangler d1 create my-app-db
```

**Output yang penting:**
```
✅ Successfully created DB 'my-app-db'

[[d1_databases]]
binding = "DB"
database_name = "my-app-db"
database_id = "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
```

**Simpan `database_id` tersebut!**

#### Update wrangler.toml

Buka file `wrangler.toml` dan tambahkan:

```toml
[[d1_databases]]
binding = "DB"
database_name = "my-app-db"
database_id = "a1b2c3d4-e5f6-7890-abcd-ef1234567890"  # Ganti dengan ID Anda
```

---

### Step 4: Setup Environment Variables (2 menit)

```bash
# Copy template environment file
cp .env.example .env

# Edit file .env (gunakan editor favorit)
# Windows: notepad .env
# Mac/Linux: nano .env atau code .env
```

**Isi minimal yang harus di-set:**

```bash
# Cloudflare (Required)
CLOUDFLARE_ACCOUNT_ID=your_account_id_here
CLOUDFLARE_DATABASE_ID=a1b2c3d4-e5f6-7890-abcd-ef1234567890  # Dari Step 3
CLOUDFLARE_API_TOKEN=your_api_token_here
```

#### Cara Mendapatkan Values:

**1. Account ID:**
- Buka [Cloudflare Dashboard](https://dash.cloudflare.com)
- Di sidebar kanan, ada "Account ID"
- Copy dan paste ke `.env`

**2. Database ID:**
- Dari Step 3, atau
- Jalankan: `npx wrangler d1 list`

**3. API Token:**
1. Dashboard → My Profile (kanan atas) → API Tokens
2. Click "Create Token"
3. Pilih "Custom token"
4. Permissions:
   - Account: D1:Edit
   - Zone: (tidak perlu)
5. Click "Continue to summary" → Create Token
6. Copy token dan paste ke `.env`

---

### Step 5: Apply Database Migration (1 menit)

Migration adalah script yang membuat struktur tabel database.

```bash
# Apply migration ke local database
npm run db:migrate:local
```

**Output yang diharapkan:**
```
🚧 Mapping SQL inputs into an array of statements:
🚧 Parsing array of statements...
✅ Successfully applied migration!
```

**Verifikasi database berhasil dibuat:**
```bash
# List tabel yang sudah dibuat
npx wrangler d1 execute DB --local --command ".tables"

# Output:
# email_verification_tokens  password_reset_tokens  posts  sessions  users
```

---

### Step 6: Jalankan Development Server (1 menit)

```bash
# Start dev server
npm run dev
```

**Output:**
```
  VITE v5.x.x  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

🎉 **Buka browser dan akses: http://localhost:5173**

---

## ✅ Verifikasi Setup Berhasil

### Checklist:

- [ ] Home page terbuka tanpa error
- [ ] Bisa register akun baru
- [ ] Bisa login dengan akun yang dibuat
- [ ] Dashboard page bisa diakses
- [ ] Tidak ada error di terminal
- [ ] Tidak ada error di browser console

### Test Register & Login:

1. Klik "Register" di navbar
2. Isi form dengan:
   - Name: Test User
   - Email: test@example.com
   - Password: password123
3. Click "Register"
4. Harusnya redirect ke Dashboard
5. Logout, kemudian login lagi dengan email/password yang sama

---

## 🎉 Selesai! Apa Selanjutnya?

Anda sekarang punya aplikasi SvelteKit yang berjalan dengan:
- ✅ SvelteKit app dengan SSR
- ✅ Database D1 terhubung
- ✅ Authentication system (register/login)
- ✅ Protected dashboard page

### Tambahan Fitur (Opsional):

Jika ingin menambahkan fitur:

| Fitur | Panduan | Waktu |
|-------|---------|-------|
| **Google Login** | [Google OAuth Setup](./google-oauth) | ~15 menit |
| **Email Verification** | [Resend Email Setup](./resend-email) | ~15 menit |
| **File Upload** | [Cloudflare R2 Setup](./cloudflare-r2) | ~20 menit |

### Deep Dive:

| Topik | Panduan | Untuk |
|-------|---------|-------|
| **Architecture** | [System Design](./architecture) | Pahami cara kerja |
| **Patterns** | [SvelteKit Patterns](./sveltekit-patterns) | Best practices |
| **Security** | [Security Guide](../reference/security) | Production hardening |

---

## 🐛 Troubleshooting

### Error: "D1 binding not found"

```
Error: D1 binding not found
```

**Solusi:**
```bash
# Check database_id di wrangler.toml
# Pastikan sama dengan output dari:
npx wrangler d1 list
```

### Error: "Database not available"

```
Error: Database not available
```

**Solusi:**
```bash
# Jalankan migration
npm run db:migrate:local

# Verifikasi
npx wrangler d1 execute DB --local --command ".tables"
```

### Error: "Cannot find module"

```
Error: Cannot find module '$lib/db/schema'
```

**Solusi:**
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

### Error: Port 5173 already in use

```
Error: Port 5173 is already in use
```

**Solusi:**
```bash
# Gunakan port lain
npm run dev -- --port 3000

# Atau kill process yang pakai port 5173
npx kill-port 5173
npm run dev
```

### Error: "CLOUDFLARE_ACCOUNT_ID is not defined"

**Solusi:**
```bash
# Pastikan .env file ada
cat .env

# Isi dengan benar
CLOUDFLARE_ACCOUNT_ID=xxx
CLOUDFLARE_DATABASE_ID=xxx
CLOUDFLARE_API_TOKEN=xxx
```

---

## 📝 Command Cheat Sheet

```bash
# Development
npm run dev              # Start dev server
npm run dev -- --host    # Expose to network

# Database
npm run db:migrate:local # Apply migrations (local)
npm run db:migrate       # Apply migrations (production)
npm run db:studio        # Open Drizzle Studio

# Build & Deploy
npm run build            # Build for production
npm run preview          # Preview production build
npm run deploy           # Deploy to Cloudflare Pages

# Utility
npx wrangler whoami      # Check login status
npx wrangler d1 list     # List databases
```

---

## 💡 Tips

### Hot Reload
Saat `npm run dev` berjalan, perubahan file akan otomatis reload browser.

### Database Browser
```bash
# Buka Drizzle Studio untuk browse data
npm run db:studio
# Akses: http://localhost:4983
```

### Reset Database (Development Only)
```bash
# Hapus local database
rm -rf .wrangler/state/d1

# Jalankan migration lagi
npm run db:migrate:local
```

---

**Selamat! Anda sudah siap mulai development! 🚀**

Butuh bantuan? Cek [troubleshooting lengkap](../troubleshooting/database) atau [FAQ](../reference/common-mistakes).
