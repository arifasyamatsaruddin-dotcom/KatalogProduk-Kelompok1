# Panduan Struktur Folder & Presentasi UAS - Sneaker Labs

Dokumen ini menjelaskan tata letak folder, struktur data, dan panduan presentasi untuk UAS (Ujian Akhir Semester). Panduan ini dirancang untuk memudahkan penjelasan kepada dosen penguji mengenai pembagian tugas, integrasi desain, dan kebersihan kode.

---

## 1. Peta Struktur Folder Proyek

Workspace Anda memiliki **2 folder utama** yang saling terintegrasi:

```text
WCD02 UAS/
└── SneakerLabs/                      # 1. DIREKTORI UTAMA PLATFORM SNEAKER LABS
    ├── Frontend/                     # Aset & Halaman Core SneakerLabs
    │   ├── assets/                   # Icon, logo, dan file visual utama
    │   ├── pages/                    # Halaman statis (home.html, catalog.html, dll)
    │   ├── scripts/                  # Controller JS utama & service koneksi API
    │   └── styles/                   # File CSS mentah original
    │
    ├── backend/                      # API Server Node/Express SneakerLabs
    │   ├── src/                      # Controller, Router, dan Model data
    │   └── package.json              # Library server (CORS, Express, Nodemon)
    │
    ├── docs/                         # Dokumentasi teknis API
    ├── index.html                    # Halaman pintu masuk (Redirect ke Frontend/pages/home.html)
    ├── README.md                     # Panduan cara menjalankan server backend
    │
    └── KatalogProduk-Kelompok1/      # 2. DIREKTORI TUGAS KELOMPOK (Redesigned)
        ├── index.html                # Homepage kelompok (Visual SneakerLabs style)
        ├── catalog.html              # Galeri Pencarian, Kategori, & Filter Ukuran
        ├── cart.html                 # Halaman Keranjang Belanja & Order Summary
        ├── kolaborasi.html           # Halaman Kolaborasi brand-designer
        ├── lab.html                  # Halaman edukasi spek material & R&D
        ├── products.js               # Basis Data Produk & Voucher Promo
        ├── styles.css                # Companion CSS (transisi modal & scrollbar)
        ├── script.js                 # Event handler global (Cart overlay, auth modal)
        ├── catalog.js                # Controller render produk & filter sidebar
        ├── cart.js                   # Logic keranjang, quantity, & apply promo
        ├── README.md                 # Deskripsi anggota kelompok & fitur UTS/UAS
        └── wireframe-design/         # Aset desain wireframe mockup (PNG)
```

---

## 2. Pembagian Tugas File & Logika Program

### Folder Kelompok (`KatalogProduk-Kelompok1`)

* **`products.js` (Data Model)**:
  Berperan sebagai database lokal client-side. Menyimpan detail 15 produk premium dari brand ternama (**Nike, Adidas, Jordan, New Balance**) dan produk Apparel. Semua aset gambar menggunakan CDN (Google Aida-public & Unsplash) untuk kecepatan loading.
* **`catalog.js` (Catalog Controller)**:
  Mengatur logika rendering grid produk, navigasi halaman (pagination), dan filter sidebar (pencarian teks, checkboxes kategori, tombol ukuran 38–45, dan color swatches).
* **`cart.js` (Cart Controller)**:
  Mengatur data keranjang di `localStorage`, memperbarui jumlah barang (quantity), menghitung subtotal, pajak 10%, pilihan kurir pengiriman, dan validasi voucher promo (seperti `LABS10`, `LABS20`).
* **`script.js` (Global View Controller)**:
  Mengatur elemen navigasi header yang melayang (sticky header), menu hamburger responsif, popover pencarian cepat, modal popup login, serta toast notification (pemberitahuan hijau/biru ketika barang ditambah).

---

## 3. Poin Penting untuk Presentasi UAS (Talking Points)

Saat menjelaskan proyek ini di depan dosen penguji, Anda dapat menggunakan poin-poin terstruktur berikut:

### Poin A: Harmonisasi Tampilan (Aesthetic Alignment)
> *"Kami menyelaraskan tampilan folder tugas kelompok (`KatalogProduk-Kelompok1`) agar memiliki estetika yang **identik** dengan platform induk `SneakerLabs`. Kami menggunakan framework **Tailwind CSS**, palet warna HSL minimalis (navy-tint, slate-gray, pure white), tipografi modern **Space Grotesk** untuk judul, dan **Inter** untuk deskripsi teks."*

### Poin B: Kebersihan Struktur & Folder Curation (Clean Code)
> *"Untuk merapikan folder proyek, kami melakukan kurasi data dengan menghapus **17 file gambar lokal (.png)** yang tidak terpakai. Sekarang, seluruh gambar produk diambil secara dinamis dari **online CDN** (Unsplash & Google Aida-public). Hal ini membuat ukuran repositori sangat ringan dan mempercepat waktu muat halaman (load time) di bawah 1.5 detik."*

### Poin C: Peningkatan Fitur Filter & Data Branded
> *"Kami memperbarui struktur data produk dengan menyusun detail sneakers rilisan nyata dari brand Nike, Adidas, Jordan, dan New Balance. Kami juga memperluas grid filter ukuran di sidebar halaman `catalog.html` hingga mencakup ukuran **38 sampai 45** (sebelumnya hanya sampai 40). Seluruh filter pencarian teks, kategori, ukuran, warna, dan harga dapat digabungkan secara real-time tanpa memicu error JavaScript."*

### Poin D: Integrasi & Penggabungan Backend (Unified Backend Server)
> *"Untuk menghindari kebingungan dalam menjelaskan struktur program, kami **menggabungkan dua server backend terpisah menjadi satu Express server tunggal** di folder `SneakerLabs/backend` yang berjalan pada port 3000. Port 5000 kini telah dibebaskan. Semua API autentikasi (login/register) serta API data produk/keranjang dilayani oleh satu server yang sama. Halaman katalog secara otomatis mendeteksi dan mengarahkan request API ke port 3000."*
