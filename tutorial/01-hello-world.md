# Tutorial 1: Hello World 🌍

> **Goal:** Buat API endpoint pertama dan tampilkan di browser  
> **Waktu:** 5 menit  
> **Level:** Pemula (tidak perlu pengalaman coding)

---

## 🎯 Apa yang Akan Kita Buat?

Sebuah halaman web sederhana yang menampilkan pesan "Hello, World!" beserta data dari server.

```
┌─────────────────────────────────────┐
│  🌍 Hello World App                 │
├─────────────────────────────────────┤
│                                     │
│  Pesan dari server:                 │
│  "Halo dari SvelteKit! 👋"          │
│                                     │
│  Waktu server: 14:30:25             │
│                                     │
└─────────────────────────────────────┘
```

---

## 🚀 Let's Code!

### Step 1: Buat API Endpoint (2 menit)

Buat file baru: `src/routes/api/hello/+server.ts`

```typescript
export const GET = async () => {
	const data = {
		message: 'Halo dari SvelteKit! 👋',
		time: new Date().toLocaleTimeString('id-ID'),
		success: true
	};

	return new Response(JSON.stringify(data), {
		headers: { 'Content-Type': 'application/json' }
	});
};
```

**💡 Penjelasan:**
- `+server.ts` = File untuk membuat API endpoint
- `export const GET` = Handle permintaan HTTP GET (seperti ketika Anda buka URL di browser)
- `return new Response()` = Kirim balasan ke browser dalam format JSON

---

### Step 2: Buat Halaman Frontend (2 menit)

Buat file baru: `src/routes/hello/+page.svelte`

```svelte
<script>
	// Data akan diisi saat halaman dimuat
	let message = 'Loading...';
	let time = '';

	// Ambil data dari API saat halaman dimuat
	import { onMount } from 'svelte';
	
	onMount(async () => {
		const res = await fetch('/api/hello');
		const data = await res.json();
		message = data.message;
		time = data.time;
	});
</script>

<div class="container">
	<h1>🌍 Hello World App</h1>
	
	<div class="card">
		<h2>Pesan dari server:</h2>
		<p class="message">{message}</p>
		<p class="time">Waktu server: {time}</p>
	</div>
</div>

<style>
	.container {
		max-width: 600px;
		margin: 50px auto;
		padding: 20px;
		font-family: system-ui, sans-serif;
	}

	h1 {
		color: #ff3e00;
		text-align: center;
	}

	.card {
		background: #f8f9fa;
		border-radius: 12px;
		padding: 24px;
		margin-top: 20px;
		border: 2px solid #e9ecef;
	}

	.message {
		font-size: 1.5rem;
		color: #333;
		margin: 10px 0;
	}

	.time {
		color: #666;
		font-size: 0.9rem;
	}
</style>
```

**💡 Penjelasan:**
- `+page.svelte` = File untuk membuat halaman web
- `onMount` = Jalankan kode saat halaman selesai dimuat di browser
- `fetch('/api/hello')` = Panggil API endpoint yang kita buat tadi
- `{message}` = Tampilkan data di HTML (kurung kurawal = JavaScript expression)

---

### Step 3: Coba di Browser! (1 menit)

1. Pastikan dev server berjalan: `npm run dev`
2. Buka browser: http://localhost:5173/hello
3. Lihat hasilnya! 🎉

---

## ✅ Checkpoint

Jika Anda melihat tampilan seperti ini, berarti SUKSES:

```
🌍 Hello World App

Pesan dari server:
"Halo dari SvelteKit! 👋"

Waktu server: 14:30:25
```

---

## 🤔 Bagaimana Cara Kerjanya?

```
┌──────────┐     fetch()      ┌──────────────┐
│ Browser  │ ───────────────▶ │  /api/hello  │
│ (User)   │                  │  (Server)    │
└──────────┘                  └──────────────┘
      ▲                              │
      │    {message, time}           │
      └──────────────────────────────┘
```

1. **Browser** meminta data ke `/api/hello`
2. **Server** (file `+server.ts`) memproses dan kirim balasan JSON
3. **Browser** menerima data dan menampilkannya

---

## 🎨 Eksperimen

Coba modifikasi kode Anda:

### Ganti Pesan
```typescript
// Di +server.ts
message: 'Selamat datang, Developer! 🚀',
```

### Tambah Data Lain
```typescript
// Di +server.ts
const data = {
	message: 'Halo!',
	time: new Date().toLocaleTimeString('id-ID'),
	date: new Date().toLocaleDateString('id-ID'),  // ➕ Tambah ini
	randomNumber: Math.floor(Math.random() * 100)  // ➕ Dan ini
};
```

Lalu tampilkan di halaman:
```svelte
<p>Tanggal: {date}</p>
<p>Angka random: {randomNumber}</p>
```

---

## 🐛 Troubleshooting

| Error | Solusi |
|-------|--------|
| `404 Not Found` | Pastikan URL benar: `/hello` bukan `/hello-world` |
| `Failed to fetch` | Pastikan dev server jalan (`npm run dev`) |
| Halaman kosong | Check browser console (F12 → Console) untuk error |

---

## 🎯 Apa Selanjutnya?

Di tutorial berikutnya, kita akan membuat **Todo App** lengkap dengan:
- ✅ Menambah todo
- ✅ Menampilkan list
- ✅ Menghapus todo
- ✅ Save ke database

### [➡️ Lanjut ke Tutorial 2: Todo App](./02-todo-app)

---

## 📚 Konsep yang Dipelajari

| Konsep | Penjelasan Singkat |
|--------|-------------------|
| `+server.ts` | File untuk membuat API endpoint |
| `+page.svelte` | File untuk membuat halaman web |
| `fetch()` | Cara browser mengambil data dari server |
| JSON | Format data yang mudah dibaca komputer |
| `export const GET` | Menangani request HTTP GET |

---

**🎉 Selamat! Anda sudah membuat aplikasi web pertama dengan SvelteKit!**
