# Security Hardening Guide

Panduan mengamankan aplikasi SvelteKit Cloudflare untuk production.

---

## 🔐 Authentication Security

### 1. Session Management

**Yang sudah diimplementasi:**
```typescript
// src/lib/auth/lucia.ts
export const createLucia = (adapter: any) => {
  return new Lucia(adapter, {
    sessionCookie: {
      attributes: {
        secure: process.env.NODE_ENV === 'production', // HTTPS only
        sameSite: 'strict', // CSRF protection
        httpOnly: true, // No JavaScript access
        maxAge: 60 * 60 * 24 * 7 // 7 days
      }
    }
  });
};
```

**Ceklist:**
- ✅ HTTP-only cookies (tidak bisa diakses via `document.cookie`)
- ✅ Secure flag di production (HTTPS only)
- ✅ SameSite=Strict (CSRF protection)
- ✅ Session expiry (7 days default)
- ✅ Session rotation setelah login

### 2. Password Security

**Hashing (PBKDF2):**
```typescript
// src/lib/auth/password.ts
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  
  const keyMaterial = await crypto.subtle.importKey(
    'raw', 
    new TextEncoder().encode(password), 
    'PBKDF2', 
    false, 
    ['deriveBits']
  );
  
  const hash = await crypto.subtle.deriveBits(
    { 
      name: 'PBKDF2', 
      salt, 
      iterations: 100000, // Minimum recommendation
      hash: 'SHA-256' 
    },
    keyMaterial,
    256
  );
  
  return `100000:${base64Encode(salt)}:${base64Encode(hash)}`;
}
```

**Password Policy:**
```typescript
// src/lib/validations/auth.ts
import { z } from 'zod';

export const passwordSchema = z.string()
  .min(8, 'Password minimal 8 karakter')
  .max(128, 'Password maksimal 128 karakter')
  .regex(/[A-Z]/, 'Password harus ada huruf besar')
  .regex(/[a-z]/, 'Password harus ada huruf kecil')
  .regex(/[0-9]/, 'Password harus ada angka')
  .regex(/[^A-Za-z0-9]/, 'Password harus ada karakter spesial');
```

### 3. Brute Force Protection

```typescript
// src/lib/rate-limit.ts
const attempts = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(identifier: string, maxAttempts: number = 5): boolean {
  const now = Date.now();
  const record = attempts.get(identifier);
  
  if (!record || now > record.resetTime) {
    attempts.set(identifier, { count: 1, resetTime: now + 15 * 60 * 1000 });
    return true;
  }
  
  if (record.count >= maxAttempts) {
    return false; // Rate limited
  }
  
  record.count++;
  return true;
}

// Usage di login
export const actions = {
  login: async ({ request, getClientAddress }) => {
    const ip = getClientAddress();
    
    if (!checkRateLimit(ip)) {
      return fail(429, { error: 'Terlalu banyak percobaan. Coba lagi nanti.' });
    }
    
    // ... login logic
  }
};
```

---

## 🛡️ Input Validation

### 1. Zod Schema Validation

```typescript
// src/lib/validations/index.ts
import { z } from 'zod';

export const userSchema = z.object({
  email: z.string().email('Email tidak valid'),
  name: z.string().min(2).max(100).trim(),
  bio: z.string().max(500).optional(),
  website: z.union([
    z.string().url(),
    z.string().length(0)
  ]).optional()
});

// Usage
export const actions = {
  updateProfile: async ({ request }) => {
    const form = await request.formData();
    const data = Object.fromEntries(form);
    
    const result = userSchema.safeParse(data);
    if (!result.success) {
      return fail(400, { 
        errors: result.error.flatten().fieldErrors 
      });
    }
    
    // Data validated and typed
    const { email, name, bio } = result.data;
  }
};
```

### 2. SQL Injection Prevention

```typescript
// ✅ GOOD: Drizzle ORM (parameterized queries)
await locals.db.select()
  .from(users)
  .where(eq(users.email, userEmail)); // Safe!

// ❌ BAD: String concatenation
await locals.db.execute(`
  SELECT * FROM users WHERE email = '${userEmail}'
`); // SQL Injection risk!
```

### 3. XSS Prevention

```svelte
<!-- ✅ GOOD: Svelte auto-escapes -->
<p>{userInput}</p>  <!-- Safe: <script> becomes &lt;script&gt; -->

<!-- ⚠️ CAREFUL: Only use @html dengan data trusted -->
<div>{@html sanitizedHtml}</div>

<!-- ✅ GOOD: Sanitize dulu -->
<script>
  import DOMPurify from 'isomorphic-dompurify';
  const clean = DOMPurify.sanitize(dirtyHtml);
</script>
<div>{@html clean}</div>
```

---

## 🔒 CSRF Protection

### 1. SameSite Cookies

Sudah dikonfigurasi di session cookie:
```typescript
sessionCookie: {
  attributes: {
    sameSite: 'strict' // Blocks cross-site requests
  }
}
```

### 2. State Parameter (OAuth)

```typescript
// src/routes/auth/google/+server.ts
export const GET = async ({ cookies }) => {
  const state = generateState();
  
  // Store state di cookie sementara
  cookies.set('google_oauth_state', state, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 10 // 10 minutes
  });
  
  const url = await google.createAuthorizationURL(state, codeVerifier);
  redirect(302, url.toString());
};

// Callback - verify state
export const GET = async ({ url, cookies }) => {
  const state = url.searchParams.get('state');
  const storedState = cookies.get('google_oauth_state');
  
  if (!state || !storedState || state !== storedState) {
    throw error(400, 'Invalid state parameter');
  }
  
  // ... continue OAuth flow
};
```

