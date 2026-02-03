# SvelteKit Data Patterns

Best practices untuk data loading dan form submission di SvelteKit.

## 📊 Perbandingan Pattern

| Pattern | Request | SEO | JS Required | Use Case |
|---------|---------|-----|-------------|----------|
| **API + Fetch** | 2 | ❌ | ✅ | Jangan dipakai |
| **Server Load** | 1 | ✅ | ❌ | GET data |
| **Form Actions** | 1 | ✅ | ❌ | POST/PUT/DELETE |

## ✅ Pattern 1: Server Load (Recommended untuk GET)

### Kapan Menggunakan?

- Load data untuk halaman
- Query database
- Tidak perlu loading state

### Contoh

**+page.server.ts**
```typescript
export const load = async ({ locals }) => {
  // Query langsung di server
  const users = await locals.db.query.users.findMany();
  
  return { users }; // Data ke page
};
```

**+page.svelte**
```svelte
<script>
  export let data; // Auto-populated!
</script>

{#each data.users as user}
  <UserCard {user} />
{/each}
```

### Keuntungan

- ✅ 1 request saja
- ✅ SEO friendly (HTML lengkap)
- ✅ No loading state needed
- ✅ Type-safe

### Contoh di Project

- `/dashboard` - Load user data
- `/profile` - Load profile info
- `/_examples/server-load-example` - Demo lengkap

## ✅ Pattern 2: Form Actions (Recommended untuk POST)

### Kapan Menggunakan?

- Form submission
- Create/update/delete data
- Works tanpa JavaScript!

### Contoh

**+page.server.ts**
```typescript
export const actions = {
  createUser: async ({ request, locals }) => {
    const form = await request.formData();
    const name = form.get('name');
    
    // Validate
    if (!name) {
      return fail(400, { error: 'Name required' });
    }
    
    // Process
    await locals.db.insert(users).values({ name });
    
    return { success: true };
  }
};
```

**+page.svelte**
```svelte
<form method="POST" action="?/createUser">
  <input name="name" />
  <button type="submit">Create</button>
</form>
```

### Progressive Enhancement

Tambahkan JavaScript untuk UX lebih baik:

```svelte
<form 
  method="POST" 
  action="?/createUser"
  use:enhance={() => {
    // Called saat submit
    loading = true;
    
    return async ({ result, update }) => {
      // Called saat response
      loading = false;
      if (result.type === 'success') {
        update(); // Reset form
      }
    };
  }}
>
```

### Keuntungan

- ✅ Works tanpa JavaScript
- ✅ 1 request
- ✅ No API endpoint needed
- ✅ Secure (logic di server)

### Contoh di Project

- `/register` - Create user
- `/login` - Login user
- `/_examples/form-actions-example` - Demo lengkap

## ❌ Pattern: API + Fetch (Anti-pattern)

### Jangan Lakukan Ini

**+server.ts** (Jangan buat!)
```typescript
export const GET = async () => {
  const users = await db.query.users.findMany();
  return json({ users });
};
```

**+page.svelte** (Jangan lakukan!)
```svelte
<script>
  let users = [];
  
  onMount(async () => {
    const res = await fetch('/api/users'); // ❌ 2 request!
    users = await res.json();
  });
</script>
```

### Masalah

- ❌ 2 request (page + API)
- ❌ Perlu loading state
- ❌ SEO kurang baik
- ❌ Flash of unauthenticated content

## 🔄 When to Use API Routes?

API routes (`+server.ts`) tetap berguna untuk:

- **External API** - Webhooks, third-party integrations
- **Mobile apps** - REST API untuk mobile
- **Internal services** - Service-to-service communication
- **File uploads** - Large file streaming

Tapi untuk internal SvelteKit pages, gunakan Server Load atau Form Actions!

## 📁 Contoh Files di Project

```
src/routes/
├── _examples/
│   ├── server-load-example/      # Demo Server Load
│   │   ├── +page.server.ts
│   │   └── +page.svelte
│   └── form-actions-example/     # Demo Form Actions
│       ├── +page.server.ts
│       └── +page.svelte
```

## 📖 Resources

- [SvelteKit Load Docs](https://kit.svelte.dev/docs/load)
- [SvelteKit Form Actions](https://kit.svelte.dev/docs/form-actions)
- [Progressive Enhancement](https://kit.svelte.dev/docs/form-actions#progressive-enhancement)
