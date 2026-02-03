import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "SvelteKit CF Starter",
  description: "Starter Kit SvelteKit + Cloudflare. Build Fast, Deploy Everywhere.",
  lang: 'id-ID',
  lastUpdated: true,
  
  // Ignore dead links (localhost links are expected)
  ignoreDeadLinks: [
    /^http:\/\/localhost/,
    /^\.\.\/cookbook/,
    /^\.\/03-authentication/,
    /cookbook/
  ],
  
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-default-theme-config
    logo: '/logo.svg',
    
    nav: [
      { text: '🏠 Beranda', link: '/' },
      { text: '🚀 Mulai', link: '/guide/getting-started' },
      { text: '🤖 AI-First', link: '/guide/ai-first-development' },
      { text: '📖 Referensi', link: '/reference/glossary' }
    ],

    sidebar: {
      '/guide/': [
        {
          text: '🚀 Memulai',
          collapsed: false,
          items: [
            { text: 'Getting Started', link: '/guide/getting-started' },
            { text: 'Development Flow', link: '/guide/development-flow' },
            { text: 'Features', link: '/guide/features' },
            { text: 'Deployment', link: '/guide/deployment' }
          ]
        },
        {
          text: '🤖 AI Agent Workflow',
          collapsed: false,
          items: [
            { text: 'Quick Start', link: '/guide/ai-first-development' },
            { text: 'INIT_AGENT — Setup', link: '/guide/ai-first-development#init-agent' },
            { text: 'TASK_AGENT — Implement', link: '/guide/ai-first-development#task-agent' },
            { text: 'MANAGER_AGENT — Manage', link: '/guide/ai-first-development#manager-agent' },
            { text: 'End-to-End Example', link: '/guide/ai-first-development#end-to-end-example' }
          ]
        },
        {
          text: '🏗️ Arsitektur',
          collapsed: true,
          items: [
            { text: 'Architecture Overview', link: '/guide/architecture' },
            { text: 'Project Structure', link: '/guide/project-structure' },
            { text: 'Database Schema', link: '/guide/database-schema' },
            { text: 'SvelteKit Patterns', link: '/guide/sveltekit-patterns' }
          ]
        },
        {
          text: '⚙️ Setup Lanjutan (Opsional)',
          collapsed: true,
          items: [
            { text: 'Environment Variables', link: '/guide/environment-variables' },
            { text: 'Database D1', link: '/guide/database-d1' },
            { text: 'Google OAuth', link: '/guide/google-oauth' },
            { text: 'Resend Email', link: '/guide/resend-email' },
            { text: 'Cloudflare R2', link: '/guide/cloudflare-r2' },
            { text: 'Customizing Schema', link: '/guide/customizing-schema' }
          ]
        },
        {
          text: '📖 Panduan Fitur Detail',
          collapsed: true,
          items: [
            { text: 'Authentication', link: '/guide/authentication' },
            { text: 'File Uploads', link: '/guide/file-uploads' },
            { text: 'Profile Management', link: '/guide/profile-management' }
          ]
        }
      ],
      '/reference/': [
        {
          text: '📚 Referensi',
          collapsed: false,
          items: [
            { text: 'Glossary', link: '/reference/glossary' },
            { text: 'Common Mistakes', link: '/reference/common-mistakes' },
            { text: 'API Reference', link: '/reference/api-reference' }
          ]
        },
        {
          text: '⚡ Performa & Keamanan',
          collapsed: true,
          items: [
            { text: 'Performance Guide', link: '/reference/performance' },
            { text: 'Security Hardening', link: '/reference/security' }
          ]
        },
        {
          text: '🏛️ Keputusan Arsitektur',
          collapsed: true,
          items: [
            { text: 'Architecture Decision Records', link: '/reference/adr' }
          ]
        }
      ],
      '/troubleshooting/': [
        {
          text: '🐛 Troubleshooting',
          collapsed: false,
          items: [
            { text: 'Database Issues', link: '/troubleshooting/database' },
            { text: 'Authentication Issues', link: '/troubleshooting/authentication' },
            { text: 'Deployment Issues', link: '/troubleshooting/deployment' },
            { text: 'Upload Issues', link: '/troubleshooting/upload' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/yourusername/sveltekit-cf-starter' }
    ],
    
    footer: {
      message: 'SvelteKit Cloudflare Starter - Build Fast, Deploy Everywhere 🚀',
      copyright: 'Copyright © 2026'
    },
    
    search: {
      provider: 'local'
    },
    
    outline: {
      level: [2, 3]
    },
    
    editLink: {
      pattern: 'https://github.com/yourusername/sveltekit-cf-starter/edit/main/docs/:path'
    }
  }
})
