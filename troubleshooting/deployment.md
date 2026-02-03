# Troubleshooting: Deployment Issues

Solusi untuk masalah deployment ke Cloudflare Pages.

---

## 🔴 Build Error

### Gejala: "Cannot find module"

**Error:**
```
Error: Cannot find module '$lib/db/schema'
```

**Solusi:**

1. Check path alias di `svelte.config.js`:
```javascript
// svelte.config.js
import path from 'path';

const config = {
  kit: {
    alias: {
      $lib: path.resolve('./src/lib'),
      $components: path.resolve('./src/components')
    }
  }
};
```

2. Pastikan import path benar:
```typescript
// ✅ Correct
import { users } from '$lib/db/schema';

// ❌ Wrong (relative path di build bisa bermasalah)
import { users } from '../../../lib/db/schema';
```

### Gejala: "D1 binding not found" di Production

**Error:**
```
Error: D1 binding not found in production
```

**Solusi:**

1. **Check wrangler.toml:**
```toml
[[d1_databases]]
binding = "DB"
database_name = "my-app-db"
database_id = "your-database-id"
```

2. **Bind database di Cloudflare Dashboard:**
   - Buka Cloudflare Dashboard → Pages → Your Project
   - Settings → Functions
   - D1 Database Bindings
   - Add binding: Variable name = `DB`, Database = your database

3. **Redeploy:**
```bash
npm run deploy
```

---

## 🔴 Environment Variables Not Found

### Gejala: "process.env.X is not defined"

**Solusi:**

#### 1. Local Development

Pastikan `.env` file ada dan ter-load:
```bash
# .env
CLOUDFLARE_ACCOUNT_ID=xxx
RESEND_API_TOKEN=xxx
```

#### 2. Production

**Environment Variables di Cloudflare Pages:**

1. Dashboard → Pages → Your Project
2. Settings → Environment Variables
3. Add Variables:
   - `RESEND_API_TOKEN`
   - `R2_ACCOUNT_ID`
   - `R2_ACCESS_KEY_ID`
   - `R2_SECRET_ACCESS_KEY`
   - etc.

#### 3. Preview Deployments

Jangan lupa set variables untuk **Preview** juga:
- Dashboard → Settings → Environment Variables
- Add variable → Select "Preview" environment

#### 4. Secrets vs Variables

```bash
# Variables (non-sensitive) - di-set di dashboard atau wrangler.toml
[vars]
APP_NAME = "My App"

# Secrets (sensitive) - di-set via wrangler CLI
npx wrangler secret put RESEND_API_TOKEN
```

---

## 🔴 Deployment Stuck atau Timeout

### Gejala
Build berjalan lama atau timeout.

### Solusi

#### 1. Check Build Output Size

```bash
npm run build
ls -la .svelte-kit/cloudflare/
```

Jika terlalu besar:
- Hapus unused dependencies
- Gunakan dynamic imports
- Optimize images

#### 2. Increase Build Timeout

Cloudflare Pages default timeout: 20 menit

Jika masih timeout, check:
- Dead loops di code
- Recursive dependencies
- Infinite redirects

#### 3. Check Build Logs

```bash
# Local build
npm run build 2>&1 | tee build.log

# Check errors
grep -i "error" build.log
```

---

## 🔴 Custom Domain Issues

### Gejala: "DNS_PROBE_FINISHED_NXDOMAIN"

**Solusi:**

1. **Add Domain di Cloudflare:**
   - Dashboard → Pages → Your Project
   - Custom Domains → Add Domain
   - Ikuti instruksi DNS

2. **DNS Configuration:**
   ```
   Type: CNAME
   Name: www atau @ (root)
   Target: your-app.pages.dev
   ```

3. **Wait DNS Propagation:**
   - Bisa memakan waktu 24-48 jam
   - Check dengan: `dig www.yourdomain.com`

### Gejala: SSL/TLS Error

**Solusi:**

1. **SSL Mode:**
   - Dashboard → SSL/TLS
   - Mode: **Full (strict)**

2. **Always Use HTTPS:**
   - Dashboard → SSL/TLS → Edge Certificates
   - Enable "Always Use HTTPS"

---

## 🔴 Functions Not Working

### Gejala: API endpoints return 404

**Solusi:**

1. **Check Functions Setup:**
```toml
# wrangler.toml
[site]
bucket = ".svelte-kit/cloudflare"
```

