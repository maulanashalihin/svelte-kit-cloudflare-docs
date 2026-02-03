# Profile Management Guide

Panduan mengelola profil user di aplikasi.

## 📝 Edit Profile

### Buka Profile Page

1. Login ke aplikasi
2. Klik nama di navbar → **Profile**
3. Atau langsung ke `/profile`

### Edit Informasi

Field yang bisa diedit:

| Field | Max Length | Description |
|-------|------------|-------------|
| **Name** | - | Nama lengkap |
| **Bio** | 160 chars | Deskripsi singkat tentang Anda |
| **Location** | 100 chars | Kota, Negara |
| **Website** | - | URL website pribadi |

### Save Changes

1. Edit field yang diinginkan
2. Klik **"Save Changes"**
3. Toast notification muncul
4. Done! ✅

## 🖼️ Avatar Upload

### Upload Avatar Baru

1. Di profile page, klik icon **kamera** di foto profil
2. Pilih file dari komputer
   - Format: JPG, PNG, GIF, WebP
   - Max: 5MB
3. Preview akan muncul
4. Klik **"Upload Avatar"**
5. Tunggu upload selesai
6. Avatar berubah! 🎉

### Cancel Upload

Jika ingin batal sebelum upload:
- Klik **X** icon di preview
- Atau refresh halaman

### Delete Avatar

Untuk hapus avatar (kembali ke default):
1. Upload avatar baru, atau
2. Contact admin (belum ada fitur delete langsung)

### Avatar Default

Jika belum upload avatar:
- Menampilkan **initial nama** (contoh: "J" untuk John)
- Background gradient biru-ungu

## 🔒 Security Settings

### Change Password

1. Di profile page, scroll ke **Security** section
2. Klik **"Change"** di Password
3. Akan redirect ke `/forgot-password`
4. Ikuti flow reset password

### Email Verification Status

- ✅ **Verified** - Email sudah terverifikasi
- ⚠️ **Unverified** - Belum verifikasi, fitur terbatas

### Resend Verification Email

Jika email belum verified:

1. Di Security section
2. Klik **"Resend"** di Email Verification
3. Check inbox/spam
4. Klik link verifikasi

## 📊 Profile Stats

Di Dashboard, Anda bisa melihat:

- **Profile Status** - Complete atau Incomplete
- **Account Type** - Email atau Google
- **Total Users** - Jumlah user di platform

## 🐛 Troubleshooting Profile

| Masalah | Solusi |
|---------|--------|
| "Failed to update profile" | Check internet connection |
| "Email already exists" | Email sudah dipakai user lain |
| "Invalid URL" | Website harus format URL valid (https://...) |
| Avatar tidak upload | Check file size (< 5MB) dan format |
| "Unauthorized" | Session expired, login ulang |

## 💡 Tips

### Bio yang Baik

- Deskripsikan diri Anda singkat
- Mention expertise atau hobi
- Bisa include emoji ✨

Contoh:
```
Full-stack developer 🚀 | React & Svelte enthusiast | Coffee addict ☕
```

### Website URL

- Pastikan URL valid dengan `https://`
- Contoh: `https://myportfolio.com`
- Bisa juga link ke LinkedIn, GitHub, dll

### Avatar Quality

- Gunakan foto dengan pencahayaan baik
- Square photo untuk hasil crop terbaik
- Minimal 256x256px

## 📁 Files Terkait

```
src/
├── routes/
│   └── profile/
│       └── +page.svelte     # Profile page UI
└── routes/api/
    └── profile/
        └── +server.ts       # API GET/PUT profile
```

## 📖 Lanjutan

- [Authentication Guide](./authentication)
- [File Uploads](./file-uploads)
- [Setup Resend Email](./resend-email)
