---
layout: home

hero:
  name: "SvelteKit Cloudflare"
  text: "AI-First Full-Stack Starter"
  tagline: Build production-ready apps with 3 AI Agents. Modern stack, zero config, deploy in minutes.
  image:
    src: https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/dark/cloudflare-color.png
    alt: SvelteKit CF Logo
  actions:
    - theme: brand
      text: 🚀 Get Started in 5 Minutes
      link: /guide/getting-started
    - theme: alt
      text: 🤖 AI Agent Workflow
      link: /guide/ai-first-development
    - theme: alt
      text: 🐙 GitHub
      link: https://github.com/yourusername/sveltekit-cf-starter

features:
  - icon: 🤖
    title: 3 AI Agents Workflow
    details: INIT_AGENT setup → TASK_AGENT build → MANAGER_AGENT manage. Document-driven development with PRD, TDD, PROGRESS tracking.
  - icon: ⚡
    title: Modern Stack 2026
    details: Svelte 5 Runes + Tailwind CSS 4 + Drizzle ORM 0.40. Type-safe, reactive, CSS-first configuration.
  - icon: 🗄️
    title: Zero Config Database
    details: Cloudflare D1 SQLite built-in. No database setup, no connection strings. Just write schema and go.
  - icon: 🔐
    title: Auth Ready
    details: Lucia Auth with email/password + Google OAuth included. Session-based, secure, production-ready.
  - icon: 🌍
    title: Edge Deployed
    details: Deploy to 300+ Cloudflare edge locations. Sub-100ms latency worldwide, auto-scaling, zero maintenance.
  - icon: 🚀
    title: One Command Deploy
    details: npm run deploy. That's it. No Docker, no Kubernetes, no server management.
---

## 🎯 What Makes This Different?

::: tip 🤖 AI-First by Design
This isn't just a starter kit—it's an **AI Agent Workflow** system:

1. **INIT_AGENT** creates your project structure, PRD, TDD, UI Kit
2. **TASK_AGENT** implements features from PROGRESS.md auto-tracking
3. **MANAGER_AGENT** handles changes, updates docs, creates release notes

**Result**: Document-driven development where AI does 80% of the work.
:::

::: info 🚀 For Developers Who Ship
Stop configuring, start building:

- **No database setup** - D1 is zero-config
- **No auth setup** - Lucia is pre-configured  
- **No deployment setup** - Cloudflare Pages is one command
- **No API boilerplate** - Form Actions pattern included

Just describe what you want, and let the AI Agents build it.
:::

---

## 🛠️ The Stack

```
┌─────────────────────────────────────────────────────────┐
│  Svelte 5         │  Reactive UI with Runes ($state)    │
├─────────────────────────────────────────────────────────┤
│  SvelteKit 2.x    │  Full-stack framework, file routing  │
├─────────────────────────────────────────────────────────┤
│  Tailwind CSS 4   │  CSS-first, no config needed         │
├─────────────────────────────────────────────────────────┤
│  Cloudflare D1    │  SQLite at edge, zero setup          │
├─────────────────────────────────────────────────────────┤
│  Drizzle ORM 0.40 │  Type-safe SQL, intuitive            │
├─────────────────────────────────────────────────────────┤
│  Lucia Auth       │  Session auth, secure by default     │
├─────────────────────────────────────────────────────────┤
│  Cloudflare Pages │  Edge deployment, auto-scaling       │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start (Really 5 Minutes)

```bash
# 1. Clone starter
git clone https://github.com/yourusername/sveltekit-cf-starter.git my-app
cd my-app && npm install

# 2. Create database (one command)
npx wrangler d1 create my-app-db
# Copy database_id to wrangler.toml

# 3. Run migrations & start
npm run db:migrate:local
npm run dev
```

🎉 **Open http://localhost:5173** — Auth, database, everything works.

---

## 🤖 The 3 AI Agent Workflow

Every project gets 3 specialized AI Agents:

```
┌──────────────────────────────────────────────────────────────┐
│  INIT_AGENT                                                  │
│  ├── Creates PRD.md (Product Requirements)                   │
│  ├── Creates TDD.md (Technical Design)                       │
│  ├── Creates ui-kit.html (Design System)                     │
│  └── Creates PROGRESS.md (Task Tracking)                     │
│                        ↓                                     │
│  TASK_AGENT                                                  │
│  ├── Reads PROGRESS.md                                       │
│  ├── Implements features one by one                          │
│  ├── Auto-commits & pushes                                   │
│  └── Updates PROGRESS.md                                     │
│                        ↓                                     │
│  Cloudflare (Auto Deploy)                                    │
│                        ↓                                     │
│  MANAGER_AGENT                                               │
│  ├── Handles change requests                                 │
│  ├── Updates all documentation                               │
│  └── Creates release notes                                   │
└──────────────────────────────────────────────────────────────┘
```

**Usage:**
```bash
"@workflow/INIT_AGENT.md — start my project"
"@workflow/TASK_AGENT.md — build next feature"  
"@workflow/MANAGER_AGENT.md — handle this change"
```

---

## 📂 Documentation Structure

| Section | What You'll Learn | Time |
|---------|-------------------|------|
| **[Getting Started](./guide/getting-started)** | 5-minute setup, no config needed | 10 min |
| **[AI Agent Workflow](./guide/ai-first-development)** | How to use 3 AI Agents effectively | 15 min |
| **[Development Flow](./guide/development-flow)** | SvelteKit patterns that work | 20 min |
| **[Features](./guide/features)** | Built-in auth, upload, email | 15 min |
| **[Deployment](./guide/deployment)** | One-command deploy to edge | 10 min |

---

## 💡 Pick Your Path

### Path 1: Ship Today (1 hour)
For builders who want results now

```
Getting Started (10m) → Build with TASK_AGENT (40m) → Deploy (10m)
```

### Path 2: Master the Stack (3 hours)
For developers who want deep understanding

```
Getting Started → Development Flow → Architecture → AI Workflow
     10m              20m              30m            15m
```

### Path 3: AI-Native Development (Recommended ⭐)
Let AI Agents do the heavy lifting

```
INIT_AGENT (20m) → TASK_AGENT (∞) → Deploy (10m) → MANAGER_AGENT
  PRD/TDD setup    Feature factory    Live on edge    Handle changes
```

---

## 🔗 Resources

- [SvelteKit Docs](https://kit.svelte.dev/docs) - Framework documentation
- [Drizzle ORM](https://orm.drizzle.team/docs) - Database ORM
- [Cloudflare D1](https://developers.cloudflare.com/d1/) - Edge database
- [Lucia Auth](https://lucia-auth.com/) - Authentication

---

**Stop configuring. Start building.** 🚀

[Get Started →](./guide/getting-started)
