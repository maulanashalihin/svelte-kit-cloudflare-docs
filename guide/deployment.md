# 🚀 Deployment Guide

Deploy aplikasi SvelteKit ke Cloudflare Pages dalam 10 menit.

---

## 🎯 Overview

Cloudflare Pages adalah hosting static + edge functions yang:
- ✅ **Gratis** - Unlimited requests, 500 builds/month
- ✅ **Global CDN** - 300+ lokasi edge
- ✅ **Edge Functions** - SvelteKit SSR berjalan di edge
- ✅ **D1 Integration** - Database langsung terhubung

---

## 📋 Pre-Deployment Checklist

Sebelum deploy, pastikan:

```markdown
- [ ] npm run build berhasil locally
- [ ] npm run preview berjalan tanpa error
- [ ] Database D1 sudah dibuat di Cloudflare
- [ ] Environment variables sudah disiapkan
- [ ] wrangler.toml sudah benar
```

---

## 🚀 Deployment Steps

### Step 1: Build Project (1 menit)

```bash
# Build untuk production
npm run build
```

**Output:**
```
.svelte-kit/cloudflare/  ← Build output
```

### Step 2: Deploy (1 menit)

```bash
# Deploy ke Cloudflare Pages
npm run deploy
```

**Output:**
```
✨ Successfully published your script to:
https://my-app.pages.dev
```

🎉 **Selesai!** Aplikasi sudah online!

---

## ⚙️ Environment Variables Production

Environment variables di Cloudflare Pages diatur via Dashboard (bukan .env).

### Cara Set Environment Variables:

1. Buka [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Pages → Pilih project kamu
3. Settings → Environment variables
4. Add variables:

**Required:**
```
RESEND_API_TOKEN=re_xxxxxxxx
FROM_EMAIL=noreply@yourdomain.com
```

**Untuk R2 (jika pakai file upload):**
```
R2_ACCOUNT_ID=xxx
R2_ACCESS_KEY_ID=xxx
R2_SECRET_ACCESS_KEY=xxx
R2_BUCKET_NAME=xxx
R2_PUBLIC_URL=https://pub-xxxxx.r2.dev
```

**Untuk Google OAuth:**
```
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
```

### Production Database

Database D1 sudah otomatis terhubung via `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "my-app-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

---

## 🗄️ Production Database Migration

### Apply Migration ke Production

```bash
# Apply migration ke D1 production
npm run db:migrate
```

**Atau via Wrangler:**
```bash
npx wrangler d1 migrations apply DB --remote
```

### Verify Production DB

```bash
# Check tables di production
npx wrangler d1 execute DB --remote --command ".tables"
```

---

## 🌐 Custom Domain

### Setup Custom Domain

1. Dashboard → Pages → Project → Custom domains
2. Click "Set up a custom domain"
3. Enter domain: `yourdomain.com`
4. Follow DNS setup instructions

### DNS Configuration

Tambahkan DNS records di domain provider:

```
Type: CNAME
Name: www
Target: my-app.pages.dev
```

Atau untuk apex domain:

```
Type: A
Name: @
Target: 192.0.2.1  (Cloudflare akan provide)
```

---

## 📋 Production Checklist

```markdown
## Pre-Launch Checklist

### Security
- [ ] Environment variables di-set di Cloudflare Dashboard
- [ ] Tidak ada secret di codebase
- [ ] HTTPS enabled (otomatis di Cloudflare)

### Database
- [ ] Migration applied ke production
- [ ] Seed data (jika perlu)
- [ ] Backup strategy (export periodically)

### Features
- [ ] Register/Login working
- [ ] OAuth callback URL updated (production)
- [ ] Email sending working (if used)
- [ ] File upload working (if used)

### Monitoring
- [ ] Analytics enabled
- [ ] Error tracking setup (optional)
```

---

## 🔧 Troubleshooting Deployment

### Error: "D1 binding not found"

**Cause:** Database ID salah atau binding tidak terdeteksi.

**Fix:**
```bash
# Check database_id
npx wrangler d1 list

# Update wrangler.toml dengan ID yang benar
```

### Error: "Build failed"

**Check:**
```bash
# Build locally dulu
npm run build

# Check error message
```

Common issues:
- TypeScript errors → Run `npm run check`
- Missing imports → Check case sensitivity
- Environment variables → Pastikan semua required vars di-set

### Error: "Function exceeds size limit"

**Cause:** Bundle size terlalu besar.

**Fix:**
```javascript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      external: ['some-heavy-package']
    }
  }
});
```

### Error: "Database migration failed"

**Fix:**
```bash
# Check current migrations status
npx wrangler d1 migrations list DB --remote

# Apply manual
npx wrangler d1 execute DB --remote --file=./drizzle/0001_patch.sql
```

---

## 🔄 Continuous Deployment

### Git Integration

Cloudflare Pages bisa auto-deploy dari GitHub/GitLab:

1. Dashboard → Pages → Create a project
2. Connect to Git
3. Select repository
4. Build settings:
   - Build command: `npm run build`
   - Build output: `.svelte-kit/cloudflare`
5. Environment variables → Add semua variables

### Deploy Hooks

Untuk trigger deploy dari external:

1. Pages → Project → Settings → Build & deployments
2. Deploy hooks → Create deploy hook
3. Gunakan URL untuk trigger deploy:

```bash
curl -X POST https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/xxxxx
```

---

## 📊 Monitoring

### Cloudflare Analytics

Dashboard → Pages → Project → Analytics

Metrics yang tersedia:
- Total requests
- Bandwidth usage
- Build duration
- Error rate

### Custom Analytics (Optional)

Tambahkan tracking script:

```svelte
<!-- src/routes/+layout.svelte -->
<svelte:head>
  <!-- Google Analytics, Plausible, dll -->
</svelte:head>
```

---

## 🎯 Production Best Practices

### 1. Environment Variables
- Jangan commit `.env`
- Gunakan Cloudflare Dashboard untuk production secrets
- Different values untuk dev vs production

### 2. Database
- Always backup sebelum migration besar
- Test migration di local dulu
- Gunakan transactions untuk data integrity

### 3. Performance
- Enable Cloudflare caching
- Optimize images (WebP, responsive)
- Minimize JavaScript bundle

### 4. Security
- HTTPS only (otomatis di Cloudflare)
- Security headers di `hooks.server.ts`:

```typescript
// src/hooks.server.ts
export const handle = async ({ event, resolve }) => {
  const response = await resolve(event);
  
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  return response;
};
```

---

## 🎉 Deployment Complete!

Aplikasi kamu sekarang:
- ✅ Live di internet
- ✅ Dihost di 300+ edge locations
- ✅ Dapat HTTPS otomatis
- ✅ Scalable tanpa batas

### What's Next?

- [Custom Domain](./deployment#custom-domain) - Gunakan domain sendiri
- [Monitoring](./deployment#monitoring) - Track performance
- [AI-First Development](./ai-first-development) - Build fitur baru dengan AI

---

**Selamat! 🚀** Aplikasi sudah live!
