# Calper

Aplikasi rekap Billing dan F&B Order berbasis React, Vite, dan Tailwind CSS. Setiap transaksi bersifat independen, mulai dari harga awal, penyesuaian pesanan, pembayaran Cash/QRIS, hingga hasil kembalian atau kekurangan pembayaran.

## Fitur

- Section billing independen dengan nama yang dapat diedit.
- Status Billing manual dengan kategori Booking, Aktif, dan Lunas.
- Filter status Billing dengan jumlah session pada setiap kategori.
- Dropdown paket PS5, Suite, VIP, dan PS4.
- Tambah jam menggunakan tarif paket atau harga manual jika tarif tidak tersedia.
- Semua makanan dan minuman otomatis ditambahkan ke total tagihan.
- Item makanan atau minuman manual untuk menu di luar katalog.
- Dropdown katalog makanan dan minuman dengan harga otomatis dari price list.
- Pembayaran Cash dan QRIS, termasuk split bill.
- Metode DP Cash dan DP QRIS pada menu Billing.
- Ringkasan total tagihan, total diterima, kembalian, dan kurang bayar.
- Input nominal menerima format `50000`, `50.000`, atau `50k`.
- Keyboard nominal mendukung penulisan singkat seperti `10k` langsung dari HP.
- Setiap item memiliki Qty dan subtotal otomatis dari harga satuan dikali jumlah.
- Tampilan mobile-first untuk penggunaan frontliner.
- Menu Billing dan F&B Order dengan data yang terpisah.
- F&B Order menggunakan identitas TRX dan menghitung nominal dari daftar pesanan.
- Menu Recap untuk total pemasukan Cash, QRIS, dan keseluruhan per hari.
- DP Cash dan DP QRIS otomatis dikelompokkan ke metode pembayaran terkait.
- Recap menggunakan pemasukan bersih sehingga uang kembalian tidak ikut dihitung.
- Dropdown pencarian terpisah untuk nama section Billing dan TRX F&B Order.
- Reset seluruh workspace dengan konfirmasi dan menyisakan satu form kosong per menu.
- Export dan import backup `.json` untuk seluruh session, menu, serta riwayat recap.
- Kontrol Backup, Import, dan Reset tersedia dalam menu titik tiga vertikal di sebelah kanan tombol tambah.
- Penyimpanan otomatis ke `localStorage` setiap kali data berubah.
- Data dan menu terakhir dipulihkan otomatis setelah halaman dimuat ulang.

## Menjalankan lokal

```bash
npm install
npm run dev
```

## Pemeriksaan proyek

```bash
npm run lint
npm run build
```

## Deploy ke GitHub Pages

Pastikan proyek sudah berada di repository GitHub dan remote `origin` sudah tersedia, kemudian jalankan:

```bash
npm run deploy
```

Perintah tersebut membangun aplikasi dan mengirim isi folder `dist` ke branch `gh-pages`. Di GitHub, buka **Settings > Pages**, lalu pilih branch `gh-pages` sebagai sumber deployment jika belum terpilih otomatis.

Konfigurasi Vite menggunakan `base: './'`, jadi aset aplikasi dapat dimuat baik pada project page (`username.github.io/nama-repo`) maupun domain kustom.
