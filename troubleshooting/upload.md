# Troubleshooting: File Upload Issues

Solusi untuk masalah upload avatar, gambar, dan file ke Cloudflare R2.

---

## 🔴 Error: "Upload failed" atau 413 Payload Too Large

### Penyebab
File terlalu besar (limit default: 5MB untuk avatar).

### Solusi

#### 1. Check File Size Limit

```typescript
// src/routes/api/upload/image/+server.ts
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export const POST = async ({ request }) => {
  const form = await request.formData();
  const file = form.get('file') as File;
  
  if (file.size > MAX_SIZE) {
    return json(
      { error: 'File terlalu besar. Maksimal 5MB.' }, 
      { status: 413 }
    );
  }
  // ...
};
```

#### 2. Compress Image Sebelum Upload

```typescript
// Client-side compression
async function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    img.onload = () => {
      // Resize jika terlalu besar
      const maxWidth = 1200;
      const scale = Math.min(1, maxWidth / img.width);
      
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob(
        (blob) => blob ? resolve(blob) : reject('Failed'),
        'image/webp',
        0.85 // Quality
      );
    };
    
    img.src = URL.createObjectURL(file);
  });
}
```

#### 3. Use Presigned URL untuk File Besar

```typescript
// Upload langsung ke R2 untuk file besar (>5MB)
const res = await fetch('/api/upload/presign', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    filename: 'large-file.pdf',
    contentType: 'application/pdf'
  })
});

const { uploadUrl } = await res.json();

// Upload langsung ke R2
await fetch(uploadUrl, {
  method: 'PUT',
  body: file,
  headers: { 'Content-Type': 'application/pdf' }
});
```

---

## 🔴 Error: "Invalid file type"

### Penyebab
File type tidak diizinkan atau tidak terdeteksi dengan benar.

### Solusi

#### 1. Check Allowed Types

```typescript
// src/routes/api/upload/image/+server.ts
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png', 
  'image/webp',
  'image/gif'
];

export const POST = async ({ request }) => {
  const file = form.get('file') as File;
  
  if (!ALLOWED_TYPES.includes(file.type)) {
    return json(
      { error: `Tipe file ${file.type} tidak diizinkan` },
      { status: 400 }
    );
  }
  // ...
};
```

#### 2. Validate dengan Magic Numbers

File type bisa di-spoof. Validate dengan file signature:

```typescript
async function validateFileType(file: File): Promise<boolean> {
  const buffer = await file.slice(0, 4).arrayBuffer();
  const bytes = new Uint8Array(buffer);
  
  // JPEG: FF D8 FF
  if (bytes[0] === 0xFF && bytes[1] === 0xD8) {
    return true;
  }
  
  // PNG: 89 50 4E 47
  if (bytes[0] === 0x89 && bytes[1] === 0x50) {
    return true;
  }
  
  // WebP: 52 49 46 46 (RIFF header)
  if (bytes[0] === 0x52 && bytes[1] === 0x49) {
    return true;
  }
  
  return false;
}
```

---

## 🔴 Error: "R2 binding not found"

### Penyebab
Binding R2 tidak terkonfigurasi dengan benar.

### Solusi

#### 1. Check wrangler.toml

```toml
[[r2_buckets]]
binding = "STORAGE"  # Nama binding yang digunakan di code
bucket_name = "your-bucket-name"
```

#### 2. Dashboard Binding

1. Buka Cloudflare Dashboard → Pages → Your Project
2. Settings → R2 Buckets
3. Add Binding:
   - Variable name: `STORAGE`
   - R2 bucket: Select your bucket

#### 3. Test R2 Access

```typescript
// Test endpoint
export const GET = async ({ platform }) => {
  try {
    const objects = await platform.env.STORAGE.list();
    return json({ buckets: objects.objects.map(o => o.key) });
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
};
```

---

## 🔴 Error: "Presigned URL expired"

### Penyebab
Presigned URL hanya valid untuk waktu terbatas (default: 5 menit).

### Solusi

#### 1. Generate URL sebelum Upload

```typescript
// Generate presigned URL just-in-time
const getPresignedUrl = async (filename: string) => {
  const res = await fetch('/api/upload/presign', {
    method: 'POST',
    body: JSON.stringify({ filename })
  });
  
  const { uploadUrl } = await res.json();
  
  // Upload segera
  await fetch(uploadUrl, {
    method: 'PUT',
    body: file
  });
};
```

#### 2. Extend Expiry Time (jika perlu)

```typescript
// src/lib/storage/r2.ts
export async function generatePresignedUrl(
  filename: string,
  expiresIn: number = 15 * 60 // 15 menit
) {
  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: filename,
    ContentType: 'application/octet-stream'
  });
  
  return getSignedUrl(s3Client, command, { expiresIn });
}
```

---

## 🔴 Image Tidak Ter-load setelah Upload

### Penyebab & Solusi

