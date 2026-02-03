# Troubleshooting: Authentication Issues

Solusi untuk masalah login, register, session, dan OAuth.

---

## 🔴 Error: "Email atau password salah"

### Penyebab Umum

#### 1. Password Salah

**Solusi:**
- Pastikan Caps Lock tidak aktif
- Coba reset password
- Check apakah email terdaftar

#### 2. User Belum Verifikasi Email

**Solusi:**
```typescript
// Check status email
const user = await locals.db.query.users.findFirst({
  where: eq(users.email, email)
});

if (user && !user.emailVerified) {
  // Redirect ke halaman verifikasi
  throw redirect(302, '/verify-email?email=' + email);
}
```

**Resend verification:**
```bash
# Atau kirim ulang email verifikasi
# POST /auth/resend-verification
```

#### 3. User Login dengan Google OAuth Sebelumnya

Jika user pertama kali login dengan Google, kemudian coba login dengan password:
- User tidak punya password (registered via OAuth)
- Solusi: Gunakan "Forgot Password" untuk set password

---

## 🔴 Error: "Session invalid" atau "Not authenticated"

### Gejala
User sudah login tapi session tidak terbaca di page lain.

### Penyebab & Solusi

#### 1. Cookie Tidak Ter-set

**Check cookie di browser:**
- Buka DevTools → Application → Cookies
- Check ada cookie `auth_session`

**Solusi:**
```typescript
// src/lib/auth/lucia.ts
export const createLucia = (adapter: any) => {
  return new Lucia(adapter, {
    sessionCookie: {
      attributes: {
        secure: process.env.NODE_ENV === 'production', // HTTPs only di production
        sameSite: 'strict',
        httpOnly: true,
        path: '/' // Pastikan path adalah root
      }
    }
  });
};
```

#### 2. Domain Mismatch

Jika menggunakan custom domain:
```typescript
// Pastikan cookie domain sesuai
sessionCookie: {
  attributes: {
    domain: '.yourdomain.com' // Share cookie across subdomains
  }
}
```

#### 3. Session Expired

Default session lifetime: 7 hari

```typescript
// Check session expiry
const session = await lucia.validateSession(sessionId);

if (session.session?.fresh) {
  // Session baru dibuat (extended), update cookie
}
```

---

## 🔴 Google OAuth Error

### Gejala: "redirect_uri_mismatch"

**Error:**
```
Error 400: redirect_uri_mismatch
The redirect URI in the request does not match the ones authorized
```

**Solusi:**

