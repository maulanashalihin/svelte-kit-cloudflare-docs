# 🤖 AI Agent Workflow Guide

Panduan menggunakan **3 AI Agent** untuk mengembangkan aplikasi dengan SvelteKit CF Starter.

---

## 🎯 Overview {#overview}

Project ini menggunakan **3 AI Agent** yang bekerja sama:

```
┌─────────────────────────────────────────────────────────────────┐
│                     AI AGENT WORKFLOW                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  INIT_AGENT → TASK_AGENT → MANAGER_AGENT                        │
│                                                                 │
│  1. INIT_AGENT: Setup project & dokumentasi                     │
│     └── Buat PRD.md, TDD.md, ui-kit.html, PROGRESS.md           │
│                                                                 │
│  2. TASK_AGENT: Implementasi fitur                              │
│     └── Baca PROGRESS.md → Implement → Test → Commit            │
│                                                                 │
│  3. MANAGER_AGENT: Change management                            │
│     └── Update docs → Approve → Release notes                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start {#quick-start}

Gunakan 3 command ini untuk memulai:

```bash
# 1. Mulai project baru
"@workflow/INIT_AGENT.md — start my project"

# 2. Implementasi fitur  
"@workflow/TASK_AGENT.md — build next feature"

# 3. Manage changes
"@workflow/MANAGER_AGENT.md — handle this change"
```

---

## 🤖 INIT_AGENT — Project Setup {#init-agent}

**Gunakan saat:** Memulai project baru dari starter kit

### Workflow

```
1. Setup project structure
2. Buat workflow/PRD.md (Product Requirements)
3. Buat workflow/TDD.md (Technical Design)
4. Buat workflow/ui-kit.html (UI Design System)
5. Buat workflow/PROGRESS.md (Task Tracking)
6. Setup database & environment
7. ⛔ STOP — Review dengan user (WAJIB!)
8. Setup design system
9. Customize auth pages
10. Git init & first commit
11. Start dev server
```

### Output

- ✅ Project infrastructure siap
- ✅ Database migrations ter-setup
- ✅ Dokumentasi lengkap (PRD, TDD, PROGRESS, UI Kit)
- ✅ Dev server berjalan di http://localhost:5173

### Contoh Penggunaan

```markdown
User: "@workflow/INIT_AGENT.md — start my project"

INIT_AGENT akan:
1. Tanya nama project dan fitur utama
2. Buat semua dokumentasi
3. Setup project structure
4. ⛔ STOP — "Mohon review dokumentasi sebelum lanjut"

User review dan approve...

INIT_AGENT melanjutkan:
5. Setup database & environment
6. Start dev server
7. "Selesai! Buka session baru dengan TASK_AGENT"
```

> ⚠️ **INIT_AGENT akan BERHENTI di Step 7 untuk menunggu user review & approve!**

---

## 🔧 TASK_AGENT — Feature Implementation {#task-agent}

**Gunakan saat:** Implementasi fitur, fix bug, modifikasi fitur

### Workflow

```
1. Baca PROGRESS.md untuk lihat task pending
2. Tampilkan top 3 tasks dengan priority [HIGH], [MEDIUM], [LOW]
3. User pilih task
4. Lock task: [LOCKED: TASK_AGENT_xxx]
5. Auto-create feature branch
6. Implementasi fitur (page, API, component)
7. Test lokal
8. "Silakan test, sudah OK?"
9. Auto-commit & push
10. Unlock task, mark as [x] completed
```

### Best Practices

- ✅ Cek existing files dulu (jangan duplicate)
- ✅ Gunakan built-in auth dan features
- ✅ Match UI kit dari `workflow/ui-kit.html`
- ✅ Gunakan Server Load untuk GET requests
- ✅ Gunakan Form Actions untuk POST/PUT/DELETE
- ✅ Update PROGRESS.md setelah selesai

### Contoh Penggunaan

```markdown
User: "@workflow/TASK_AGENT.md — build next feature"

TASK_AGENT akan:
1. Baca PROGRESS.md
2. "Top 3 tasks:
   [HIGH] 1. Database schema untuk todos
   [HIGH] 2. Halaman /todos list  
   [MEDIUM] 3. Form create todo"

User: "Kerjakan task 1"

TASK_AGENT:
3. Lock task
4. Create branch: feature/todo-schema
5. Update src/lib/db/schema.ts
6. Generate & apply migration
7. "Silakan test, sudah OK?"

User: "OK"

TASK_AGENT:
8. Commit: "feat: add todos database schema"
9. Push ke GitHub
10. Mark task completed
```

---

## 📊 MANAGER_AGENT — Change Management {#manager-agent}

**Gunakan saat:** Change request (bug, feature), update dokumentasi, approve deployment

### Workflow

```
1. Terima change request
   SOURCE: [Client/QA/Developer]
   TYPE: [Bug/Feature/Modification]