#### 1. Check R2 Public URL

```typescript
// Pastikan R2_PUBLIC_URL di .env
R2_PUBLIC_URL=https://pub-yourid.r2.dev
```

#### 2. Object Access Control

```typescript
// Pastikan object public
await platform.env.STORAGE.put(filename, file, {
  httpMetadata: {
    contentType: file.type,
    cacheControl: 'public, max-age=31536000'
  }
});
```

#### 3. CORS Configuration

```json
// R2 Bucket CORS Rules
[
  {
    "AllowedOrigins": ["https://yourdomain.com"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedHeaders": ["*"],
    "MaxAgeSeconds": 3600
  }
]
```

---

## 🔴 Upload Progress Tidak Muncul

### Solusi: Implementasi dengan XMLHttpRequest

```svelte
<script>
  let progress = 0;
  let uploading = false;
  
  async function uploadWithProgress(file: File) {
    uploading = true;
    progress = 0;
    
    const xhr = new XMLHttpRequest();
    
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        progress = Math.round((e.loaded / e.total) * 100);
      }
    };
    
    return new Promise((resolve, reject) => {
      xhr.onload = () => resolve(xhr.response);
      xhr.onerror = reject;
      
      xhr.open('POST', '/api/upload/image');
      const formData = new FormData();
      formData.append('file', file);
      xhr.send(formData);
    });
  }
</script>

{#if uploading}
  <div class="progress-bar">
    <div class="progress" style="width: {progress}%"></div>
  </div>
  <p>{progress}%</p>
{/if}
```

---

## 🔴 WebP Conversion Failed

### Penyebab
Browser tidak support WebP atau conversion error.

### Solusi: Fallback

```typescript
async function convertToWebP(file: File): Promise<Blob> {
  // Check WebP support
  const hasWebPSupport = document
    .createElement('canvas')
    .toDataURL('image/webp')
    .startsWith('data:image/webp');
  
  if (!hasWebPSupport) {
    // Return original jika tidak support
    return file;
  }
  
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
    
    canvas.width = img.width;
    canvas.height = img.height;
    ctx?.drawImage(img, 0, 0);
    
    const webpBlob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => blob ? resolve(blob) : reject('Conversion failed'),
        'image/webp',
        0.85
      );
    });
    
    return webpBlob;
  } catch (error) {
    console.error('WebP conversion failed:', error);
    return file; // Fallback to original
  }
}
```

---

## 🔴 Multiple File Upload Issues

### Solusi: Queue Upload

```svelte
<script>
  let files: File[] = [];
  let uploadQueue = [];
  
  async function uploadMultiple(files: File[]) {
    uploadQueue = files.map(file => ({
      file,
      status: 'pending',
      progress: 0
    }));
    
    // Upload sequentially atau parallel dengan limit
    const CONCURRENT_UPLOADS = 3;
    
    for (let i = 0; i < uploadQueue.length; i += CONCURRENT_UPLOADS) {
      const batch = uploadQueue.slice(i, i + CONCURRENT_UPLOADS);
      
      await Promise.all(
        batch.map(item => uploadFile(item))
      );
    }
  }
  
  async function uploadFile(item) {
    item.status = 'uploading';
    
    try {
      const formData = new FormData();
      formData.append('file', item.file);
      
      const res = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData
      });
      
      if (!res.ok) throw new Error('Upload failed');
      
      item.status = 'completed';
    } catch (error) {
      item.status = 'error';
    }
  }
</script>
```

---

## 🔧 Debug Upload

### Test Upload dengan cURL

```bash
# Test image upload
curl -X POST http://localhost:5173/api/upload/image \
  -F "file=@test-image.jpg" \
  -F "type=avatar"

# Test dengan cookies (authenticated)
curl -X POST http://localhost:5173/api/upload/image \
  -b cookies.txt \
  -F "file=@test-image.jpg"
```

### Check R2 Bucket Contents

```bash
# List objects
npx wrangler r2 object list your-bucket-name

# Check specific object
npx wrangler r2 object get your-bucket-name uploads/avatar-xxx.webp
```

---

## 🆘 Quick Fixes

### Clear Upload Errors

```svelte
<script>
  let error = null;
  
  function clearError() {
    error = null;
  }
  
  async function handleUpload(file: File) {
    try {
      error = null;
      await uploadFile(file);
    } catch (e) {
      error = e.message;
    }
  }
</script>

{#if error}
  <div class="error">
    {error}
    <button on:click={clearError}>Coba Lagi</button>
  </div>
{/if}
```

---

## 📚 Resources

- [Cloudflare R2 Docs](https://developers.cloudflare.com/r2/)
- [S3 Presigned URLs](https://docs.aws.amazon.com/AmazonS3/latest/userguide/PresignedUrlUploadObject.html)
- [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [FormData API](https://developer.mozilla.org/en-US/docs/Web/API/FormData)
