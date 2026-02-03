# 🌊 Development Flow

Pahami pola development dengan SvelteKit agar coding lebih nyaman dan AI-friendly.

---

## 🎯 Konsep Dasar

SvelteKit menggunakan **file-based routing** dan **server-first architecture**. Ini artinya:

1. **File = Route** - Setiap file di `src/routes/` menjadi halaman
2. **Server Default** - Data di-load di server, bukan client
3. **Progressive Enhancement** - Form work tanpa JavaScript

> 🆕 **Svelte 5 Runes**: Project ini menggunakan Svelte 5 dengan **Runes** untuk reactivity.
> 
> **Perbedaan utama Svelte 4 → 5:**
> - `export let data` → `let { data } = $props()`
> - `let count = 0` → `let count = $state(0)`
> - `on:click` → `onclick`
> - `$:` reactive statements → `$derived()` dan `$effect()`

---

## 📁 Struktur File

```
src/routes/
├── +layout.svelte          # Layout utama (navbar, dll)
├── +page.svelte            # Home page (/)
├── +page.server.ts         # Server code untuk home
│
├── login/
│   ├── +page.svelte        # Login page (/login)
│   └── +page.server.ts     # Login logic
│
├── dashboard/
│   ├── +page.svelte        # Dashboard page (/dashboard)
│   └── +page.server.ts     # Load data user
│
└── api/
    └── users/
        └── +server.ts      # API endpoint (/api/users)
```

**Aturan penamaan:**
- `+page.svelte` = UI halaman
- `+page.server.ts` = Server code (load data, form actions)
- `+layout.svelte` = Wrapper layout
- `+server.ts` = API endpoint