1. Buka [Google Cloud Console](https://console.cloud.google.com)
2. APIs & Services → Credentials
3. Edit OAuth 2.0 Client ID
4. Tambahkan Authorized redirect URIs:
   ```
   http://localhost:5173/auth/google/callback    (development)
   https://your-app.pages.dev/auth/google/callback    (production)
   https://yourdomain.com/auth/google/callback        (custom domain)
   ```

### Gejala: "Invalid state parameter"

**Error:**
```
Error: Invalid state parameter
```

**Penyebab:**
- State cookie expired (10 menit)
- CSRF attempt
- Browser blocked third-party cookies

**Solusi:**
```typescript
// Pastikan state cookie ter-set
cookies.set('google_oauth_state', state, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax', // Gunakan 'lax' untuk OAuth
  maxAge: 60 * 10 // 10 menit
});
```

### Gejala: "User denied consent"

User menekan "Cancel" di dialog Google.

**Solusi:**
```typescript
// Handle gracefully
try {
  // OAuth flow
} catch (error) {
  if (error.message?.includes('access_denied')) {
    throw redirect(302, '/login?error=cancelled');
  }
}
```

---

## 🔴 Email Verification Tidak Terkirim

### Gejala
User register tapi tidak menerima email verifikasi.

### Diagnosis

#### 1. Check Resend API Token

```bash
# Test Resend API
curl -X POST https://api.resend.com/emails \
  -H "Authorization: Bearer re_xxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "onboarding@yourdomain.com",
    "to": "test@example.com",
    "subject": "Test",
    "html": "<p>Test</p>"
  }'
```

#### 2. Check Environment Variables

```bash
# .env
RESEND_API_TOKEN=re_your_token
FROM_EMAIL=noreply@yourdomain.com
```

**Dashboard Cloudflare Pages:**
- Pastikan `RESEND_API_TOKEN` di-set di Environment Variables

#### 3. Domain Belum Verified

Resend memerlukan domain verification:
1. Buka [Resend Dashboard](https://resend.com/domains)
2. Add domain
3. Add DNS records sesuai instruksi
4. Wait untuk verification

#### 4. Email di Spam

**Solusi:**
- Check folder spam
- Tambahkan ke whitelist
- Gunakan DKIM/SPF records

---

## 🔴 Password Reset Tidak Bekerja

### Gejala: "Invalid or expired token"

**Penyebab:**
- Token expired (default: 1 jam)
- Token sudah digunakan
- User request token baru (old token invalidated)

**Solusi:**
```typescript
// Check token di database
const tokenRecord = await locals.db.query.passwordResetTokens.findFirst({
  where: and(
    eq(passwordResetTokens.tokenHash, hash),
    gt(passwordResetTokens.expiresAt, Date.now())
  )
});

if (!tokenRecord || tokenRecord.used) {
  return fail(400, { error: 'Token invalid atau expired' });
}
```

### Flow yang Benar

1. User request reset → Generate token → Send email
2. User click link (token di URL) → Reset password page
3. Submit new password → Validate token → Update password
4. Mark token as used → Invalidate all user sessions
5. Redirect ke login

---

## 🔴 Rate Limiting

### Gejala: Terlalu banyak request error

**Implement rate limiting:**
```typescript
// src/lib/rate-limit.ts
const attempts = new Map<string, number>();

export function rateLimit(key: string, maxAttempts: number = 5): boolean {
  const current = attempts.get(key) || 0;
  
  if (current >= maxAttempts) {
    return false;
  }
  
  attempts.set(key, current + 1);
  
  // Reset setelah 15 menit
  setTimeout(() => {
    attempts.delete(key);
  }, 15 * 60 * 1000);
  
  return true;
}

// Usage
export const actions = {
  login: async ({ request, getClientAddress }) => {
    const ip = getClientAddress();
    
    if (!rateLimit(ip, 5)) {
      return fail(429, { 
        error: 'Terlalu banyak percobaan. Coba lagi dalam 15 menit.' 
      });
    }
    
    // ... login logic
  }
};
```

---

## 🔴 Cookie Issues

### Cookie Tidak Ter-set di Production

**Checklist:**
- [ ] `secure: true` hanya untuk HTTPS
- [ ] `sameSite` sesuai (strict/lax/none)
- [ ] Domain match
- [ ] Path correct (usually '/')

### Clear All Sessions

```typescript
// Force logout semua devices
export const actions = {
  logoutAll: async ({ locals }) => {
    const userId = locals.user?.id;
    
    // Delete all user sessions
    await locals.db.delete(sessions)
      .where(eq(sessions.userId, userId));
    
    return { success: true };
  }
};
```

---

## 🔧 Debug Authentication

### Check Session di DevTools

```javascript
// Console browser
document.cookie
// Output: auth_session=xxx
```

### Check Server-side

```typescript
// +page.server.ts
export const load = async ({ locals }) => {
  console.log('User:', locals.user);
  console.log('Session:', locals.session);
  
  return {
    isLoggedIn: !!locals.user,
    userId: locals.user?.id
  };
};
```

### Check Database Sessions

```bash
# List active sessions
npx wrangler d1 execute DB --local --command "SELECT * FROM sessions LIMIT 10"

# Check specific user sessions
npx wrangler d1 execute DB --local --command "SELECT * FROM sessions WHERE user_id = 'user-id-here'"
```

---

## 🆘 Common Fixes

### Clear Session Cookie Manual

```javascript
// Console browser
document.cookie = 'auth_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
```

### Reset All Sessions (Emergency)

```bash
# Hapus semua sessions dari database
npx wrangler d1 execute DB --local --command "DELETE FROM sessions"
```

### Test Auth Flow Lokal

```bash
# 1. Register
curl -X POST http://localhost:5173/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123","name":"Test"}'

# 2. Login
curl -X POST http://localhost:5173/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}' \
  -c cookies.txt

# 3. Access protected route
curl http://localhost:5173/api/profile \
  -b cookies.txt
```

---

## 📚 Resources

- [Lucia Auth Docs](https://lucia-auth.com/)
- [Google OAuth Troubleshooting](https://developers.google.com/identity/protocols/oauth2/web-server#troubleshooting)
- [Resend Documentation](https://resend.com/docs)
