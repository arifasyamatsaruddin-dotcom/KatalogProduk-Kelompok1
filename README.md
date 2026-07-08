# SNEAKER LABS - Platform Sneaker Tech-Wear Eksperimental

Proyek ini merupakan aplikasi e-commerce yang dikembangkan sebagai tugas UTS, berupa platform belanja sneaker premium dengan tampilan yang terinspirasi dari estetika laboratorium teknologi. Sistem dirancang menggunakan skema warna monokromatik (hitam, putih, dan abu-abu) untuk menciptakan nuansa futuristik yang bersih dan modern.

**Fitur Utama:** Antarmuka minimalis modern | Pembaruan keranjang secara real-time | Filter produk tingkat lanjut | Manajemen wishlist | Desain responsif

---

## Anggota Kelompok

| No | Nama | NIM |
|----|------|-----|
| 1 | Arif Asyam Atsaruddin | 25120400004 |
| 2 | Aurelia Monic | 25120400018 |
| 3 | Anja Safila | 25120400006 |
| 4 | Audi Ammar Abdullah | 25120400026 |

---

## Konsep Desain

**Sneaker Labs** diposisikan sebagai platform eksperimental untuk sneaker premium dengan tampilan minimalis. Filosofi desain yang digunakan mengacu pada beberapa prinsip berikut:

**Palet Monokromatik** — Dominan hitam, putih, dan abu-abu untuk menghadirkan kesan tech-lab yang modern dan elegan.

**Tipografi Bersih** — Penggunaan huruf tebal dan kapital untuk memberikan kesan yang tegas dan kontemporer.

**Tata Letak Minimalis** — Susunan grid yang lega dengan jarak antar elemen yang teratur dan rapi.

**Estetika Tech-Wear** — Pendekatan desain yang futuristik namun tetap fungsional dan nyaman digunakan.

---

## Struktur Proyek

```
KatalogProduk-Kelompok1/
├── index.html              # Halaman utama (Hero section, brand specs, featured products)
├── catalog.html            # Halaman catalog (Sticky filter sidebar, search, results header)
├── cart.html               # Halaman keranjang belanja (Split layout, order summary)
├── kolaborasi.html         # Halaman kolaborasi (Premium cards grid, CTA section)
├── lab.html                # Halaman lab (Design process, materials, R&D specs, QA stats)
├── products.js             # Unified database (Nike, Adidas, Jordan, NB, Apparel)
├── styles.css              # Companion styling, transitions, active states, custom scrollbars
├── script.js               # Core dynamic elements, overlays, notifications
├── catalog.js              # Logika dynamic product card render, filters, and pagination
├── cart.js                 # Logika cart calculations, promo validation, quantity update
└── README.md               # Dokumentasi proyek
```

---

## Fitur Utama

### Halaman Utama (Homepage)

**Hero Section** — Menampilkan produk unggulan dengan efek parallax yang menarik perhatian pengguna sejak pertama kali mengakses halaman.

**Badge Eksperimental** — Identitas visual berupa label "Experimental Tech-Wear" sebagai ciri khas brand.

**Featured Lab** — Kurasi produk pilihan yang ditampilkan secara menonjol di halaman depan.

**Newsletter Lab Updates** — Formulir langganan email untuk mendapatkan informasi terbaru.

**About Grid** — Informasi fitur brand yang dilengkapi animasi hover interaktif.

**Desain Responsif** — Tampilan yang dioptimalkan untuk berbagai ukuran layar.

### Katalog Produk

**Sistem Filter Tingkat Lanjut** yang mencakup:
- Filter berdasarkan kategori (Running, Casual, Basketball, Futuristic, Outdoor)
- Filter berdasarkan ukuran sepatu (6 hingga 13)
- Filter berdasarkan warna (Black, Gray, White)
- Slider harga yang dapat disesuaikan secara dinamis
- Fitur pencarian secara real-time

**Opsi Pengurutan** yang tersedia:
- Terbaru / Produk baru masuk
- Harga dari termurah ke termahal
- Harga dari termahal ke termurah
- Terpopuler berdasarkan jumlah ulasan

**12 Produk Sneaker Premium** dengan foto berkualitas tinggi yang bersumber dari Unsplash.

### Fitur Belanja

**Sidebar Keranjang** — Panel yang muncul dari sisi layar, menampilkan kuantitas dan total harga secara langsung.

**Manajemen Wishlist** — Ikon hati untuk menyimpan produk favorit ke dalam daftar keinginan.

**Halaman Keranjang Lengkap** — Ringkasan pesanan yang menyeluruh dengan kalkulasi harga otomatis.

**Kode Promo** — Tersedia kode LABS10, LABS20, SNEAKER, dan WELCOME.

### Navigasi

Header yang bersifat sticky dilengkapi dengan search bar, penghitung wishlist dan keranjang yang diperbarui secara otomatis, menu hamburger untuk tampilan mobile, serta fitur pencarian real-time.

---

## Daftar 15 Specimen Produk Premium