2. **Verify Functions Directory:**
```
.svelte-kit/cloudflare/
├── _routes.json      # Harus ada
├── _worker.js        # Entry point
└── ...
```

3. **Routes Configuration:**
```json
// _routes.json
{
  "version": 1,
  "include": ["/*"],
  "exclude": ["/assets/*"]
}
```

---

## 🔴 R2 Bucket Not Accessible

### Gejala: "R2 binding not found"

**Solusi:**

1. **wrangler.toml:**
```toml
[[r2_buckets]]
binding = "STORAGE"
bucket_name = "your-bucket-name"
```

2. **Dashboard Binding:**
   - Pages → Your Project → Settings → R2 Buckets
   - Add binding: Variable name = `STORAGE`

3. **Cors Configuration:**
```json
[
  {
    "AllowedOrigins": ["https://yourdomain.com"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag"]
  }
]
```

---

## 🔴 Redirect Loop

### Gejala: "Too many redirects"

**Penyebab:**
- HTTP → HTTPS redirect
- www → non-www redirect
- Trailing slash redirect

**Solusi:**

```typescript
// src/hooks.server.ts
export const handle = async ({ event, resolve }) => {
  // Normalisasi URL
  const url = event.url;
  
  // Handle www redirect
  if (url.hostname === 'www.yourdomain.com') {
    throw redirect(301, `https://yourdomain.com${url.pathname}`);
  }
  
  // Handle trailing slash (consistent)
  if (url.pathname.length > 1 && url.pathname.endsWith('/')) {
    throw redirect(301, url.pathname.slice(0, -1));
  }
  
  return resolve(event);
};
```

---

## 🔴 Cache Issues

### Gejala: Perubahan tidak terlihat setelah deploy

**Solusi:**

1. **Purge Cache:**
   - Dashboard → Caching → Configuration
   - Purge Everything

2. **Version your assets:**
```javascript
// vite.config.ts
export default {
  build: {
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        entryFileNames: 'js/[name]-[hash].js',
        chunkFileNames: 'js/[name]-[hash].js',
        assetFileNames: ({name}) => {
          if (/\.css$/.test(name ?? '')) {
            return 'css/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        }
      }
    }
  }
};
```

3. **Cache Headers:**
```typescript
// src/hooks.server.ts
export const handle = async ({ event, resolve }) => {
  const response = await resolve(event);
  
  // Cache static assets
  if (event.url.pathname.startsWith('/assets/')) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  }
  
  return response;
};
```

---

## 🔴 Build Warnings

### "Using @sveltejs/adapter-auto"

**Solusi:**
```javascript
// svelte.config.js
import adapter from '@sveltejs/adapter-cloudflare';

export default {
  kit: {
    adapter: adapter({
      routes: {
        include: ['/*'],
        exclude: ['<all>']
      }
    })
  }
};
```

### "Multiple chunks emit assets"

Ini normal, bukan error. Cloudflare Pages handle ini otomatis.

---

## 🔧 Debug Deployment

### Local Production Build

```bash
# Build untuk production
npm run build

# Preview locally
npm run preview

# Test functions
npx wrangler pages dev .svelte-kit/cloudflare
```

### Check Build Output

```bash
# Analyze bundle
npx vite-bundle-visualizer

# Check build size
du -sh .svelte-kit/cloudflare/

# List all files
find .svelte-kit/cloudflare -type f | wc -l
```

### Cloudflare Logs

**Realtime Logs:**
```bash
# Tail logs dari deployment
npx wrangler tail
```

**Dashboard Logs:**
- Pages → Your Project → Functions
- View logs untuk melihat errors

---

## 🆘 Emergency Rollback

### Rollback ke Previous Deployment

1. Dashboard → Pages → Your Project
2. Deployments tab
3. Find previous working deployment
4. Click "Rollback to this deployment"

### Quick Fix Deploy

```bash
# Hotfix branch
git checkout -b hotfix
# Fix issue
git commit -am "Hotfix"
git push origin hotfix

# Deploy dari hotfix
npx wrangler deploy
```

---

## 📚 Resources

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [SvelteKit Adapter Cloudflare](https://kit.svelte.dev/docs/adapter-cloudflare)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)
- [Cloudflare Status](https://www.cloudflarestatus.com/)
