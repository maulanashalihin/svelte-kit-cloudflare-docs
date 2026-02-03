# Tutorial 2: Todo App ✅

> **Goal:** Buat aplikasi Todo List lengkap dengan database  
> **Waktu:** 20 menit  
> **Level:** Pemula  
> **Prerequisite:** Sudah mengikuti [Tutorial 1: Hello World](./01-hello-world)

---

## 🎯 Apa yang Akan Kita Buat?

Aplikasi Todo List sederhana yang bisa:
- ✅ Menambah todo baru
- ✅ Menandai todo selesai/belum
- ✅ Menghapus todo
- ✅ Semua data tersimpan di database

```
┌─────────────────────────────────────┐
│  ✅ Todo App                        │
├─────────────────────────────────────┤
│                                     │
│  [________________] [Tambah]        │
│                                     │
│  ☐ Belajar SvelteKit               │
│  ☑️ Deploy ke Cloudflare   [🗑️]    │
│  ☐ Minum kopi ☕           [🗑️]    │
│                                     │
│  2 dari 3 selesai                   │
│                                     │
└─────────────────────────────────────┘
```

---

## 📚 Step 0: Persiapan Database

Sebelum mulai coding, kita perlu membuat tabel di database.

### Buat File Schema

Edit file: `src/lib/db/schema.ts`

Tambahkan di bagian bawah (setelah tabel `users`):

```typescript
// Tabel untuk Todo
export const todos = sqliteTable('todos', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	userId: integer('user_id').references(() => users.id),
	title: text('title').notNull(),
	completed: integer('completed', { mode: 'boolean' }).default(false),
	createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});
```

### Generate Migration

Jalankan di terminal:

```bash
npm run db:generate
```

Output yang diharapkan:
```
✓ Generated migration files
```

### Apply Migration

```bash
npm run db:migrate:local
```

**💡 Apa itu Migration?**  
Migration adalah cara memberitahu database: "Hey, saya mau tambah tabel baru namanya todos". Ini seperti blueprint untuk database.

---

## 🚀 Step 1: Buat Halaman Todo (Load Data)

Buat folder dan file: `src/routes/todos/+page.server.ts`

```typescript
import { db } from '$lib/db';
import { todos } from '$lib/db/schema';
import { eq, desc } from 'drizzle-orm';

// Load data saat halaman dibuka
export const load = async ({ locals }) => {
	// Ambil semua todo, urutkan dari yang terbaru
	const allTodos = await db.query.todos.findMany({
		orderBy: desc(todos.createdAt)
	});

	return {
		todos: allTodos
	};
};
```

**💡 Penjelasan:**
- `+page.server.ts` = File yang jalan di SERVER sebelum halaman ditampilkan
- `export const load` = Function untuk mengambil data
- `db.query.todos.findMany()` = Ambil semua data dari tabel todos
- `orderBy: desc(todos.createdAt)` = Urutkan dari yang paling baru

---

## 🎨 Step 2: Buat Tampilan Halaman

Buat file: `src/routes/todos/+page.svelte`