1. **NIKE AIR MAX X1** — $210 (Lifestyle, BESTSELLER)
2. **JORDAN 1 RETRO** — $320 (Basketball, LIMITED)
3. **NIKE AIR MAX ALPHA** — $210 (Running, LAB SPECIMEN)
4. **AIR MAX "LAB ZERO"** — $240 (Lifestyle, NEW)
5. **FORUM HIGH ARCHIVE** — $180 (Basketball, NEW)
6. **990v6 PROTOTYPE** — $220 (Running, NEW - New Balance)
7. **RETRO HIGH "LAB SLATE"** — $190 (Basketball, NEW - Jordan)
8. **ADIDAS ALPHA FLY** — $260 (Running, HOT)
9. **NB VAPORWAVE** — $150 (Lifestyle, POPULAR)
10. **CYBER RUNNER** — $280 (Running, NEW)
11. **ADIDAS YEEZY 350 BOOST** — $220 (Lifestyle, SALE)
12. **NIKE DUNKS LOW PRO** — $110 (Lifestyle, POPULAR)
13. **LAB TECH HOODIE** — $89 (Apparel, NEW)
14. **VELOCITY TEE** — $45 (Apparel)
15. **UTILITY WINDBREAKER** — $119 (Apparel, SALE)

Semua specimen produk kini menggunakan foto berkualitas tinggi dari Google Aida-public dan Unsplash, pilihan ukuran lengkap (XS-XL untuk Apparel, dan 38-45 untuk Sepatu), variasi warna premium, ulasan pelanggan, serta promo diskon.

---

## Skema Warna

```
Hitam (Utama)        #000000
Putih (Sekunder)     #FFFFFF
Abu Gelap            #1A1A1A
Abu Terang           #F5F5F5
Abu Sedang           #B3B3B3
Abu Gelap (Teks)     #666666
```

---

## Breakpoint Responsif

**Desktop (1200px ke atas)** — Tata letak penuh dengan seluruh fitur aktif.

**Tablet (768px hingga 1024px)** — Grid dan jarak antar elemen yang telah disesuaikan.

**Mobile (480px hingga 768px)** — Tata letak 2 kolom dengan menu hamburger aktif.

**Mobile Kecil (di bawah 480px)** — Tata letak 1 kolom dengan tipografi yang dioptimalkan.

---

## Teknologi yang Digunakan

**HTML5** — Markup semantik yang terstruktur dengan baik.

**CSS3** — Styling modern yang mendukung tampilan responsif.

**Vanilla JavaScript** — Murni JavaScript tanpa ketergantungan terhadap library eksternal.

**LocalStorage API** — Digunakan untuk menyimpan data keranjang dan wishlist secara persisten di browser pengguna.

**Unsplash API** — Sumber gambar produk berkualitas tinggi.

---

## Penyimpanan Data

Seluruh data disimpan di localStorage browser sehingga tidak memerlukan backend. Data yang tersimpan meliputi:

**cart** — Isi keranjang belanja pengguna.

**wishlist** — Produk yang disimpan sebagai favorit.

**searchQuery** — Kata kunci pencarian terakhir yang digunakan.

---

## Keunggulan Proyek

**Foto Premium** — Gambar sneaker asli bersumber dari Unsplash.

**Filter Tingkat Lanjut** — Mendukung penggunaan beberapa filter secara bersamaan.

**Sistem Wishlist** — Fitur penyimpanan favorit yang lengkap dan fungsional.

**Manajemen Keranjang** — Pengalaman belanja yang intuitif bagi pengguna.

**Ramah Perangkat Mobile** — Tampilan yang optimal di semua jenis perangkat.

**Tanpa Backend** — Sistem berjalan sepenuhnya di sisi klien (100% client-side).

**Loading Cepat** — Performa yang telah dioptimalkan untuk kecepatan akses.

**Desain Monokromatik** — Estetika modern yang sesuai dengan konsep tech-wear.

---

## Cara Menggunakan

1. **Buka Halaman Utama** — Buka file `index.html` melalui browser.
2. **Jelajahi Produk** — Klik tombol "Jelajahi Katalog" untuk melihat seluruh produk.
3. **Gunakan Filter** — Saring produk berdasarkan kategori, ukuran, warna, atau rentang harga.
4. **Cari Produk** — Manfaatkan search bar untuk menemukan produk tertentu.
5. **Tambah ke Keranjang** — Klik produk kemudian klik tombol "Tambah ke Keranjang".
6. **Wishlist** — Klik ikon hati untuk menyimpan produk ke dalam daftar favorit.
7. **Lihat Keranjang** — Klik ikon keranjang untuk membuka panel pratinjau.
8. **Checkout** — Masuk ke halaman keranjang untuk melihat ringkasan pesanan secara lengkap.

---

## Kode Promo

| Kode | Diskon |
|------|--------|
| `LABS10` | Diskon 10% |
| `LABS20` | Diskon 20% |
| `SNEAKER` | Diskon 15% |
| `WELCOME` | Diskon 25% |

---

## Panduan Kustomisasi

**Menambah Produk** — Edit file `products.js` dan tambahkan data produk baru ke dalam array dengan struktur yang sesuai.

**Mengubah Warna** — Edit variabel CSS pada file `styles.css` di bagian deklarasi `:root`.

**Mengubah Nama Brand** — Cari dan ganti seluruh teks "SNEAKER LABS" pada semua file HTML.

---

## Dukungan Browser

Chrome/Chromium | Firefox | Safari | Edge | Browser Mobile

---

## Performa

**Waktu Muat** — Di bawah 2 detik.

**Total Ukuran File** — Sekitar 300KB.

**Skor Lighthouse** — Sekitar 95.

---

## Nilai Pembelajaran

Proyek ini dapat dijadikan referensi pembelajaran untuk memahami konsep-konsep berikut:
- CSS Grid dan Flexbox
- localStorage API
- Event delegation
- Desain responsif
- Pola-pola modern dalam pemrograman JavaScript

---

[Homepage](index.html) | [Catalog](catalog.html) | [Cart](cart.html)
