# Customizing Database Schema

Panduan lengkap memodifikasi database schema untuk fitur custom.

## 📋 Overview

Project menggunakan **Drizzle ORM** dengan pendekatan schema-first:
1. Define schema di `src/lib/db/schema.ts`
2. Generate migration dengan `npm run db:generate`
3. Apply migration dengan `npm run db:migrate:local`

---

## 🚀 Quick Guide: Menambah Kolom

### Step 1: Edit Schema

```typescript
// src/lib/db/schema.ts
export const users = sqliteTable('users', {
  // ... existing columns
  
  // Tambah kolom baru
  phone: text('phone'),           // Nullable
  birthday: integer('birthday', { mode: 'timestamp' }), // Date
  isAdmin: integer('is_admin', { mode: 'boolean' }).default(false),
});
```

### Step 2: Generate Migration

```bash
npm run db:generate
# Output: drizzle/0003_add_user_columns.sql
```

### Step 3: Apply Migration

```bash
npm run db:migrate:local
```

**Done!** 🎉

---

## 🗂️ Data Types Reference

### SQLite Types di Drizzle

```typescript
import { 
  text, 
  integer, 
  real, 
  blob 
} from 'drizzle-orm/sqlite-core';

// TEXT
const columns = {
  // String biasa
  name: text('name').notNull(),
  
  // String dengan length limit (validasi app-level)
  bio: text('bio', { length: 500 }),
  
  // Enum (type safety)
  status: text('status', { 
    enum: ['active', 'inactive', 'banned'] 
  }).default('active'),
  
  // Unique
  email: text('email').notNull().unique(),
  
  // Indexed
  searchKey: text('search_key').notNull().$defaultFn(() => generateKey()),
};

// INTEGER
const columns = {
  // Auto increment ID
  id: integer('id').primaryKey({ autoIncrement: true }),
  
  // Boolean
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  
  // Timestamp
  createdAt: integer('created_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date()),
  
  // Unix epoch (recommended untuk edge)
  updatedAt: integer('updated_at', { mode: 'number' })
    .$defaultFn(() => Date.now()),
  
  // Counter
  viewCount: integer('view_count').default(0),
};

// REAL (floating point)
const columns = {
  price: real('price').notNull(),
  rating: real('rating').default(5.0),
};

// BLOB (binary data)
const columns = {
  // Untuk small binary data saja
  // Untuk files, gunakan R2 storage!
  avatarData: blob('avatar_data'), // ❌ Jangan untuk production
};
```

---

## 📊 Common Schema Patterns

### 1. Posts/Articles

```typescript
export const posts = sqliteTable('posts', {
  id: text('id').primaryKey(), // UUID
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(), // URL-friendly
  content: text('content').notNull(),
  excerpt: text('excerpt'), // Summary
  coverImage: text('cover_image'),
  
  // Status
  status: text('status', { 
    enum: ['draft', 'published', 'archived'] 
  }).default('draft'),
  
  // Metadata
  publishedAt: integer('published_at', { mode: 'timestamp' }),
  readTime: integer('read_time'), // minutes
  viewCount: integer('view_count').default(0),
  
  // Relations
  authorId: text('author_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  categoryId: text('category_id')
    .references(() => categories.id, { onDelete: 'set null' }),
  
  // Timestamps
  createdAt: integer('created_at', { mode: 'number' })
    .$defaultFn(() => Date.now()),
  updatedAt: integer('updated_at', { mode: 'number' })
    .$defaultFn(() => Date.now()),
});

// Indexes untuk query performance
export const postsIndexes = {
  slugIdx: index('posts_slug_idx').on(posts.slug),
  authorIdx: index('posts_author_idx').on(posts.authorId),
  statusIdx: index('posts_status_idx').on(posts.status),
  publishedIdx: index('posts_published_idx').on(posts.publishedAt),
};
```

### 2. Categories (Tree Structure)

```typescript
export const categories = sqliteTable('categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  
  // Self-reference untuk tree
  parentId: text('parent_id')
    .references(() => categories.id, { onDelete: 'cascade' }),
  
  // Tree metadata
  level: integer('level').default(0),
  sortOrder: integer('sort_order').default(0),
  
  createdAt: integer('created_at', { mode: 'number' })
    .$defaultFn(() => Date.now()),
});
```

### 3. Comments (Nested)

```typescript
export const comments = sqliteTable('comments', {
  id: text('id').primaryKey(),
  content: text('content').notNull(),
  
  // Polymorphic-like (bisa untuk post atau product)
  commentableType: text('commentable_type', {
    enum: ['post', 'product']
  }).notNull(),
  commentableId: text('commentable_id').notNull(),
  
  // Nested replies
  parentId: text('parent_id')
    .references(() => comments.id, { onDelete: 'cascade' }),
  
  // Author
  authorId: text('author_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  
  // Moderation
  status: text('status', {
    enum: ['pending', 'approved', 'rejected', 'spam']
  }).default('pending'),
  
  // Engagement
  likesCount: integer('likes_count').default(0),
  
  createdAt: integer('created_at', { mode: 'number' })
    .$defaultFn(() => Date.now()),
});
```

---

## 🔗 Relations

### One-to-Many

```typescript
// User has many Posts
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
}));

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id]
  }),
}));
```

### Many-to-Many

