# 🎨 Features Guide

Panduan menggunakan fitur built-in SvelteKit CF Starter.

---

## 🔐 Authentication

Starter kit sudah include authentication lengkap dengan Lucia Auth.

### Fitur Auth yang Tersedia

| Fitur | Status | Endpoint |
|-------|--------|----------|
| Register | ✅ | `/register` |
| Login | ✅ | `/login` |
| Logout | ✅ | `/logout` |
| Google OAuth | ⚙️ Opsional | `/auth/google` |
| Email Verification | ⚙️ Opsional | `/auth/verify-email` |
| Password Reset | ✅ | `/forgot-password` |

### Cara Menggunakan

**Protect Route (Wajib Login):**

```typescript
// routes/dashboard/+page.server.ts
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
  if (!locals.user) {
    throw redirect(303, '/login');
  }
  
  return { user: locals.user };
};
```

**Akses User di Page:**

```svelte
<script>
  export let data;
</script>

<p>Welcome, {data.user.name}!</p>
<p>Email: {data.user.email}</p>
```

**Get Current User di Server:**

```typescript
// Di action atau load
export const actions = {
  createPost: async ({ locals }) => {
    const userId = locals.user?.id; // User ID
    // ...
  }
};
```

---

## 🔌 Google OAuth Setup

### 1. Google Cloud Console