```svelte
<script>
	// Data dari server
	export let data;
	
	// Reactive variable untuk list todo
	$: todos = data.todos;
	
	// Input untuk todo baru
	let newTodoTitle = '';
	
	// Hitung progress
	$: completedCount = todos.filter(t => t.completed).length;
	$: totalCount = todos.length;
</script>

<div class="container">
	<h1>✅ Todo App</h1>
	
	<!-- Form Tambah Todo -->
	<form method="POST" action="?/addTodo" class="add-form">
		<input
			type="text"
			name="title"
			placeholder="Apa yang perlu dilakukan?"
			bind:value={newTodoTitle}
			required
		/>
		<button type="submit" class="btn-primary">Tambah</button>
	</form>
	
	<!-- List Todo -->
	<div class="todo-list">
		{#if todos.length === 0}
			<p class="empty">Belum ada todo. Tambahkan yang pertama! 🎉</p>
		{:else}
			{#each todos as todo}
				<div class="todo-item" class:completed={todo.completed}>
					<!-- Checkbox -->
					<form method="POST" action="?/toggleTodo" class="inline-form">
						<input type="hidden" name="id" value={todo.id} />
						<input 
							type="checkbox" 
							checked={todo.completed}
							on:change={(e) => e.target.form.requestSubmit()}
						/>
					</form>
					
					<!-- Title -->
					<span class="todo-title">{todo.title}</span>
					
					<!-- Delete Button -->
					<form method="POST" action="?/deleteTodo" class="inline-form">
						<input type="hidden" name="id" value={todo.id} />
						<button type="submit" class="btn-delete" title="Hapus">🗑️</button>
					</form>
				</div>
			{/each}
		{/if}
	</div>
	
	<!-- Progress -->
	{#if totalCount > 0}
		<div class="progress">
			<p>{completedCount} dari {totalCount} selesai</p>
			<div class="progress-bar">
				<div 
					class="progress-fill" 
					style="width: {(completedCount / totalCount) * 100}%"
				></div>
			</div>
		</div>
	{/if}
</div>

<style>
	.container {
		max-width: 600px;
		margin: 40px auto;
		padding: 20px;
		font-family: system-ui, -apple-system, sans-serif;
	}

	h1 {
		color: #ff3e00;
		text-align: center;
		margin-bottom: 30px;
	}

	.add-form {
		display: flex;
		gap: 10px;
		margin-bottom: 20px;
	}

	.add-form input {
		flex: 1;
		padding: 12px 16px;
		border: 2px solid #e2e8f0;
		border-radius: 8px;
		font-size: 1rem;
	}

	.add-form input:focus {
		outline: none;
		border-color: #ff3e00;
	}

	.btn-primary {
		padding: 12px 24px;
		background: #ff3e00;
		color: white;
		border: none;
		border-radius: 8px;
		font-size: 1rem;
		cursor: pointer;
		transition: background 0.2s;
	}

	.btn-primary:hover {
		background: #e63600;
	}

	.todo-list {
		background: white;
		border-radius: 12px;
		box-shadow: 0 2px 8px rgba(0,0,0,0.1);
		overflow: hidden;
	}

	.todo-item {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 16px 20px;
		border-bottom: 1px solid #e2e8f0;
		transition: background 0.2s;
	}

	.todo-item:last-child {
		border-bottom: none;
	}

	.todo-item:hover {
		background: #f8fafc;
	}

	.todo-item.completed .todo-title {
		text-decoration: line-through;
		color: #94a3b8;
	}

	.todo-title {
		flex: 1;
		font-size: 1rem;
	}

	.inline-form {
		display: inline;
	}

	.inline-form input[type="checkbox"] {
		width: 20px;
		height: 20px;
		cursor: pointer;
	}

	.btn-delete {
		background: none;
		border: none;
		cursor: pointer;
		font-size: 1.2rem;
		padding: 4px 8px;
		opacity: 0.6;
		transition: opacity 0.2s;
	}

	.btn-delete:hover {
		opacity: 1;
	}

	.empty {
		text-align: center;
		color: #64748b;
		padding: 40px;
	}

	.progress {
		margin-top: 20px;
		text-align: center;
	}

	.progress p {
		color: #64748b;
		margin-bottom: 8px;
	}

	.progress-bar {
		height: 8px;
		background: #e2e8f0;
		border-radius: 4px;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background: #22c55e;
		transition: width 0.3s ease;
	}
</style>
```

---

## ⚡ Step 3: Tambah Form Actions

Edit file: `src/routes/todos/+page.server.ts`

Tambahkan di bagian bawah:

