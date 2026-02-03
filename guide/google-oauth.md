# Google OAuth Setup Guide

Panduan lengkap untuk mengaktifkan Google Login di aplikasi SvelteKit ini.

## 📋 Overview

Google OAuth memungkinkan user login dengan satu klik menggunakan akun Google mereka. Lebih cepat dan user-friendly daripada register manual.

## 🚀 Langkah Setup

### 1. Buka Google Cloud Console

1. Kunjungi [Google Cloud Console](https://console.cloud.google.com/)
2. Login dengan akun Google Anda
3. Buat project baru atau pilih project existing

### 2. Enable Google+ API

1. Di sidebar, klik **"APIs & Services"** > **"Library"**
2. Cari **"Google+ API"** atau **"Google Identity Toolkit API"**
3. Klik **"Enable"**

> **Note:** Google+ API sudah deprecated, yang aktif sekarang adalah **Google Identity Services** yang otomatis enabled saat setup OAuth consent screen.

### 3. Configure OAuth Consent Screen

1. Di sidebar, klik **"APIs & Services"** > **"OAuth consent screen"**
2. Pilih **"External"** (untuk testing) atau **"Internal"** (jika pakai Google Workspace)
3. Klik **"Create"**

#### Isi App Information:
- **App name**: Nama aplikasi Anda (contoh: "My SvelteKit App")
- **User support email**: Email support
- **App logo**: (Opsional) Upload logo 120x120px
- **App domain**: Domain production Anda
- **Developer contact information**: Email developer

4. Klik **"Save and Continue"**

### 4. Add Scopes

1. Di halaman **Scopes**, klik **"Add or Remove Scopes"**
2. Centang scope berikut:
   - ✅ `openid` - OpenID Connect
   - ✅ `userinfo.email` - Email address
   - ✅ `userinfo.profile` - Profile info
3. Klik **"Update"** kemudian **"Save and Continue"**

### 5. Add Test Users (Untuk Development)

1. Di halaman **Test users**, klik **"Add Users"**
2. Masukkan email address untuk testing (bisa email Anda sendiri)
3. Klik **"Add"** kemudian **"Save and Continue"**

> **Penting:** Saat masih dalam status "Testing", hanya test users yang bisa login!

### 6. Create OAuth 2.0 Credentials

1. Di sidebar, klik **"APIs & Services"** > **"Credentials"**
2. Klik **"+ Create Credentials"** > **"OAuth 2.0 Client ID"**
3. Pilih **Application type**: **"Web application"**
4. Isi **Name**: "SvelteKit Web Client"

#### Authorized Redirect URIs

Tambahkan redirect URIs berikut:

**Untuk Local Development:**
```
http://localhost:5173/auth/google/callback
```

**Untuk Production:**
```
https://your-domain.pages.dev/auth/google/callback
https://www.your-domain.com/auth/google/callback
```

> **Catatan:** Ganti `your-domain` dengan domain Anda yang sebenarnya.

5. Klik **"Create"**

### 7. Copy Credentials

Setelah create, Anda akan melihat:
- **Client ID** (contoh: `123456789-abc123def456.apps.googleusercontent.com`)
- **Client Secret** (contoh: `GOCSPX-xxxxxxxxxxxxxxxx`)

**Simpan keduanya dengan aman!**

## 🔧 Konfigurasi di Project

### 1. Update Environment Variables

Edit file `.env`:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=123456789-abc123def456.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxxxx
```

### 2. Update wrangler.toml (Production)

Untuk production, tambahkan ke `wrangler.toml`:

```toml
[env.production.vars]
GOOGLE_CLIENT_ID = "your-production-client-id"
```

Atau set via Cloudflare Dashboard:
1. Buka **Pages** > Your Project > **Settings** > **Functions**
2. Tambahkan environment variables:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`

## 🧪 Testing

### 1. Local Development

```bash
npm run dev
```

1. Buka http://localhost:5173/login
2. Klik **"Continue with Google"**
3. Pilih akun Google Anda
4. Jika berhasil, akan redirect ke dashboard

### 2. Production

```bash
npm run deploy
```

1. Buka https://your-domain.pages.dev/login
2. Test Google Login

## ⚠️ Common Issues

### "Error 400: redirect_uri_mismatch"

**Penyebab:** Redirect URI tidak match dengan yang didaftarkan di Google Cloud Console.

**Solusi:**
1. Pastikan URI di Google Cloud Console sama persis dengan callback URL
2. Perhatikan `http` vs `https`
3. Perhatikan trailing slash (jangan ada `/` di akhir)

### "Error 403: access_denied"

**Penyebab:** User belum ditambahkan sebagai test user.

**Solusi:**
1. Tambahkan email user ke **Test users** di OAuth consent screen
2. Atau publish app ke production (lihat di bawah)

### "This app isn't verified"

**Penyebab:** App masih dalam status testing.

**Solusi:**
1. Klik **"Advanced"** > **"Go to [Your App] (unsafe)"**
2. Atau publish app (lihat di bawah)

## 🚀 Publish ke Production

Jika app sudah siap untuk public:

1. Di **OAuth consent screen**, klik **"PUBLISH APP"**
2. Konfirmasi publish
3. Tunggu review dari Google (biasanya instan untuk scope basic)

Setelah published, semua user dengan akun Google bisa login.

## 🔒 Security Best Practices

1. **Jangan commit Client Secret** - Selalu pakai environment variables
2. **Gunakan HTTPS** - Wajib untuk production
3. **Validasi State Parameter** - Sudah diimplementasikan di code
4. **Restrict OAuth Usage** - Di Google Cloud Console, restrict ke domain Anda saja

## 📖 Tambahan

### Custom Branding

Di **OAuth consent screen**, Anda bisa:
- Upload logo aplikasi
- Set custom domain untuk consent screen
- Tambahkan privacy policy dan terms of service links

### Multiple Environments

Buat credentials terpisah untuk:
- Development (localhost)
- Staging (staging.yourdomain.com)
- Production (yourdomain.com)

Setiap environment punya Client ID dan Secret yang berbeda.

## 🆘 Butuh Bantuan?

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google Identity Services](https://developers.google.com/identity/gsi/web)
- [Lucia Auth with OAuth](https://lucia-auth.com/guides/oauth/)

---

**Setelah setup selesai, user bisa login dengan Google di aplikasi Anda!** 🎉
