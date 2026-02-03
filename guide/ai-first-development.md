# 🤖 AI-First Development Guide

Panduan menggunakan AI (Claude, ChatGPT, GitHub Copilot, dll) untuk mengembangkan aplikasi dengan SvelteKit CF Starter secara efisien.

> 💡 **Kenapa AI-First?** Di era 2026, development yang efisien adalah development dengan AI. Dengan struktur yang jelas dan dokumentasi yang baik, AI bisa membantu 70-80% pekerjaan coding.

---

## 🎯 Workflow AI Agent (Baru!)

Project ini sekarang menggunakan **3 AI Agent** yang bekerja sama:

```
┌─────────────────────────────────────────────────────────────────┐
│                     AGENT WORKFLOW                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  INIT_AGENT → TASK_AGENT → Cloudflare → MANAGER_AGENT          │
│                                                                  │
│  1. INIT_AGENT: Setup project & dokumentasi                     │
│     └── Buat PRD.md, TDD.md, ui-kit.html, PROGRESS.md          │
│                                                                  │
│  2. TASK_AGENT: Implementasi fitur                              │
│     └── Baca PROGRESS.md → Implement → Test → Commit           │
│                                                                  │
│  3. Cloudflare: Auto deployment                                 │
│     └── Build → Deploy → Smoke tests                           │
│                                                                  │
│  4. MANAGER_AGENT: Change management                            │
│     └── Update docs → Approve → Release notes                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Cara Menggunakan Workflow

```bash
# 1. Mulai project baru
"Hai @workflow/INIT_AGENT.md, yuk kita mulai project baru"

# 2. Implementasi fitur  
"Hai @workflow/TASK_AGENT.md, yuk kita kerja"

# 3. Manage changes
"Hai @workflow/MANAGER_AGENT.md, ada change request"
```

---

## 📋 Detail Setiap Agent

### 🤖 INIT_AGENT - Project Initialization {#init-agent}

**Gunakan saat:** Memulai project baru dari starter kit

**Workflow:**
```bash
# 1. Setup project structure
# 2. Buat workflow/PRD.md (Product Requirements)
# 3. Buat workflow/TDD.md (Technical Design)
# 4. Buat workflow/ui-kit.html (UI Design System)
# 5. Buat workflow/PROGRESS.md (Task Tracking)
# 6. Setup database & environment
# 7. Review dengan user (WAJIB!)
# 8. Start dev server
```

**Output:**
- Project infrastructure siap
- Database migrations ter-setup
- Dokumentasi lengkap
- Dev server berjalan di http://localhost:5173

> ⚠️ **INIT_AGENT akan BERHENTI di Step 7 untuk menunggu user review & approve!**

---

### 🔧 TASK_AGENT - Feature Implementation {#task-agent}

**Gunakan saat:** Implementasi fitur, fix bug, modifikasi fitur

**Workflow:**
```bash
# 1. Baca PROGRESS.md untuk lihat task pending
# 2. Tampilkan top 3 tasks dengan priority [HIGH], [MEDIUM], [LOW]
# 3. User pilih task
# 4. Auto-create feature branch
# 5. Implementasi fitur (page, API, component)
# 6. Test lokal
# 7. Update PROGRESS.md
# 8. Commit & push
```

**Best Practices:**
- ✅ Cek existing files dulu (jangan duplicate)
- ✅ Gunakan built-in auth dan features
- ✅ Match UI kit dari `workflow/ui-kit.html`
- ✅ Gunakan Server Load untuk GET requests
- ✅ Gunakan Form Actions untuk POST/PUT/DELETE
- ✅ Update PROGRESS.md setelah selesai

---

### 📊 MANAGER_AGENT - Change Management {#manager-agent}

**Gunakan saat:** Change request (bug, feature), update dokumentasi, approve deployment

**Workflow:**
```bash
# 1. Terima change request
#    SOURCE: [Client/QA/Developer]
#    TYPE: [Bug/Feature/Modification]
#
# 2. Analyze impact
#    - Priority: Critical/High/Medium/Low
#    - Feasibility check
#
# 3. Update dokumentasi
#    - Update PRD.md (requirements)
#    - Update TDD.md (technical specs)
#    - Update PROGRESS.md (tasks)
#
# 4. Approve deployment
#    - Update version di package.json
#    - Create release notes di CHANGELOG.md
```

---

## 🚀 End-to-End Workflow Example

### Scenario: Membuat Aplikasi Todo List

**Step 1: INIT_AGENT - Setup Project**
```bash
User: "Hai @workflow/INIT_AGENT.md, yuk kita mulai project Todo List"

