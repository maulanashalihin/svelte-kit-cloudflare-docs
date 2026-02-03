# Performance Optimization Guide

Panduan mengoptimalkan aplikasi SvelteKit Cloudflare untuk performa maksimal.

---

## 🎯 Target Performance

| Metric | Target | Excellent |
|--------|--------|-----------|
| **First Contentful Paint (FCP)** | < 1.5s | < 1s |
| **Largest Contentful Paint (LCP)** | < 2.5s | < 1.5s |
| **Time to First Byte (TTFB)** | < 200ms | < 100ms |
| **Cumulative Layout Shift (CLS)** | < 0.1 | < 0.05 |
| **Bundle Size (initial)** | < 200KB | < 100KB |

---

## ⚡ Edge-Level Optimizations

### 1. Leverage Cloudflare Edge Network

**Yang sudah otomatis:**
- ✅ SSR rendered di edge terdekat dengan user
- ✅ D1 database queries di edge
- ✅ R2 file delivery via global CDN

**Cek edge location:**
```bash
# Response header akan menunjukkan edge location
curl -I https://your-app.pages.dev
# CF-RAY: 8a1b2c3d4e5f6-SIN  ← Singapore edge
```

### 2. Enable Cloudflare Caching

```toml
# wrangler.toml
[site]
bucket = ".svelte-kit/cloudflare"
```

Static assets otomatis di-cache di edge:
- CSS/JS bundles → Cache 1 tahun (hashed filename)
- Images → Cache sesuai headers
- Fonts → Cache 1 tahun

### 3. Database Query Optimization

```typescript
// ✅ GOOD: Select specific columns
const users = await locals.db.select({
  id: users.id,
  name: users.name,
  avatar: users.avatar
}).from(users).limit(20);

// ❌ BAD: Select all columns
const users = await locals.db.select().from(users); // Too much data!
```

**Indexing:**
```sql
-- drizzle/0000_initial.sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_posts_author_id ON posts(author_id);
```

---

## 🖥️ SSR Optimizations

### 1. Streaming SSR (SvelteKit 2.0+)

```svelte
<!-- +page.svelte -->
<script>
  export let data;
  
  // Gunakan Promise untuk streaming
  const userPromise = data.user;
</script>

{#await userPromise}
  <Skeleton /> <!-- Show skeleton immediately -->
{:then user}
  <UserProfile {user} />
{/await}
```

### 2. Parallel Data Loading

```typescript
// ✅ GOOD: Parallel queries
export const load = async ({ locals }) => {
  const [users, posts, stats] = await Promise.all([
    locals.db.query.users.findMany({ limit: 10 }),
    locals.db.query.posts.findMany({ limit: 10 }),
    getDashboardStats(locals.db)
  ]);
  
  return { users, posts, stats };
};

// ❌ BAD: Sequential queries (slower)
export const load = async ({ locals }) => {
  const users = await locals.db.query.users.findMany({ limit: 10 });
  const posts = await locals.db.query.posts.findMany({ limit: 10 }); // Wait for users
  const stats = await getDashboardStats(locals.db); // Wait for posts
  
  return { users, posts, stats };
};
```

### 3. Pagination

```typescript
// +page.server.ts
export const load = async ({ locals, url }) => {
  const page = Number(url.searchParams.get('page')) || 1;
  const limit = 20;
  const offset = (page - 1) * limit;
  
  // Count total untuk pagination
  const [posts, countResult] = await Promise.all([
    locals.db.query.posts.findMany({
      limit,
      offset,
      orderBy: desc(posts.createdAt)
    }),
    locals.db.select({ count: count() }).from(posts)
  ]);
  
  const totalPages = Math.ceil(countResult[0].count / limit);
  
  return { 
    posts, 
    page, 
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1
  };
};
```

---

## 📦 Bundle Size Optimization

### 1. Code Splitting (Automatic)

SvelteKit otomatis code-split per route:

```
build/
├── _app/
│   ├── pages/dashboard.svelte-[hash].js    # Dashboard only
│   ├── pages/profile.svelte-[hash].js      # Profile only
│   └── chunks/vendor-[hash].js             # Shared dependencies
```

### 2. Dynamic Imports

```svelte
<script>
  // Lazy load heavy components
  import { onMount } from 'svelte';
  
  let ChartComponent;
  
  onMount(async () => {
    // Load only when needed
    const module = await import('$lib/components/Chart.svelte');
    ChartComponent = module.default;
  });
</script>

{#if ChartComponent}
  <svelte:component this={ChartComponent} data={chartData} />
{:else}
  <ChartSkeleton />
{/if}
```

### 3. Import Efisien

```typescript
// ✅ GOOD: Import specific functions
import { format, parseISO } from 'date-fns';

// ❌ BAD: Import entire library
import * as dateFns from 'date-fns'; // Bundle lebih besar!
```

### 4. Tree-Shaking Friendly

```typescript
// ✅ GOOD: Side-effect free imports
export { helper1, helper2 } from './helpers';

// ❌ BAD: Import dengan side effects
import './global-styles.css'; // Akan selalu di-include
```

---

## 🖼️ Image Optimization

### 1. WebP Conversion

```typescript
// src/lib/image/convert.ts
export async function convertToWebP(
  file: File, 
  options: { width?: number; quality?: number } = {}
): Promise<Blob> {
  // Auto-convert ke WebP (70% smaller than JPEG)
  // ... implementation
}
```

### 2. Responsive Images

