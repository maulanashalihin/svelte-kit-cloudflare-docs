# Cloudflare R2 Setup Guide

Panduan lengkap untuk setup Cloudflare R2 (object storage) untuk file dan image uploads.

## 📋 Overview

Cloudflare R2 adalah object storage yang kompatibel dengan S3 API, dengan keuntungan:
- **No egress fees** - Tidak ada biaya keluar (bandwidth)
- **S3 Compatible** - Bisa pakai AWS SDK
- **Global CDN** - Otomatis terdistribusi global
- **Murah** - $0.015 per GB per bulan

## 🚀 Langkah Setup

### 1. Buka Cloudflare Dashboard

1. Login ke [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Pilih account Anda
3. Di sidebar, klik **"R2"**

### 2. Create Bucket

1. Klik tombol **"Create bucket"**
2. Masukkan **Bucket name**:
   - Gunakan nama unik (contoh: `myapp-uploads-2024`)
   - Hanya lowercase, numbers, dan hyphens
   - Min 3, max 63 characters
3. Pilih **Location** (opsional, default adalah Automatic):
   - **Automatic** - Data direplikasi otomatis (recommended)
   - Atau pilih region spesifik (EU, US, Asia)
4. Klik **"Create bucket"**

### 3. Enable Public Access (Optional)

Jika file perlu diakses publik (seperti avatar):

1. Klik bucket yang sudah dibuat
2. Tab **"Settings"**
3. Di bagian **"Public Access"**, klik **"Allow"**
4. Catat **Public URL** (contoh: `https://pub-abc123.r2.dev`)

> **Note:** Jika tidak di-public, file hanya bisa diakses via presigned URL.

### 4. Create API Token (for R2)

Cloudflare R2 menggunakan 2 jenis credential:

#### Option A: API Token (Recommended untuk development)

1. Di sidebar R2, klik **"Manage R2 API Tokens"**
2. Klik **"Create API Token"**
3. Pilih permissions:
   - **Object Read & Write** ✅ (untuk upload dan delete)
4. Pilih bucket:
   - **Specific buckets** → pilih bucket Anda
   - Atau **All buckets**
5. Set **TTL** (expiration):
   - **Custom** → pilih durasi (atau leave default)
6. Klik **"Create API Token"**

**Simpan informasi ini:**
```
Access Key ID:     abc123def456...
Secret Access Key: xyz789ghi012...
```

> **Penting:** Secret Access Key hanya ditampilkan sekali! Simpan dengan aman.

#### Option B: Global API Key (Alternative)

Jika butuh access untuk semua buckets:

1. Di sidebar utama Cloudflare, klik **"My Profile"**
2. Tab **"API Tokens"**
3. Klik **"Create Token"**
4. Template: **"R2 Worker"**
5. Atau custom token dengan permission:
   - **Account** > **Cloudflare R2** > **Edit**
6. Klik **"Continue"** → **"Create Token"**

### 5. Get Account ID

Account ID dibutuhkan untuk R2 API:

1. Di sidebar utama (bukan R2), lihat panel kanan
2. Atau klik **"Workers & Pages"**
3. Account ID terlihat di panel kanan

```
Account ID: 1a2b3c4d5e6f7g8h9i0j
```

## 🔧 Konfigurasi di Project

### 1. Update Environment Variables

Edit file `.env`:

```env
# Cloudflare R2 Configuration
R2_ACCOUNT_ID=your_account_id_here
R2_ACCESS_KEY_ID=your_access_key_id
R2_SECRET_ACCESS_KEY=your_secret_access_key
R2_BUCKET_NAME=your-bucket-name
R2_PUBLIC_URL=https://pub-yourid.r2.dev
```

### 2. Dapatkan Public URL

Jika bucket di-public:

```
https://pub-abc123def456.r2.dev
```

Jika private, public URL tidak ada, gunakan presigned URL saja.

## 🧪 Testing R2

### Test Upload via Script

```bash
# Install AWS CLI (opsional, untuk testing)
pip install awscli

# Configure
aws configure --profile r2
# AWS Access Key ID: your_r2_access_key
# AWS Secret Access Key: your_r2_secret_key
# Default region: auto
# Default output: json

# Test upload
aws s3 cp test.txt s3://your-bucket/ \
  --endpoint-url https://your-account-id.r2.cloudflarestorage.com \
  --profile r2
```

### Test via Aplikasi

1. Jalankan aplikasi:
```bash
npm run dev
```

2. Login ke aplikasi
3. Buka Profile page
4. Upload avatar
5. Check browser console untuk URL gambar

## 📁 Struktur Folder di R2

Recommended structure:

```
your-bucket/
├── avatars/
│   └── {user-id}/
│       └── avatar.webp
├── uploads/
│   └── {user-id}/
│       ├── document.pdf
│       └── image.png
└── images/
    └── {user-id}/
        └── photo.webp
```

Sudah diimplementasikan di:
- `src/lib/storage/r2.ts` - function `generateFileKey()`
- `src/routes/api/upload/image/+server.ts`

## 🔒 Security Best Practices

### 1. Restrict CORS (Opsional)

Di bucket settings:
1. Tab **"CORS Policy"**
2. Add policy:
```json
[
  {
    "AllowedOrigins": ["https://yourdomain.com"],
    "AllowedMethods": ["GET", "PUT"],
    "AllowedHeaders": ["*"],
    "MaxAgeSeconds": 3000
  }
]
```

### 2. Lifecycle Rules (Opsional)

Auto-delete old files:
1. Tab **"Lifecycle Rules"**
2. Klik **"Add rule"**
3. Configure:
   - Delete objects after 30 days (contoh untuk temporary files)

### 3. Access Control

- **Jangan** share Access Key dan Secret
- Gunakan **Least Privilege** - hanya permission yang dibutuhkan
- Rotate keys secara berkala

## 💰 Pricing

| Usage | Price |
|-------|-------|
| Storage | $0.015 per GB per month |
| Class A Operations (upload) | $4.50 per million requests |
| Class B Operations (download) | $0.36 per million requests |
| Egress (bandwidth out) | **FREE** 🎉 |

**Free tier:**
- 10 GB storage/month
- 1 million Class A operations
- 10 million Class B operations

## ⚠️ Troubleshooting

### "The Access Key ID you provided does not exist"

**Penyebab:**
- Access Key salah
- Key sudah di-delete
- Key expired (jika set TTL)

**Solusi:**
1. Buat API Token baru di R2 dashboard
2. Copy Access Key ID dan Secret dengan benar

### "NoSuchBucket"

**Penyebab:** Bucket name salah

**Solusi:**
```env
# Salah
R2_BUCKET_NAME=https://pub-xxx.r2.dev

# Benar
R2_BUCKET_NAME=my-bucket-name
```

### "Upload failed: 403 Forbidden"

**Penyebab:** Token tidak punya permission write

**Solusi:**
1. Check API Token permissions
2. Pastikan "Object Read & Write" ✅
3. Pastikan bucket sudah di-select

### "The request signature we calculated does not match"

**Penyebab:** Secret Access Key salah

**Solusi:**
1. Buat token baru
2. Copy Secret Access Key dengan hati-hati (no spaces)

### Image tidak muncul setelah upload

**Penyebab:**
1. Bucket tidak public
2. URL salah

**Solusi:**
1. Check bucket Settings → Public Access
2. Jika private, gunakan presigned URL
3. Check R2_PUBLIC_URL di .env

## 🔗 Resources

- [Cloudflare R2 Documentation](https://developers.cloudflare.com/r2/)
- [R2 Pricing](https://developers.cloudflare.com/r2/pricing/)
- [S3 API Compatibility](https://developers.cloudflare.com/r2/api/s3-api/)

---

**Setelah setup selesai, aplikasi bisa upload file dan images ke R2!** 🎉