1. Buka [Google Cloud Console](https://console.cloud.google.com)
2. Buat project baru
3. APIs & Services → Credentials
4. Create OAuth 2.0 Client ID
   - Application type: Web application
   - Authorized redirect URIs:
     - Development: `http://localhost:5173/auth/google/callback`
     - Production: `https://yourdomain.com/auth/google/callback`
5. Copy Client ID dan Client Secret

### 2. Update Environment

```bash
# .env
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
```

### 3. Uncomment Code

File yang perlu di-uncomment:
- `src/lib/auth/google.ts` - Uncomment semua
- `src/routes/auth/google/+server.ts` - Uncomment semua
- `src/routes/auth/google/callback/+server.ts` - Uncomment semua

### 4. Test

Buka `/login` dan klik "Login with Google"

---

## 📧 Email Verification dengan Resend

### 1. Setup Resend

1. Daftar di [resend.com](https://resend.com)
2. Verifikasi domain (atau gunakan resend.dev untuk testing)
3. Copy API Key

### 2. Update Environment

```bash
# .env
RESEND_API_TOKEN=re_xxxxxxxxxxxxxxxx
FROM_EMAIL=noreply@yourdomain.com
```

### 3. Uncomment Code

File yang perlu di-uncomment:
- `src/lib/email/resend.ts`
- Email template di `src/lib/email/templates/`
- Email sending di register action

### 4. Update Register Logic

Di `src/routes/register/+page.server.ts`, uncomment bagian:
```typescript
// Kirim email verifikasi
await sendVerificationEmail(user.email, token);
```

---

## 📤 File Upload dengan Cloudflare R2

### 1. Setup R2

1. Cloudflare Dashboard → R2
2. Create bucket
3. Settings → Manage R2 API Tokens
4. Create API Token dengan permission: Object Read & Write

### 2. Update Environment

```bash
# .env
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_BUCKET_NAME=your_bucket_name
R2_PUBLIC_URL=https://pub-xxxxx.r2.dev
```

### 3. Update wrangler.toml

```toml
[[r2_buckets]]
binding = "STORAGE"
bucket_name = "your_bucket_name"
```

### 4. Upload Image

**API Endpoint sudah tersedia:** `POST /api/upload/image`

```svelte
<script>
  let files;
  let uploading = false;
  let imageUrl = '';
  
  async function upload() {
    if (!files?.[0]) return;
    
    uploading = true;
    const formData = new FormData();
    formData.append('file', files[0]);
    formData.append('type', 'avatar'); // atau 'general'
    
    const res = await fetch('/api/upload/image', {
      method: 'POST',
      body: formData
    });
    
    const data = await res.json();
    imageUrl = data.url;
    uploading = false;
  }
</script>

<input type="file" accept="image/*" bind:files />
<button on:click={upload} disabled={uploading}>
  {uploading ? 'Uploading...' : 'Upload'}
</button>

{#if imageUrl}
  <img src={imageUrl} alt="Uploaded" />
{/if}
```

**Fitur Upload Image:**
- Auto convert ke WebP
- Auto resize (max 800px)
- CDN delivery via R2

---

## 👤 Profile Management

Halaman profile sudah tersedia di `/profile` dengan fitur:

- Edit nama, bio, lokasi, website
- Upload avatar
- Change password

### Customize Profile Fields

Edit schema di `drizzle/schema.ts`:

```typescript
export const users = sqliteTable("users", {
  // ... existing fields
  bio: text("bio"),
  location: text("location"),
  website: text("website"),
  // Tambah field baru
  twitter: text("twitter"),
  github: text("github"),
});
```

Update form di `src/routes/profile/+page.svelte`:

```svelte
<label>
  Twitter
  <input name="twitter" value={data.user.twitter ?? ''} />
</label>
```

Update action di `+page.server.ts`:

```typescript
const twitter = form.get('twitter');
// ... validation

await locals.db.update(schema.users)
  .set({ twitter, updatedAt: Date.now() })
  .where(eq(schema.users.id, locals.user.id));
```

---

## 🗄️ Database Schema

### Schema Default

```typescript
// drizzle/schema.ts

// Users table
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  bio: text("bio"),
  location: text("location"),
  website: text("website"),
  passwordHash: text("password_hash"),
  googleId: text("google_id").unique(),
  avatar: text("avatar"),
  emailVerified: integer("email_verified", { mode: "boolean" }),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

// Sessions (Lucia Auth)
export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
});

// Posts (example)
export const posts = sqliteTable("posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  content: text("content"),
  published: integer("published", { mode: "boolean" }).notNull().default(false),
  authorId: text("author_id").references(() => users.id),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});
```

### Tambah Table Baru

1. **Edit schema.ts:**
```typescript
export const todos = sqliteTable("todos", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  completed: integer("completed", { mode: "boolean" }).notNull().default(false),
  userId: text("user_id").notNull().references(() => users.id),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});
```

> 🆕 **Drizzle 0.40**: Syntax tetap sama, tapi ada improvement di type inference dan performance.

2. **Buat migration:**
```bash
npm run db:generate
```

3. **Apply migration:**
```bash
npm run db:migrate:local
```

### Input Validation dengan Zod 4

> 🆕 **Zod 4**: API validation tetap mirip, tapi lebih cepat dan bundle size lebih kecil.

```typescript
import { z } from 'zod';

// Schema validasi
const todoSchema = z.object({
  title: z.string().min(1, 'Title wajib diisi').max(100),
  description: z.string().optional(),
  completed: z.boolean().default(false)
});

// Validasi di form action
export const actions = {
  create: async ({ request, locals }) => {
    const form = await request.formData();
    const data = Object.fromEntries(form);
    
    const result = todoSchema.safeParse(data);
    if (!result.success) {
      return fail(400, { 
        error: result.error.errors[0].message 
      });
    }
    
    // Insert ke database...
  }
};
```

---

## 🎨 UI Components

Starter kit menggunakan **Tailwind CSS 4** dengan tema dark default.

> 🆕 **Tailwind 4**: Konfigurasi sekarang di `src/app.css` menggunakan `@theme`, bukan `tailwind.config.js`.

### Color Palette

```
Background:     bg-neutral-950    (true black)
Surface:        bg-neutral-900    (soft black)
Card:           bg-neutral-900/50 (translucent)
Border:         border-neutral-800

Primary:        text-accent-500   (amber #f59e0b)
Secondary:      text-rose-400     (soft rose)
Success:        text-emerald-400
Error:          text-rose-400

Text Primary:   text-neutral-100
Text Secondary: text-neutral-400
Text Muted:     text-neutral-500
```

### Tailwind 4 Config

Konfigurasi ada di `src/app.css`:

```css
@import "tailwindcss";

@theme {
  /* Colors */
  --color-neutral-50: #fafafa;
  --color-neutral-100: #f5f5f5;
  /* ... */
  --color-accent-500: #f59e0b;
  
  /* Fonts */
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-display: 'Plus Jakarta Sans', sans-serif;
}
```

### Common Patterns

**Card:**
```svelte
<div class="card">
  <h2 class="font-display text-xl font-semibold text-neutral-100">Title</h2>
  <p class="text-neutral-400">Content</p>
</div>
```

**Button Primary:**
```svelte
<button class="btn-primary">
  Submit
</button>
```

**Button Secondary:**
```svelte
<button class="btn-secondary">
  Cancel
</button>
```

**Input:**
```svelte
<input 
  class="input"
  placeholder="Enter text..."
/>
```

> 💡 **Tips**: Starter kit sudah menyediakan class utility di `app.css`: `.card`, `.btn-primary`, `.btn-secondary`, `.input`

---

## 📋 Fitur Checklist

Gunakan checklist ini saat setup project:

```markdown
## Setup Checklist

### Basic (Wajib)
- [ ] Database D1 created
- [ ] Environment variables setup
- [ ] Migration applied
- [ ] Dev server running
- [ ] Register/Login working

### Optional Features
- [ ] Google OAuth setup
- [ ] Email verification (Resend)
- [ ] File upload (R2)
- [ ] Custom domain

### Customization
- [ ] Update brand name/logo
- [ ] Customize color scheme
- [ ] Add required tables
- [ ] Create initial pages
```

---

## 🚀 Next Step: Deployment

Fitur sudah siap? [Deploy ke Cloudflare](./deployment) dalam 10 menit!