INIT_AGENT akan:
1. Review README.md
2. Buat workflow/PRD.md dengan fitur Todo List
3. Buat workflow/TDD.md dengan database schema, API specs
4. Buat workflow/ui-kit.html dengan design system
5. Buat workflow/PROGRESS.md dengan task list
6. Setup environment & database
7. ⛔ STOP - "Mohon review dokumentasi sebelum lanjut"

User review dan approve...

8. Setup design system
9. Customize auth pages
10. Git init & first commit
11. Start dev server
12. "Selesai! Buka session baru dengan TASK_AGENT"
```

**Step 2: TASK_AGENT - Implementasi**
```bash
User: "Hai @workflow/TASK_AGENT.md, yuk kita kerja"

TASK_AGENT akan:
1. Baca PROGRESS.md
2. "Top 3 tasks:
   [HIGH] 1. Database schema untuk todos
   [HIGH] 2. Halaman /todos list
   [MEDIUM] 3. Form create todo"

User: "Kerjakan task 1"

3. Lock task: [LOCKED: TASK_AGENT_xxx]
4. Auto-create branch: feature/todo-schema
5. Implementasi:
   - Update src/lib/db/schema.ts
   - Generate migration
   - Apply migration
6. Test lokal
7. "Silakan test, sudah OK?"

User: "OK"

8. Auto-commit: "feat: add todos database schema"
9. Auto-push ke GitHub
10. Unlock task, mark as [x] completed
```

**Step 3: MANAGER_AGENT - Change Request**
```bash
User: "Hai @workflow/MANAGER_AGENT.md, client request fitur export Excel"

MANAGER_AGENT akan:
1. Analyze:
   - Priority: High
   - Feasibility: Yes
2. Update PRD.md - Tambah Section 4.5: Data Export
3. Update TDD.md - Tambah API endpoint /api/export/excel
4. Update PROGRESS.md - Tambah task "Export Excel"
5. "Change request documented. TASK_AGENT bisa mulai implementasi"
```

---

## 📝 Prompt Templates (Legacy Mode)

Jika tidak menggunakan Agent Workflow, gunakan prompt templates ini:

### Template 1: Create New Feature (CRUD)

```markdown
Buatkan fitur [NAMA FITUR] dengan spesifikasi:

## Database Schema
Table: [nama_tabel]
Fields:
- field1: type (constraints)
- field2: type (constraints)
- user_id: foreign key ke users.id
- created_at: timestamp
- updated_at: timestamp

## Requirements
1. Halaman List: /[route] - Tampilkan semua data user yang login
2. Halaman Create: /[route]/new - Form untuk tambah data
3. Halaman Edit: /[route]/[id]/edit - Form untuk edit data
4. Action Delete: Tombol delete di list

## Tech Stack Context
- Gunakan SvelteKit 2.x dengan TypeScript
- Gunakan Svelte 5 dengan Runes ($state, $props, $derived)
- Gunakan Drizzle ORM 0.40+ untuk database
- Gunakan form actions pattern (bukan API endpoint)
- Gunakan Tailwind CSS 4 untuk styling
- Database diakses via locals.db

## Svelte 5 Syntax Rules:
- Gunakan `let data = $props()` untuk menerima data dari server
- Gunakan `let state = $state(initial)` untuk reactive variables
- Gunakan `onclick` (bukan `on:click`) untuk event handlers
- Gunakan `$effect()` untuk side effects

## Output yang diharapkan:
1. Schema database (Drizzle)
2. Migration SQL
3. +page.server.ts (load + actions)
4. +page.svelte (UI dengan Svelte 5 syntax)
5. +layout.svelte (jika perlu)
```

---

### Template 2: Setup AI Context

```markdown
## Project Context: SvelteKit CF Starter

### Tech Stack
- Framework: SvelteKit 2.x dengan TypeScript
- Svelte: Version 5 dengan Runes ($state, $props, $derived)
- Database: Cloudflare D1 (SQLite)
- ORM: Drizzle ORM 0.40+
- Auth: Lucia Auth (session-based)
- Styling: Tailwind CSS 4 (CSS-first config)
- Deployment: Cloudflare Pages (edge functions)

### Database Schema (drizzle/schema.ts)
```typescript
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  passwordHash: text("password_hash"),
  googleId: text("google_id").unique(),
  avatar: text("avatar"),
  emailVerified: integer("email_verified", { mode: "boolean" }),
  createdAt: integer("created_at", { mode: "timestamp" }),
});

export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
});
```

