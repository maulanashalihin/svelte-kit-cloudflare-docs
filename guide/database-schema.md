# Database Schema

Skema database yang digunakan di project ini.

## 🗄️ Entity Relationship Diagram

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│      users      │       │    sessions     │       │  posts          │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id (PK)         │◄──────│ user_id (FK)    │       │ id (PK)         │
│ email (unique)  │       │ id (PK)         │       │ title           │
│ name            │       │ expires_at      │       │ content         │
│ bio             │       └─────────────────┘       │ published       │
│ location        │                                 │ author_id (FK)  │──┐
│ website         │                                 │ created_at      │  │
│ password_hash   │                                 └─────────────────┘  │
│ provider        │                                                    │
│ google_id       │       ┌─────────────────────────┐                   │
│ avatar          │       │ password_reset_tokens   │                   │
│ email_verified  │       ├─────────────────────────┤                   │
│ created_at      │       │ id (PK)                 │                   │
│ updated_at      │       │ user_id (FK)            │◄──────────────────┘
└─────────────────┘       │ token_hash              │
                          │ expires_at              │
                          │ used                    │
                          │ created_at              │
                          └─────────────────────────┘

┌─────────────────────────────┐
│ email_verification_tokens   │
├─────────────────────────────┤
│ id (PK)                     │
│ user_id (FK)                │
│ token_hash                  │
│ expires_at                  │
│ used                        │
│ created_at                  │
└─────────────────────────────┘
```

## 📋 Table Details

### users

Tabel utama untuk menyimpan data user.

```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  bio TEXT,
  location TEXT,
  website TEXT,
  password_hash TEXT,
  provider TEXT DEFAULT 'email',
  google_id TEXT,
  avatar TEXT,
  email_verified BOOLEAN DEFAULT FALSE,
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch())
);
```

| Column | Type | Description |
|--------|------|-------------|
| `id` | TEXT | UUID primary key |
| `email` | TEXT | Unique email address |
| `name` | TEXT | Full name |
| `bio` | TEXT | User bio/description |
| `location` | TEXT | User location |
| `website` | TEXT | Personal website URL |
| `password_hash` | TEXT | Hashed password (null untuk OAuth) |
| `provider` | TEXT | 'email' atau 'google' |
| `google_id` | TEXT | Google OAuth ID |
| `avatar` | TEXT | Avatar URL |
| `email_verified` | BOOLEAN | Email verification status |
| `created_at` | INTEGER | Timestamp creation |
| `updated_at` | INTEGER | Timestamp last update |

### sessions

Tabel session untuk authentication (Lucia Auth).

```sql
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at INTEGER NOT NULL
);
```

### password_reset_tokens

Tabel untuk password reset functionality.

```sql
CREATE TABLE password_reset_tokens (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at INTEGER DEFAULT (unixepoch())
);
```

### email_verification_tokens

Tabel untuk email verification.

```sql
CREATE TABLE email_verification_tokens (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at INTEGER DEFAULT (unixepoch())
);
```

### posts

Tabel contoh untuk posts/articles.

```sql
CREATE TABLE posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  published BOOLEAN DEFAULT FALSE,
  author_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at INTEGER DEFAULT (unixepoch())
);
```

## 🔗 Relations

### One-to-Many Relations

```
users ||--o{ sessions : has
users ||--o{ posts : writes
users ||--o{ password_reset_tokens : has
users ||--o{ email_verification_tokens : has
```

## 📊 Indexes

```sql
-- Users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_google_id ON users(google_id);

-- Sessions
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_expires ON sessions(expires_at);

-- Tokens
CREATE INDEX idx_reset_tokens_user ON password_reset_tokens(user_id);
CREATE INDEX idx_verify_tokens_user ON email_verification_tokens(user_id);

-- Posts
CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_posts_published ON posts(published);
```

## 📝 Drizzle Schema Definition

Contoh definisi schema di Drizzle ORM:

```typescript
// src/lib/db/schema.ts
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  bio: text('bio'),
  location: text('location'),
  website: text('website'),
  passwordHash: text('password_hash'),
  provider: text('provider', { enum: ['email', 'google'] }).default('email'),
  googleId: text('google_id'),
  avatar: text('avatar'),
  emailVerified: integer('email_verified', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at', { mode: 'number' })
    .$defaultFn(() => Date.now()),
  updatedAt: integer('updated_at', { mode: 'number' })
    .$defaultFn(() => Date.now()),
});
```

## 📖 Resources

- [Drizzle ORM Schema](https://orm.drizzle.team/docs/schemas)
- [SQLite Data Types](https://www.sqlite.org/datatype3.html)
