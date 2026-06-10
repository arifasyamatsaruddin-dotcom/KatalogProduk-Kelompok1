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
| 4 | Audi Amar Abdullah | 25120400026 |

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
UTS/
├── index.html              # Halaman utama dengan hero section dan produk unggulan
├── catalog.html            # Katalog produk lengkap dengan sistem filter
├── cart.html               # Halaman keranjang belanja dan ringkasan pesanan
├── styles.css              # Seluruh styling responsif (1000+ baris)
├── script.js               # Fungsi utama dan animasi
├── catalog.js              # Logika filter dan pagination
├── cart.js                 # Operasi keranjang dan kalkulasi harga
├── products.js             # Basis data produk dan kode promo
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

## Daftar 12 Produk Sneaker Premium

1. **Ultra Runner X1** — $189 (Running)
2. **Street Lab Pro** — $145 (Casual)
3. **Apex Performance** — $199 (Basketball, SALE)
4. **Future Flow** — $225 (Futuristic, NEW)
5. **Classic Lab Limited** — $179 (Casual, BESTSELLER)
6. **Trail Blazer Elite** — $229 (Outdoor, SALE)
7. **Monochrome Zero** — $135 (Casual)
8. **Midnight Edition** — $155 (Casual)
9. **City Runner** — $165 (Running)
10. **Grid Max** — $219 (Basketball, NEW)
11. **Echo Lab Retro** — $175 (Casual, SALE)
12. **Prototype X** — $299 (Futuristic, BESTSELLER)

Seluruh produk telah dilengkapi dengan foto berkualitas tinggi dari Unsplash, pilihan ukuran lengkap (6 hingga 13), varian warna (Black, White, Gray), rating dan ulasan pelanggan, serta diskon harga untuk produk tertentu.

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