```typescript
import { db } from '$lib/db';
import { todos } from '$lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';

export const load = async () => {
	const allTodos = await db.query.todos.findMany({
		orderBy: desc(todos.createdAt)
	});
	return { todos: allTodos };
};

// ⬇️ TAMBAHKAN INI ⬇️
export const actions = {
	// Action: Tambah Todo
	addTodo: async ({ request }) => {
		const form = await request.formData();
		const title = form.get('title');

		// Validasi
		if (!title || typeof title !== 'string' || title.trim() === '') {
			return fail(400, { error: 'Todo tidak boleh kosong' });
		}

		// Insert ke database
		await db.insert(todos).values({
			title: title.trim(),
			completed: false
		});

		return { success: true };
	},

	// Action: Toggle Complete/Uncomplete
	toggleTodo: async ({ request }) => {
		const form = await request.formData();
		const id = Number(form.get('id'));

		// Ambil todo yang ada
		const todo = await db.query.todos.findFirst({
			where: eq(todos.id, id)
		});

		if (todo) {
			// Update status (toggle)
			await db.update(todos)
				.set({ completed: !todo.completed })
				.where(eq(todos.id, id));
		}

		return { success: true };
	},

	// Action: Hapus Todo
	deleteTodo: async ({ request }) => {
		const form = await request.formData();
		const id = Number(form.get('id'));

		await db.delete(todos).where(eq(todos.id, id));

		return { success: true };
	}
};
```

**💡 Penjelasan:**
- `export const actions` = Object berisi function untuk handle form submission
- `request.formData()` = Ambil data dari form HTML
- `db.insert(todos).values({...})` = Insert data ke database
- `db.update(todos).set({...}).where(...)` = Update data
- `db.delete(todos).where(...)` = Hapus data

---

## ✅ Step 4: Test Aplikasi!

1. Buka browser: http://localhost:5173/todos
2. Coba tambah todo baru
3. Coba checklist/uncheck todo
4. Coba hapus todo

**🎉 Keren! Anda sudah membuat aplikasi CRUD lengkap!**

---

## 🧠 Konsep Penting yang Dipelajari

### 1. CRUD Operations

| Operation | Database Action | File |
|-----------|----------------|------|
| **C**reate | `db.insert()` | `addTodo` action |
| **R**ead | `db.query.findMany()` | `load` function |
| **U**pdate | `db.update().set()` | `toggleTodo` action |
| **D**elete | `db.delete()` | `deleteTodo` action |

### 2. Form Actions vs API Routes

**Form Actions (yang kita pakai):**
- ✅ Works tanpa JavaScript
- ✅ 1 file (`+page.server.ts`)
- ✅ Auto reload page setelah submit

**API Routes (alternatif):**
- Butuh JavaScript fetch
- Butuh 2 file (`+server.ts` + `+page.svelte`)
- Manual update UI

### 3. Server vs Client

```
+page.server.ts  →  Jalan di SERVER (sebelum halaman ditampilkan)
+page.svelte     →  Jalan di CLIENT (di browser user)
```

---

## 🎨 Eksperimen

### 1. Tambah Validasi Panjang
```typescript
if (title.length > 100) {
	return fail(400, { error: 'Todo terlalu panjang (max 100 karakter)' });
}
```

### 2. Tambah Filter (All/Active/Completed)
Tambahkan tabs di atas list untuk filter todo.

### 3. Tambah Edit Todo
Tambahkan action baru `editTodo` untuk mengubah text todo.

### 4. Tambah Due Date
Tambahkan field `dueDate` di schema dan form.

---

## 🐛 Troubleshooting

| Error | Solusi |
|-------|--------|
| `table todos does not exist` | Jalankan `npm run db:migrate:local` lagi |
| `Cannot find module '$lib/db/schema'` | Check import path, pastikan file schema.ts ada |
| Form tidak submit | Check browser console untuk error JavaScript |
| Data tidak muncul | Pastikan `load` function return `{ todos: ... }` |

---

## 🎯 Apa Selanjutnya?

Di tutorial berikutnya, kita akan belajar:
- 🔐 Authentication: Login & Register
- 👤 User-specific todos (setiap user punya todo sendiri)
- 🖼️ Upload file (avatar user)

### [➡️ Lanjut ke Tutorial 3: User Authentication](./03-authentication)

Atau pelajari **cookbook** untuk solusi cepat:
- [Protect Route dengan Login](../cookbook/protect-route)
- [Form Validation](../cookbook/form-validation)

---

**🎉 Selamat! Anda sudah bisa membuat aplikasi database-driven dengan SvelteKit!**
