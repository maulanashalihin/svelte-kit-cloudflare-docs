# 📚 Dokumentasi SvelteKit Cloudflare Starter

Selamat datang! Dokumentasi ini dirancang untuk membuat development menjadi lebih mudah dan nyaman, baik untuk pemula maupun developer berpengalaman.

---

## 🎯 Pilih Jalur Belajar

### 👶 Saya Pemula

Baru belajar web development? Ikuti path ini:

```
Getting Started (10 menit) 
    ↓
Development Flow (20 menit)
    ↓
Features (15 menit)
    ↓
Deployment (10 menit)
    ↓
🎉 Aplikasi Live!
```

**Total: ~1 jam untuk aplikasi pertama**

---

### 🚀 Saya Sudah Berpengalaman

Sudah familiar dengan web dev? Langsung ke intinya:

```
Getting Started (10 menit)
    ↓
AI-First Development (15 menit) ← Focus here!
    ↓
Deployment (10 menit)
    ↓
🎉 Build dengan AI!
```

**Total: ~35 menit untuk productive development**

---

### 🤖 Saya Mau Development dengan AI

Maximize productivity dengan AI:

```
AI-First Development (15 menit) ← Mulai dari sini!
    ↓
Getting Started (10 menit)
    ↓
Build dengan AI assistance
    ↓
🎉 Ship faster!
```

---

## 📖 Navigasi Dokumentasi

### 🚀 Core Guides (Mulai dari sini!)

| Dokumen | Apa yang dipelajari | Estimasi |
|---------|---------------------|----------|
| [Getting Started](./getting-started) | Setup project dalam 5 menit | 10 menit |
| [Development Flow](./development-flow) | Konsep & pola SvelteKit | 20 menit |
| [Features](./features) | Menggunakan fitur built-in | 15 menit |
| [Deployment](./deployment) | Deploy ke Cloudflare | 10 menit |

### 🤖 AI Agent Workflow (⭐ Recommended)

| Dokumen | Apa yang dipelajari | Estimasi |
|---------|---------------------|----------|
| [AI Agent Guide](./ai-first-development) | Panduan 3 AI Agent | 15 menit |
| [INIT_AGENT](./ai-first-development#init-agent) | Setup project baru | 20 menit |
| [TASK_AGENT](./ai-first-development#task-agent) | Implementasi fitur | ongoing |
| [MANAGER_AGENT](./ai-first-development#manager-agent) | Change management | 10 menit |
| [Prompt Templates](./ai-first-development#prompt-templates) | Template prompt manual | 10 menit |

### 🏗️ Arsitektur & Advanced (Opsional)

| Dokumen | Topik | Untuk |
|---------|-------|-------|
| [Architecture](./architecture) | System design | Semua |
| [Project Structure](./project-structure) | Struktur folder | Semua |
| [Database Schema](./database-schema) | Schema & relations | Semua |
| [SvelteKit Patterns](./sveltekit-patterns) | Best practices | Intermediate |

### ⚙️ Setup Lanjutan (Opsional)

| Dokumen | Fitur | Waktu |
|---------|-------|-------|
| [Environment Variables](./environment-variables) | Konfigurasi lengkap | 15 menit |
| [Database D1](./database-d1) | Setup database | 15 menit |
| [Google OAuth](./google-oauth) | Login dengan Google | 15 menit |
| [Resend Email](./resend-email) | Email verification | 15 menit |
| [Cloudflare R2](./cloudflare-r2) | File upload storage | 20 menit |

### 🐛 Troubleshooting

| Dokumen | Masalah yang dibahas |
|---------|---------------------|
| [Database Issues](../troubleshooting/database) | D1, migrations, queries |
| [Authentication Issues](../troubleshooting/authentication) | Login, session, OAuth |
| [Upload Issues](../troubleshooting/upload) | File upload, R2 |
| [Deployment Issues](../troubleshooting/deployment) | Build, deploy, errors |

---

## 💡 Tips Membaca Dokumentasi

### Untuk Pemula
- 📖 **Mulai dari Getting Started** - Jangan skip, setup dijelaskan step-by-step
- 🎯 **Ikuti Development Flow** - Pahami konsep sebelum coding
- ⚠️ **Check Troubleshooting** - Kalau stuck, lihat solusi umum
- 🤖 **Gunakan AI** - Tanya AI jika ada yang tidak paham

### Untuk Developer Berpengalaman
- 🏗️ **Review Architecture** - Pahami edge-first patterns
- 🤖 **AI-First Guide** - Maximize productivity dengan AI
- ⚡ **Check Performance** - Optimasi awal lebih baik
- 🔐 **Follow Security** - Production needs hardening

---

## 🛠️ Tech Stack Overview

```
┌─────────────────────────────────────────────────────────┐
│  SvelteKit 2.x    │  Framework full-stack                │
│  Svelte 5         │  UI library dengan Runes             │
│  Cloudflare D1    │  SQLite database di edge             │
│  Drizzle ORM 0.40 │  Type-safe SQL                       │
│  Lucia Auth       │  Session-based authentication        │
│  Tailwind CSS 4   │  CSS-first styling                   │
│  Cloudflare Pages │  Edge deployment                     │
└─────────────────────────────────────────────────────────┘
```

> 🆕 **Update 2026**: Project ini menggunakan Svelte 5 dengan Runes dan Tailwind CSS 4.

---

## 🤝 Kontribusi

Dokumentasi ini open source! Kontribusi selalu welcome:
- ❌ Error atau typo
- 🆕 Topik yang belum tercakup  
- 💡 Cara penjelasan yang lebih baik
- 🤖 Prompt template baru untuk AI

---

## 🚀 Siap Mulai?

Pilih jalur sesuai kebutuhan:

<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
  <a href="./getting-started" class="block p-6 rounded-xl text-center transition-all duration-200" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #0a0a0a;">
    <div class="text-3xl mb-2">🚀</div>
    <div class="font-bold text-lg">Getting Started</div>
    <div class="text-sm opacity-80">Setup dalam 5 menit</div>
  </a>
  <a href="./ai-first-development" class="block p-6 rounded-xl text-center transition-all duration-200 hover:opacity-90" style="background: #171717; border: 1px solid #262626; color: #f5f5f5;">
    <div class="text-3xl mb-2">🤖</div>
    <div class="font-bold text-lg">AI Agent Workflow ⭐</div>
    <div class="text-sm opacity-70">3 Agent: INIT → TASK → MANAGER</div>
  </a>
</div>

<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
  <a href="./development-flow" class="block p-6 rounded-xl text-center transition-all duration-200 hover:opacity-90" style="background: #171717; border: 1px solid #262626; color: #f5f5f5;">
    <div class="text-3xl mb-2">🌊</div>
    <div class="font-bold text-lg">Development Flow</div>
    <div class="text-sm opacity-70">Pahami konsepnya</div>
  </a>
  <a href="./features" class="block p-6 rounded-xl text-center transition-all duration-200 hover:opacity-90" style="background: #171717; border: 1px solid #262626; color: #f5f5f5;">
    <div class="text-3xl mb-2">🎨</div>
    <div class="font-bold text-lg">Features</div>
    <div class="text-sm opacity-70">Lihat fitur built-in</div>
  </a>
</div>

---

**Happy coding! 🎉**

Ada pertanyaan? Check [troubleshooting section](../troubleshooting/database) atau buat issue di GitHub.