```typescript
// Posts <-> Tags
export const postTags = sqliteTable('post_tags', {
  postId: text('post_id')
    .notNull()
    .references(() => posts.id, { onDelete: 'cascade' }),
  tagId: text('tag_id')
    .notNull()
    .references(() => tags.id, { onDelete: 'cascade' }),
}, (table) => ({
  pk: primaryKey(table.postId, table.tagId),
}));

export const tags = sqliteTable('tags', {
  id: text('id').primaryKey(),
  name: text('name').notNull().unique(),
  slug: text('slug').notNull().unique(),
});

// Relations
export const postsRelations = relations(posts, ({ many }) => ({
  tags: many(postTags),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  posts: many(postTags),
}));
```

---

## 📝 Step-by-Step: Menambah Tabel Baru

### Contoh: Todo Items

**Step 1: Define Schema**

```typescript
// src/lib/db/schema.ts

// Add new table
export const todos = sqliteTable('todos', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  
  // Status
  status: text('status', {
    enum: ['pending', 'in_progress', 'completed', 'cancelled']
  }).default('pending'),
  
  priority: integer('priority').default(0), // 0=low, 1=normal, 2=high
  
  // Due date
  dueDate: integer('due_date', { mode: 'timestamp' }),
  completedAt: integer('completed_at', { mode: 'timestamp' }),
  
  // Relations
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  
  // Timestamps
  createdAt: integer('created_at', { mode: 'number' })
    .$defaultFn(() => Date.now()),
  updatedAt: integer('updated_at', { mode: 'number' })
    .$defaultFn(() => Date.now()),
}, (table) => ({
  userIdx: index('todos_user_idx').on(table.userId),
  statusIdx: index('todos_status_idx').on(table.status),
  dueIdx: index('todos_due_idx').on(table.dueDate),
}));

// Add relations
export const usersRelations = relations(users, ({ many }) => ({
  // ... existing relations
  todos: many(todos),
}));

export const todosRelations = relations(todos, ({ one }) => ({
  user: one(users, {
    fields: [todos.userId],
    references: [users.id]
  }),
}));
```

**Step 2: Generate Migration**

```bash
npm run db:generate
```

**Step 3: Check Migration File**

```sql
-- drizzle/000X_add_todos.sql
CREATE TABLE `todos` (
  `id` text PRIMARY KEY NOT NULL,
  `title` text NOT NULL,
  `description` text,
  `status` text DEFAULT 'pending' NOT NULL,
  `priority` integer DEFAULT 0,
  `due_date` integer,
  `completed_at` integer,
  `user_id` text NOT NULL,
  `created_at` integer DEFAULT (unixepoch()),
  `updated_at` integer DEFAULT (unixepoch()),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade
);

CREATE INDEX `todos_user_idx` ON `todos` (`user_id`);
CREATE INDEX `todos_status_idx` ON `todos` (`status`);
CREATE INDEX `todos_due_idx` ON `todos` (`due_date`);
```

**Step 4: Apply Migration**

```bash
npm run db:migrate:local
```

**Step 5: Create API**

```typescript
// src/routes/api/todos/+server.ts
import { json, error } from '@sveltejs/kit';
import { todos } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import { generateId } from '$lib/auth/lucia';

export const GET = async ({ locals }) => {
  if (!locals.user) {
    throw error(401, 'Unauthorized');
  }
  
  const userTodos = await locals.db.query.todos.findMany({
    where: eq(todos.userId, locals.user.id),
    orderBy: (todos, { desc }) => [desc(todos.createdAt)]
  });
  
  return json({ data: userTodos });
};

export const POST = async ({ request, locals }) => {
  if (!locals.user) {
    throw error(401, 'Unauthorized');
  }
  
  const body = await request.json();
  
  const newTodo = await locals.db.insert(todos).values({
    id: generateId(),
    title: body.title,
    description: body.description,
    dueDate: body.dueDate ? new Date(body.dueDate) : null,
    userId: locals.user.id
  }).returning();
  
  return json({ data: newTodo[0] }, { status: 201 });
};
```

**Step 6: Update Types (opsional)**

```typescript
// src/lib/db/types.ts
import type { todos } from './schema';

export type Todo = typeof todos.$inferSelect;
export type NewTodo = typeof todos.$inferInsert;
```

---

## 🔄 Altering Existing Tables

### Menambah Kolom

```typescript
// Edit schema.ts
export const users = sqliteTable('users', {
  // ... existing columns
  phone: text('phone'), // New column
});
```

### Migration Strategy

```bash
# Generate
npm run db:generate

# Check file
# drizzle/000X_add_phone_to_users.sql
# ALTER TABLE users ADD COLUMN phone text;

# Apply
npm run db:migrate:local
```

---

## 🗑️ Data Seeding

```typescript
// scripts/seed-todos.ts
import { drizzle } from 'drizzle-orm/d1';
import { todos } from '../src/lib/db/schema';
import { generateId } from '../src/lib/auth/lucia';

export async function seedTodos(db: D1Database) {
  const d = drizzle(db);
  
  await d.insert(todos).values([
    {
      id: generateId(),
      title: 'Learn SvelteKit',
      status: 'in_progress',
      priority: 2,
      userId: 'user-1'
    },
    {
      id: generateId(),
      title: 'Deploy to Cloudflare',
      status: 'pending',
      priority: 1,
      userId: 'user-1'
    }
  ]);
}
```

---

## ⚠️ Best Practices

1. **Always backup sebelum migration major**
2. **Test migration di local dulu**
3. **Gunakan transactions untuk data integrity**
4. **Add indexes untuk columns yang sering di-query**
5. **Keep migrations reversible (kalau bisa)**
6. **Don't drop columns dengan data penting**

---

**Selamat mengcustomize! 🎉**