2. Analyze impact
   - Priority: Critical/High/Medium/Low
   - Feasibility check

3. Update dokumentasi
   - Update PRD.md (requirements)
   - Update TDD.md (technical specs)
   - Update PROGRESS.md (tasks)

4. TASK_AGENT implement
5. Deploy
6. Create release notes
   - Update version di package.json
   - Create CHANGELOG.md
```

### Contoh Penggunaan

```markdown
User: "@workflow/MANAGER_AGENT.md — client request fitur export Excel"

MANAGER_AGENT akan:
1. Analyze:
   - Priority: High
   - Feasibility: Yes

2. Update dokumentasi:
   - PRD.md — Tambah Section 4.5: Data Export
   - TDD.md — Tambah API endpoint /api/export/excel
   - PROGRESS.md — Tambah task "Export Excel"

3. "Change request documented. TASK_AGENT bisa mulai implementasi"

User: "@workflow/TASK_AGENT.md — build export Excel"

[Implementasi...]

MANAGER_AGENT:
4. Approve deployment
5. Create CHANGELOG.md
```

---

## 🔄 End-to-End Example {#end-to-end-example}

### Scenario: Membuat Aplikasi Todo List

**Step 1: INIT_AGENT — Setup**
```markdown
User: "@workflow/INIT_AGENT.md — start Todo List app"

INIT_AGENT:
✅ Buat PRD.md — Fitur: add, edit, delete, complete todos
✅ Buat TDD.md — Database schema, API endpoints
✅ Buat ui-kit.html — Design system
✅ Buat PROGRESS.md — Task list

⛔ STOP — "Review dokumentasi:"
- [ ] Fitur lengkap?
- [ ] Design sesuai?
- [ ] Database schema OK?

User: "Lanjutkan"

INIT_AGENT:
✅ Setup database
✅ Start dev server
✅ "Selesai! Dev server: http://localhost:5173"
```

**Step 2: TASK_AGENT — Build**
```markdown
User: "@workflow/TASK_AGENT.md — build todo feature"

TASK_AGENT:
📋 PROGRESS.md:
   [HIGH] 1. Database schema
   [HIGH] 2. Halaman /todos
   [MEDIUM] 3. Form create

User: "Task 1"

TASK_AGENT:
✅ Update schema.ts
✅ Generate migration
✅ Apply migration
✅ Commit & push
✅ Mark completed
```

**Step 3: MANAGER_AGENT — Change**
```markdown
User: "@workflow/MANAGER_AGENT.md — add due date to todos"

MANAGER_AGENT:
✅ Analyze: High priority, feasible
✅ Update PRD.md
✅ Update TDD.md  
✅ Update PROGRESS.md

"TASK_AGENT siap implement"
```

---

## 📂 Workflow Files

File-file ini ada di folder `/workflow/` starter kit:

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

## 💡 Tips Sukses

### Do's ✅
- Gunakan **Agent Workflow** untuk semua project
- Selalu berikan context lengkap ke AI
- Iterasi bertahap, jangan sekaligus besar
- Test setelah setiap iterasi
- Simpan prompt yang berhasil untuk reuse

### Don'ts ❌
- Jangan skip **user review** di INIT_AGENT Step 7
- Jangan minta TASK_AGENT update PRD/TDD
- Jangan minta fitur kompleks sekaligus
- Jangan skip testing setelah AI generate code

---

## 🎯 Tips Berkomunikasi dengan AI

### 1. Berikan Context Lengkap

❌ Kurang baik:
```
Buatkan halaman login
```

✅ Lebih baik:
```
Buatkan halaman login untuk SvelteKit dengan:
- Form email dan password
- Validasi dengan Zod
- Form action untuk handle submit
- Error handling untuk display error message
- Redirect ke /dashboard jika sukses
- Styling dengan Tailwind CSS
- Svelte 5 syntax dengan $props() dan $state()
```

### 2. Iterasi Bertahap

Jangan minta AI membuat fitur kompleks sekaligus:

**Iterasi 1:** Database schema + migration  
**Iterasi 2:** Backend (server load + actions)  
**Iterasi 3:** Frontend UI  
**Iterasi 4:** Polish & error handling

### 3. Validate Output

Selalu cek output AI untuk:
- ✅ Import statements benar
- ✅ Type definitions lengkap
- ✅ Error handling ada
- ✅ Security considerations

---

## 🔗 Resources

- [Claude Documentation](https://docs.anthropic.com)
- [GitHub Copilot](https://github.com/features/copilot)
- [SvelteKit Best Practices](https://kit.svelte.dev/docs/best-practices)
- [Svelte 5 Runes](https://svelte.dev/docs/svelte/what-are-runes)

---

**Siap menggunakan AI Agent Workflow?** 🤖

**Mulai dari sini:**
1. [Getting Started](./getting-started) — Setup project
2. "@workflow/INIT_AGENT.md — start my project"
3. [Development Flow](./development-flow) — Pahami pola coding