---

## 🛡️ Security Headers

### 1. Content Security Policy (CSP)

```typescript
// src/hooks.server.ts
export const handle = async ({ event, resolve }) => {
  const response = await resolve(event);
  
  // Strict CSP
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'", // Svelte butuh inline scripts
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self'",
    "connect-src 'self' https://api.example.com",
    "frame-ancestors 'none'", // No iframe embedding
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; ');
  
  response.headers.set('Content-Security-Policy', csp);
  
  return response;
};
```

### 2. Security Headers Lainnya

```typescript
// src/hooks.server.ts
export const handle = async ({ event, resolve }) => {
  const response = await resolve(event);
  
  // Prevent MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');
  
  // Enable XSS filter (legacy browsers)
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // Prevent clickjacking
  response.headers.set('X-Frame-Options', 'DENY');
  
  // Referrer policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // HSTS (HTTPS enforcement)
  response.headers.set(
    'Strict-Transport-Security', 
    'max-age=31536000; includeSubDomains; preload'
  );
  
  return response;
};
```

---

## 🔐 File Upload Security

### 1. File Type Validation

```typescript
// src/routes/api/upload/image/+server.ts
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export const POST = async ({ request }) => {
  const form = await request.formData();
  const file = form.get('file') as File;
  
  // Validate type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return json({ error: 'Tipe file tidak diizinkan' }, { status: 400 });
  }
  
  // Validate size
  if (file.size > MAX_SIZE) {
    return json({ error: 'File terlalu besar (max 5MB)' }, { status: 400 });
  }
  
  // Validate magic number (file signature)
  const buffer = await file.arrayBuffer();
  const signature = new Uint8Array(buffer.slice(0, 4));
  
  // JPEG: FF D8 FF
  // PNG: 89 50 4E 47
  const isJPEG = signature[0] === 0xFF && signature[1] === 0xD8;
  const isPNG = signature[0] === 0x89 && signature[1] === 0x50;
  
  if (!isJPEG && !isPNG) {
    return json({ error: 'File signature tidak valid' }, { status: 400 });
  }
  
  // ... continue processing
};
```

### 2. Filename Sanitization

```typescript
function sanitizeFilename(filename: string): string {
  // Remove path traversal attempts
  const basename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
  
  // Ensure no double extensions
  const parts = basename.split('.');
  if (parts.length > 2) {
    return parts.slice(0, 2).join('.') + '.webp';
  }
  
  return basename;
}

// Generate safe filename
const safeFilename = `${uuidv4()}.webp`;
```

---

## 🌐 Environment Security

### 1. Environment Variables

```bash
# ✅ GOOD: .env.example (no secrets!)
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_DATABASE_ID=your_database_id
CLOUDFLARE_API_TOKEN=your_api_token

# ❌ BAD: Never commit real values!
CLOUDFLARE_API_TOKEN=abc123_real_token_xyz
```

```toml
# ✅ GOOD: wrangler.toml (use vars for non-secrets)
[vars]
APP_NAME = "My App"
APP_URL = "https://example.com"

# Secrets di-set via wrangler secret
# wrangler secret put RESEND_API_TOKEN
```

### 2. API Token Permissions (Principle of Least Privilege)

**Cloudflare API Token:**
```
Account:
  - D1:Edit (untuk database)
  - Cloudflare Pages:Edit (untuk deploy)

Zone (jika ada custom domain):
  - Zone:Read
  - Page Rules:Edit
```

**R2 Token:**
```json
{
  "Effect": "Allow",
  "Action": [
    "s3:GetObject",
    "s3:PutObject",
    "s3:DeleteObject"
  ],
  "Resource": "arn:aws:s3:::your-bucket/*"
}
```

---

## 🚨 Security Checklist

### Pre-Launch
- [ ] Semua cookies HTTP-only dan secure
- [ ] CSP header configured
- [ ] Rate limiting enabled
- [ ] Input validation di semua forms
- [ ] File upload validated (type & size)
- [ ] No secrets in code repository
- [ ] Dependencies updated (`npm audit`)
- [ ] Security headers configured

### Ongoing
- [ ] Monitor failed login attempts
- [ ] Review access logs regularly
- [ ] Keep dependencies updated
- [ ] Rotate API keys periodically
- [ ] Backup database regularly
- [ ] Test incident response plan

---

## 🔍 Security Testing

### 1. Automated Scanning

```bash
# Check for known vulnerabilities
npm audit

# Dependency check
npx depcheck

# SAST (Static Application Security Testing)
npx eslint-plugin-security
```

### 2. Manual Testing

```bash
# Test SQL Injection
curl -X POST http://localhost:5173/auth/login \
  -d 'email=" OR 1=1--&password=anything'

# Test XSS
curl -X POST http://localhost:5173/api/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"<script>alert(1)</script>"}'

# Test CSRF (harusnya gagal)
curl -X POST http://localhost:5173/auth/logout \
  -H "Origin: https://evil.com"
```

### 3. Cloudflare Security Features

**Enable di Dashboard:**
- Bot Fight Mode
- Security Level (Medium/High)
- Challenge Passage
- Browser Integrity Check

---

## 📚 Security Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [SvelteKit Security](https://kit.svelte.dev/docs/security)
- [Cloudflare Security](https://www.cloudflare.com/learning/security/)
- [Web Security Checklist](https://web.dev/secure/)

---

**⚠️ Remember:** Security is a process, not a destination. Stay updated dengan latest threats dan best practices!