> 🆕 **Svelte 5**: Project ini menggunakan Svelte 5 dengan **Runes** (`$state`, `$derived`, `$effect`).
> Lihat [Svelte 5 Docs](https://svelte.dev/docs/svelte/what-are-runes) untuk detail.

---

## 🔄 Data Flow Patterns

### Pattern 1: Server Load (Paling Umum)

Gunakan untuk: Menampilkan data dari database

```typescript
// routes/dashboard/+page.server.ts
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  // Query database langsung di server
  const user = await locals.db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, locals.user.id)
  });
  
  const posts = await locals.db.query.posts.findMany({
    where: (posts, { eq }) => eq(posts.authorId, locals.user.id)
  });
  
  // Return data - otomatis tersedia di page
  return { user, posts };
};
```

```svelte
<!-- routes/dashboard/+page.svelte -->
<script>
  // Svelte 5: Data otomatis masuk dari +page.server.ts
  let { data } = $props();
</script>

<h1>Welcome, {data.user.name}!</h1>

{#each data.posts as post}
  <article>
    <h2>{post.title}</h2>
    <p>{post.content}</p>
  </article>
{/each}
```

> 💡 **Svelte 5**: Gunakan `$props()` untuk menerima data dari server. Ini menggantikan `export let data` di Svelte 4.

**Flow:**
```
User Request → Server Query DB → Render HTML → Browser
                                    ↓
                              (data sudah ada,
                               no loading state!)
```

✅ **Keuntungan:**
- 1 request only
- SEO friendly
- No loading spinner
- Type-safe

---

### Pattern 2: Form Actions (Untuk Mutations)

Gunakan untuk: Create, Update, Delete data

```typescript
// routes/posts/new/+page.server.ts
import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';

export const actions: Actions = {
  create: async ({ request, locals }) => {
    // 1. Get form data
    const form = await request.formData();
    const title = form.get('title');
    const content = form.get('content');
    
    // 2. Validate
    if (!title || typeof title !== 'string') {
      return fail(400, { 
        error: 'Title is required',
        values: { title, content }
      });
    }
    
    // 3. Insert to database
    const id = crypto.randomUUID();
    await locals.db.insert(schema.posts).values({
      id,
      title,
      content,
      authorId: locals.user.id,
      createdAt: Date.now()
    });
    
    // 4. Redirect
    throw redirect(303, `/posts/${id}`);
  }
};
```

```svelte
<!-- routes/posts/new/+page.svelte -->
<script>
  // Svelte 5: Form data dari action
  let { form } = $props();
  
  import { enhance } from '$app/forms';
</script>

<form method="POST" action="?/create" use:enhance>
  {#if form?.error}
    <div class="error">{form.error}</div>
  {/if}
  
  <label>
    Title
    <input 
      name="title" 
      value={form?.values?.title ?? ''}
      required 
    />
  </label>
  
  <label>
    Content
    <textarea name="content">{form?.values?.content ?? ''}</textarea>
  </label>
  
  <button type="submit">Create Post</button>
</form>
```

> 💡 **Svelte 5**: Form actions tetap sama, hanya cara menerima props yang berubah dengan `$props()`.

**Flow:**
```
Form Submit → Server Action → Validate → DB Insert → Redirect
                 ↓
            (Works tanpa JS!)
```

✅ **Keuntungan:**
- Works tanpa JavaScript
- No API endpoint needed
- Progressive enhancement

---

### Pattern 3: API Endpoints (Sekadarnya)

Gunakan untuk: External API, real-time updates, atau client-side fetch

```typescript
// routes/api/posts/+server.ts
import type { RequestHandler } from './$types';
import { json, error } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ locals, url }) => {
  const limit = parseInt(url.searchParams.get('limit') ?? '10');
  
  const posts = await locals.db.query.posts.findMany({
    limit,
    orderBy: (posts, { desc }) => desc(posts.createdAt)
  });
  
  return json({ posts });
};

export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) {
    throw error(401, 'Unauthorized');
  }
  
  const body = await request.json();
  
  // ... validate and insert
  
  return json({ success: true, id }, { status: 201 });
};
```

```svelte
<!-- Fetch dari client -->
<script>
  import { onMount } from 'svelte';
  
  // Svelte 5: Gunakan $state untuk reactive data
  let posts = $state([]);
  
  onMount(async () => {
    const res = await fetch('/api/posts?limit=5');
    const data = await res.json();
    posts = data.posts;
  });
</script>
```

> 💡 **Svelte 5**: Gunakan `$state()` untuk variabel reactive. Ini menggantikan `let` biasa yang perlu assignment untuk trigger reactivity.

⚠️ **Gunakan pattern ini jika:**
- External service perlu akses data
- Real-time updates (polling)
- Client-side only data

---

## 🗄️ Database Access

### Setup Database

Database di-inject ke `locals` via hooks:

```typescript
// src/hooks.server.ts
import { drizzle } from 'drizzle-orm/d1';
import * as schema from '$lib/db/schema';

export const handle = async ({ event, resolve }) => {
  // Inject DB ke locals
  if (event.platform?.env?.DB) {
    event.locals.db = drizzle(event.platform.env.DB, { schema });
  }
  
  // ... auth handling
  
  return resolve(event);
};
```

### Query Patterns

```typescript
// SELECT all
const users = await locals.db.query.users.findMany();

// SELECT with WHERE
const user = await locals.db.query.users.findFirst({
  where: (users, { eq }) => eq(users.id, userId)
});

// SELECT with relations
const postsWithAuthor = await locals.db.query.posts.findMany({
  with: {
    author: true  // Auto-join dengan users
  }
});

// INSERT
await locals.db.insert(schema.posts).values({
  id: crypto.randomUUID(),
  title: 'Hello',
  content: 'World',
  createdAt: Date.now()
});

// UPDATE
await locals.db.update(schema.posts)
  .set({ title: 'Updated', updatedAt: Date.now() })
  .where(eq(schema.posts.id, postId));

// DELETE
await locals.db.delete(schema.posts)
  .where(eq(schema.posts.id, postId));
```

---

## 🔐 Authentication Flow

### Check Auth di Server

```typescript
// routes/protected/+page.server.ts
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
  // Check auth
  if (!locals.user) {
    throw redirect(303, '/login');
  }
  
  // User tersedia di locals
  return { user: locals.user };
};
```

### Check Auth di Page

```svelte
<script>
  import { page } from '$app/state';
</script>

{#if page.data.user}
  <p>Welcome, {page.data.user.name}!</p>
{:else}
  <a href="/login">Login</a>
{/if}
```

> 💡 **Svelte 5**: `$app/stores` diganti dengan `$app/state`. Tidak perlu `$` prefix lagi untuk access state.

---

## 📋 Checklist Membuat Fitur Baru

Gunakan checklist ini untuk setiap fitur baru:

```markdown
## Fitur: [Nama Fitur]

### Database
- [ ] Tambah schema di drizzle/schema.ts
- [ ] Buat migration file
- [ ] Apply migration: npm run db:migrate:local

### Backend
- [ ] Buat +page.server.ts dengan load()
- [ ] Tambah form actions (jika perlu)
- [ ] Validasi input dengan Zod

### Frontend
- [ ] Buat +page.svelte dengan form
- [ ] Gunakan use:enhance untuk UX
- [ ] Handle error states
- [ ] Styling dengan Tailwind

### Testing
- [ ] Test happy path
- [ ] Test error cases
- [ ] Test tanpa JavaScript (optional)
```

---

## 🎯 Decision Tree: Pattern Mana yang Dipakai?

```
Mau buat apa?
│
├─► Menampilkan data dari DB
│   └─► Gunakan: Server Load (+page.server.ts load)
│
├─► Form (Create/Update/Delete)
│   └─► Gunakan: Form Actions (+page.server.ts actions)
│
├─► API untuk external service
│   └─► Gunakan: API Endpoint (+server.ts)
│
└─► Real-time/Client-only data
    └─► Gunakan: Client Fetch + API Endpoint
```

---

## 🎨 Styling dengan Tailwind CSS 4

Project ini menggunakan **Tailwind CSS 4** dengan konfigurasi CSS-first:

### Config di `src/app.css` (Bukan `tailwind.config.js`)

```css
@import "tailwindcss";

@theme {
  /* Define colors */
  --color-neutral-50: #fafafa;
  --color-neutral-950: #0a0a0a;
  --color-accent-500: #f59e0b;
  
  /* Define fonts */
  --font-sans: 'Inter', system-ui, sans-serif;
  
  /* Define animations */
  --animate-fade-in: fadeIn 0.6s ease-out;
}

@layer components {
  .btn-primary {
    @apply px-4 py-2 bg-accent-500 text-neutral-950 rounded-lg;
  }
}
```

### Class Utility Tersedia

Starter kit sudah menyediakan class utility:

```svelte
<!-- Card -->
<div class="card">
  <h2 class="font-display text-xl">Title</h2>
</div>

<!-- Buttons -->
<button class="btn-primary">Primary</button>
<button class="btn-secondary">Secondary</button>

<!-- Form Input -->
<input class="input" placeholder="Type here..." />
```

Lihat `src/app.css` untuk semua utility class yang tersedia.

---

## 💡 Tips Development

### 1. Selalu Mulai dari Server

❌ Jangan:
```svelte
<script>
  let data = [];
  onMount(async () => {
    const res = await fetch('/api/data');
    data = await res.json();
  });
</script>
```

✅ Lakukan:
```typescript
// +page.server.ts
export const load = async () => {
  const data = await db.query...;
  return { data };
};
```

### 2. Gunakan Progressive Enhancement

Form harus work tanpa JavaScript:

```svelte
<!-- ✅ Tanpa JS, form tetap work -->
<form method="POST" action="?/create">
  <input name="title" />
  <button type="submit">Submit</button>
</form>

<!-- ✅ Dengan JS, UX lebih baik -->
<form method="POST" action="?/create" use:enhance>
  <!-- Loading state, optimistic UI, dll -->
</form>
```

### 3. Type Safety

Selalu gunakan TypeScript types:

```typescript
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => { ... };

export const actions: Actions = { ... };
```

### 4. Svelte 5 Runes

Gunakan runes untuk reactivity:

```svelte
<script>
  // ✅ Props dari server
  let { data } = $props();
  
  // ✅ Local state
  let count = $state(0);
  
  // ✅ Derived state
  let doubled = $derived(count * 2);
  
  // ✅ Effects
  $effect(() => {
    console.log('Count changed:', count);
  });
</script>

<button onclick={() => count++}>
  Count: {count} (doubled: {doubled})
</button>
```

---

## 🚀 Next Steps

| Jika ingin... | Lanjut ke... |
|---------------|--------------|
| Pahami arsitektur lengkap | [Architecture](./architecture) |
| Lihat contoh fitur lengkap | [Features](./features) |
| Siap deploy | [Deployment](./deployment) |
| Gunakan AI untuk coding | [AI-First Development](./ai-first-development) |

---

**Paham konsepnya? 🎉** Sekarang waktunya [membuat fitur](./features)!