### Key Patterns
1. **Server Load Pattern**: Gunakan +page.server.ts load() untuk fetch data
2. **Form Actions Pattern**: Gunakan +page.server.ts actions untuk mutations
3. **Database Access**: Via locals.db yang di-inject di hooks.server.ts
4. **Svelte 5 Runes**: Gunakan $state(), $props(), $derived() untuk reactivity
5. **Tailwind 4**: Config di app.css dengan @theme, bukan tailwind.config.js
```

---

## 🔄 AI Development Workflow (Legacy)

### Workflow: Feature dari Nol

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  1. PLAN        │────▶│  2. GENERATE    │────▶│  3. IMPLEMENT   │
│                 │     │                 │     │                 │
│ Define feature  │     │ AI generates    │     │ Copy paste &    │
│ dengan prompt   │     │ code lengkap    │     │ adjust jika     │
│ template        │     │                 │     │ perlu           │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                        │
┌─────────────────┐     ┌─────────────────┐            │
│  6. REFACTOR    │◀────│  5. ITERATE     │◀───────────┘
│                 │     │                 │
│ Optimize dengan │     │ Test & fix      │
│ bantuan AI      │     │ bugs            │
└─────────────────┘     └─────────────────┘
```

---

## 🛠️ Tips AI-First Development

### 1. **Selalu Berikan Context**

❌ **Kurang baik:**
```
Buatkan halaman login
```

✅ **Lebih baik:**
```
Buatkan halaman login untuk SvelteKit dengan:
- Form email dan password
- Validasi dengan Zod
- Form action untuk handle submit
- Error handling untuk display error message
- Redirect ke /dashboard jika sukses
- Styling dengan Tailwind CSS (dark theme)
- Svelte 5 syntax dengan $props() dan $state()
```

### 2. **Iterasi Bertahap**

Jangan minta AI membuat fitur kompleks sekaligus. Pecah jadi iterasi:

**Iterasi 1:** Database schema + migration
**Iterasi 2:** Backend (server load + actions)
**Iterasi 3:** Frontend UI
**Iterasi 4:** Polish & error handling

### 3. **Gunakan TypeScript Strict**

Selalu minta AI generate code dengan TypeScript strict:

```markdown
Gunakan TypeScript strict dengan:
- Explicit types untuk semua functions
- Proper type guards
- No 'any' types
```

### 4. **Validate Output AI**

Selalu cek output AI untuk:
- ✅ Import statements benar
- ✅ Type definitions lengkap
- ✅ Error handling ada
- ✅ Security considerations (sanitasi input, dll)

---

## 📂 File Workflow

Workflow files tersedia di folder `/workflow/`:

| File | Deskripsi |
|------|-----------|
| `AGENT-GUIDE.md` | Panduan lengkap semua agent |
| `INIT_AGENT.md` | Setup project baru |
| `TASK_AGENT.md` | Implementasi fitur |
| `MANAGER_AGENT.md` | Change management |
| `PRD.md` | Product Requirements Document |
| `TDD.md` | Technical Design Document |
| `PROGRESS.md` | Development progress tracking |
| `ui-kit.html` | UI design system |

---

## 🎯 Best Practices

### Do's ✅
- Gunakan **Agent Workflow** untuk project baru
- Selalu berikan context project yang lengkap
- Iterasi bertahap, jangan sekaligus besar
- Test setelah setiap iterasi
- Simpan prompt yang berhasil untuk reuse

### Don'ts ❌
- Jangan skip **user review** di INIT_AGENT Step 7
- Jangan minta TASK_AGENT update PRD/TDD (itu tugas MANAGER_AGENT)
- Jangan minta fitur kompleks sekaligus
- Jangan skip testing setelah AI generate code

---

## 🔗 Resources

- [Claude Documentation](https://docs.anthropic.com)
- [GitHub Copilot](https://github.com/features/copilot)
- [SvelteKit Best Practices](https://kit.svelte.dev/docs/best-practices)
- [Svelte 5 Runes](https://svelte.dev/docs/svelte/what-are-runes)

---

**Siap menggunakan AI untuk development?** 🤖 

**Quick Start:** 
1. [Getting Started](./getting-started) - Setup project
2. Mention `@workflow/INIT_AGENT.md` untuk mulai dengan AI
3. [Development Flow](./development-flow) untuk pahami pola coding