```svelte
<!-- Gunakan srcset untuk responsive images -->
<img 
  src="/image-400.webp"
  srcset="/image-400.webp 400w,
          /image-800.webp 800w,
          /image-1200.webp 1200w"
  sizes="(max-width: 600px) 400px,
         (max-width: 1000px) 800px,
         1200px"
  alt="Description"
  loading="lazy"
/>
```

### 3. Lazy Loading

```svelte
<!-- Below the fold images -->
<img src="/photo.jpg" alt="Photo" loading="lazy" />

<!-- Critical above the fold images -->
<img src="/hero.jpg" alt="Hero" loading="eager" fetchpriority="high" />
```

---

## 🗄️ Database Performance

### 1. Connection Pooling (D1)

D1 sudah handle connection pooling otomatis, tapi tetap:

```typescript
// ✅ GOOD: Batch operations
const newUsers = await locals.db.insert(users).values([
  { name: 'User 1', email: 'user1@example.com' },
  { name: 'User 2', email: 'user2@example.com' },
  { name: 'User 3', email: 'user3@example.com' }
]);

// ❌ BAD: Multiple individual inserts
for (const userData of usersList) {
  await locals.db.insert(users).values(userData); // Slow!
}
```

### 2. Query Optimization

```typescript
// ✅ GOOD: Use relations untuk avoid N+1
const usersWithPosts = await locals.db.query.users.findMany({
  with: {
    posts: {
      limit: 5,
      orderBy: desc(posts.createdAt)
    }
  }
});

// ❌ BAD: N+1 query
const users = await locals.db.query.users.findMany();
for (const user of users) {
  user.posts = await locals.db.query.posts.findMany({
    where: eq(posts.authorId, user.id) // Query per user!
  });
}
```

### 3. Caching Query Results

```typescript
// src/lib/cache.ts
const cache = new Map<string, { data: any; expiry: number }>();

export async function getCached<T>(
  key: string, 
  fetcher: () => Promise<T>, 
  ttl: number = 60000
): Promise<T> {
  const cached = cache.get(key);
  if (cached && cached.expiry > Date.now()) {
    return cached.data;
  }
  
  const data = await fetcher();
  cache.set(key, { data, expiry: Date.now() + ttl });
  return data;
}

// Usage
export const load = async ({ locals }) => {
  const stats = await getCached(
    'dashboard-stats',
    () => getDashboardStats(locals.db),
    5 * 60 * 1000 // Cache 5 menit
  );
  
  return { stats };
};
```

---

## 🌐 Network Optimizations

### 1. HTTP/2 Server Push (via Cloudflare)

```javascript
// hooks.server.ts
export const handle = async ({ event, resolve }) => {
  const response = await resolve(event);
  
  // Cloudflare otomatis optimize HTTP/2
  // No manual config needed
  
  return response;
};
```

### 2. Compression

Cloudflare otomatis compress:
- Gzip/Brotli untuk text assets
- WebP untuk images (jika browser support)

### 3. Preload Critical Resources

```svelte
<!-- +page.svelte -->
<svelte:head>
  <!-- Preload critical font -->
  <link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin />
  
  <!-- Preload critical CSS -->
  <link rel="preload" href="/critical.css" as="style" />
  
  <!-- Preconnect ke external domains -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
</svelte:head>
```

---

## 📊 Monitoring Performance

### 1. Web Vitals

```svelte
<!-- +layout.svelte -->
<script>
  import { onCLS, onFID, onFCP, onLCP, onTTFB } from 'web-vitals';
  
  onMount(() => {
    onCLS(console.log);
    onFID(console.log);
    onFCP(console.log);
    onLCP(console.log);
    onTTFB(console.log);
  });
</script>
```

### 2. Custom Performance Marks

```typescript
// Di server
export const load = async ({ locals }) => {
  performance.mark('db-query-start');
  const users = await locals.db.query.users.findMany();
  performance.mark('db-query-end');
  
  performance.measure('db-query', 'db-query-start', 'db-query-end');
  
  return { users };
};
```

### 3. Cloudflare Analytics

Dashboard Cloudflare Pages memberikan:
- Core Web Vitals
- Traffic analytics
- Error rates
- Performance by edge location

---

## 🔧 Build Optimizations

### 1. Production Build

```bash
# Always use production build untuk deploy
npm run build

# Preview locally
npm run preview
```

### 2. Analyze Bundle

```bash
# Analyze bundle size
npx vite-bundle-visualizer

# Check for duplicates
npx depcheck
```

### 3. Environment Variables

```javascript
// ✅ GOOD: Build-time constants
declare const __BUILD_TIME__: string;

// ❌ BAD: Runtime checks
const isDev = process.env.NODE_ENV === 'development';
if (isDev) { /* dead code in production */ }
```

---

## ✅ Performance Checklist

### Before Launch
- [ ] Run Lighthouse audit (target: 90+ all categories)
- [ ] Test TTFB dari berbagai lokasi (https://www.webpagetest.org)
- [ ] Verify images converted to WebP
- [ ] Check bundle size di dev tools
- [ ] Test mobile performance (4G throttling)
- [ ] Verify proper caching headers

### Ongoing
- [ ] Monitor Core Web Vitals di Search Console
- [ ] Check D1 query performance
- [ ] Review error rates di Cloudflare Analytics
- [ ] Test di slow devices

---

## 📚 Resources

- [Web Vitals](https://web.dev/vitals/)
- [SvelteKit Performance](https://kit.svelte.dev/docs/performance)
- [Cloudflare Speed](https://www.cloudflare.com/learning/performance/)
- [Drizzle Performance](https://orm.drizzle.team/docs/performance)
