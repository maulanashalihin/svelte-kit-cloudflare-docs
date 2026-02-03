# Email Setup - Resend

Panduan setup layanan email dengan Resend untuk verifikasi email dan notifikasi.

## 📋 Overview

Resend adalah layanan email transactional modern untuk aplikasi.

**Keuntungan:**
- 🚀 Simple API
- 💰 Free tier: 3,000 emails/month
- 📊 Real-time analytics
- 🎨 Beautiful email templates
- 🔒 Domain verification

## 🚀 Setup Resend

### 1. Create Account

1. Buka [Resend](https://resend.com)
2. Sign up dengan email atau GitHub
3. Verify email Anda

### 2. Get API Key

1. Dashboard Resend → API Keys
2. Klik "Create API Key"
3. Beri nama (contoh: "Development")
4. Permission: **Full access** atau **Sending access**
5. Copy API Key (format: `re_xxxxxxxx`)

**⚠️ Penting:** API Key hanya ditampilkan sekali!

### 3. (Production) Verify Domain

Untuk production dengan domain sendiri:

1. Dashboard → Domains
2. Klik "Add Domain"
3. Masukkan domain (contoh: `yourdomain.com`)
4. Copy DNS records (SPF, DKIM, DMARC)
5. Tambahkan ke DNS provider Anda
6. Tunggu verification (biasanya 5-30 menit)

**Untuk development:** Bisa pakai `onboarding@resend.dev`

## 🔧 Konfigurasi Project

### 1. Update .env

```env
RESEND_API_TOKEN=re_xxxxxxxxxxxx
FROM_EMAIL=noreply@yourdomain.com    # atau onboarding@resend.dev
```

### 2. Test Email

```bash
npm run dev
```

1. Register user baru
2. Check console untuk verification link
3. Email akan muncul di console (development mode)

## 📧 Fitur Email

### Email Verification

Otomatis terkirim saat user register:

```
To: user@example.com
Subject: Verify your email address

Hi {name},

Thanks for signing up! Click link below to verify:
https://yourdomain.com/auth/verify-email?token=xxx&email=xxx
```

### Resend Verification

User bisa minta kirim ulang:

- Profile page → "Resend verification email"
- Rate limited: 1 menit interval

## 🎨 Email Template

Template sudah include di:

```typescript
src/lib/email/templates/verification.ts
```

Features:
- ✅ Responsive HTML
- ✅ Plain text fallback
- ✅ Brand colors
- ✅ Expiration warning

### Custom Template

Edit `src/lib/email/templates/verification.ts`:

```typescript
export function generateVerificationEmail(data) {
  const { name, verificationUrl, expiresIn } = data;
  
  return {
    html: `...`,  // Your HTML
    text: `...`   // Your plain text
  };
}
```

## 💰 Pricing

| Plan | Emails/Month | Price |
|------|--------------|-------|
| Free | 3,000 | $0 |
| Starter | 50,000 | $20 |
| Pro | 200,000 | $80 |

## 🐛 Troubleshooting

| Error | Solusi |
|-------|--------|
| "Invalid API Key" | Check API key, pastikan `re_` prefix |
| "Domain not verified" | Verifikasi domain atau pakai `onboarding@resend.dev` |
| "Rate limit exceeded" | Tunggu 1 menit atau upgrade plan |
| Email tidak terkirim | Check Resend dashboard → Logs |

### Check Email Logs

Resend Dashboard → Logs
- Lihat status email (delivered, bounced, complained)
- Debug failed emails
- Analytics delivery

## 📖 Resources

- [Resend Docs](https://resend.com/docs)
- [Resend Dashboard](https://resend.com)
- [Email Best Practices](https://resend.com/docs/dashboard/domains/introduction)

---

**Setup selesai!** Email verification sekarang aktif di aplikasi Anda.
