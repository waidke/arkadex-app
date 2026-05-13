---
title: User Flow Diagrams — ArkaDex
product_name: ArkaDex
version: 1.1
status: Approved
author: Eka Dwi Ramadhan
last_updated: 2026-05-13
---

## Change Log

| Versi | Tanggal | Author | Perubahan |
|---|---|---|---|
| v1.0 | 2026-05-13 | Eka Dwi Ramadhan | Initial User Flow Diagrams |
| v1.1 | 2026-05-13 | Eka Dwi Ramadhan | Tambah keterangan agnostik-TCG di Overview; tambah catatan Phase 3+ untuk node pencarian di flow Adding Card to Collection; tambah poin ke-4 di Next Steps |

---

# User Flow Diagrams: ArkaDex

## Overview

Dokumen ini memetakan alur logika pengguna (user flow) untuk fitur-fitur utama ArkaDex fase MVP. Diagram dibuat menggunakan format Mermaid. Flow yang didokumentasikan di sini dirancang untuk MVP Pokemon TCG Indonesia, namun pola interaksi dasarnya (search → detail → add to collection) bersifat agnostik-TCG dan akan digunakan kembali untuk TCG lain di Phase 3+.

---

## Onboarding: Registration & Login

Alur pengguna saat pertama kali membuka aplikasi hingga masuk ke dashboard utama.

```mermaid
flowchart TD
    A[Membuka Aplikasi] --> B{Sudah punya akun?}
    B -- Belum --> C[Halaman Registrasi]
    C --> D[Isi Email, Password, Username]
    D --> E{Validasi Input}
    E -- Gagal --> F[Tampilkan Error State]
    F --> D
    E -- Sukses --> G[Simpan ke DB]
    G --> H[Halaman Login]
    B -- Sudah --> H
    H --> I[Input Email & Password]
    I --> J{Validasi Credential}
    J -- Gagal --> K[Tampilkan Error Alert]
    K --> I
    J -- Sukses --> L[Akses Aplikasi / Koleksiku]
```

---

## Adding Card to Collection

Alur saat pengguna mencari kartu di database dan menambahkannya ke koleksi pribadi.

```mermaid
flowchart TD
    A[Halaman Database / Pencarian] --> B[Ketik Nama Kartu atau Pilih Set]
    B --> C{Sistem Mencari Data}
    C -- Tidak Ditemukan --> D[Tampilkan Empty State Pencarian]
    C -- Ditemukan --> E[Tampilkan Daftar Hasil Pencarian]
    E --> F[Klik Kartu Spesifik]
    F --> G[Buka Modal/Halaman Detail Kartu]
    G --> H[Klik Tombol 'Tambah ke Koleksi']
    H --> I[Buka Modal Input]
    I --> J{Butuh bantuan Kondisi?}
    J -- Ya --> K[Lihat Penjelasan NM/EX/PL]
    K --> I
    J -- Tidak --> L[Pilih Kuantitas & Kondisi]
    L --> M[Submit]
    M --> N[Tampilkan Success Toast]
    N --> O{Cek Duplikasi?}
    O -- Ada --> P[Notifikasi: Kartu sudah ada, jumlah bertambah]
    O -- Baru --> Q[Tambah Entri Baru]
    P --> R[Update Status 'Dimiliki' di UI]
    Q --> R
```

**Catatan Phase 3+:** Node B ("Ketik Nama Kartu atau Pilih Set") akan berkembang menjadi "Pilih TCG Type → Pilih Set → Ketik Nama Kartu" saat multi-TCG diaktifkan. Pola flow tidak berubah, hanya ada langkah filter tambahan di awal.

---

## Managing Collection (View & Edit)

Alur saat pengguna melihat daftar koleksi mereka dan melakukan pembaruan data atau penghapusan via Bottom Sheet.

```mermaid
flowchart TD
    A[Halaman My Collection] --> B{Ada card?}
    B -- Belum ada --> C[Tampilkan Empty State\nCTA: Explore Database]
    C --> D[Navigasi ke Halaman Database]
    B -- Ada --> E[Muat Data Card]
    E --> F{Status Loading}
    F -- Memuat --> G[Tampilkan Shimmer Skeleton\n21 card placeholder]
    F -- Gagal Network --> H[Error State: Koneksi terputus\nCTA: Try Again]
    F -- Gagal Server --> I[Error State: Gagal load collection\nCTA: Try Again]
    H -- Try Again --> E
    I -- Try Again --> E
    F -- Berhasil --> J[Tampilkan Grid Card\nOwned + Not-Owned]
    J --> K{Pilih Card}
    K -- Collapse/expand set header --> J
    K -- Card Dimiliki --> L[Buka Bottom Sheet Edit\nTampilkan qty + kondisi tersimpan]
    K -- Card Belum Dimiliki --> M[Buka Bottom Sheet Tambah\nQty = 0, kondisi belum dipilih]
    L --> N{Aksi di Bottom Sheet}
    M --> N
    N -- Ubah Qty Stepper +/- --> O[Update Qty Display]
    O --> N
    N -- Pilih/Ubah Kondisi NM/EX/GD/PL/PR --> P[Update Kondisi Display]
    P --> N
    N -- Save Changes --> Q{Validasi: kondisi dipilih?}
    Q -- Belum dipilih --> R[Tombol Save disabled\nHighlight field kondisi]
    R --> N
    Q -- Sudah dipilih + Qty > 0 --> S[Simpan perubahan\nKartu tampil sebagai owned + badge kondisi]
    Q -- Sudah dipilih + Qty = 0 --> T[Card kembali ke not-owned state]
    S --> U[Tampilkan Success Toast: Tersimpan!]
    T --> U
    N -- Hapus dari Collection --> V[Dialog konfirmasi:\nHapus card dari collection?]
    V -- Batal --> N
    V -- Hapus --> W[Hapus data\nCard kembali ke not-owned state]
    W --> X[Tampilkan Success Toast: Card dihapus]
    N -- Dismiss tanpa Save --> Y{Ada perubahan yang belum disimpan?}
    Y -- Tidak --> Z[Tutup sheet tanpa perubahan]
    Y -- Ya --> AA[Dialog: Perubahan belum disimpan. Keluar?]
    AA -- Tetap di sini --> N
    AA -- Keluar --> Z
```

---

## Session Timeout & Authentication Error

Alur saat sesi pengguna habis dan perlu login ulang.

```mermaid
flowchart TD
    A[Pengguna membuka aplikasi / navigasi] --> B{Cek validitas sesi}
    B -- Sesi valid --> C[Lanjut ke halaman tujuan]
    B -- Sesi berakhir --> D[Tampilkan Full-Page Error State\nHeading: Sesi sudah habis\nCTA: Login]
    D --> E[Pengguna klik Login]
    E --> F[Redirect ke Halaman Login]
    F --> G[Login ulang]
    G --> C
```

---

## Next Steps

User flows ini siap untuk diterjemahkan ke dalam:
1. Mockup dan wireframe di Figma
2. Component specifications untuk tim engineering
3. Testing scenarios untuk QA
4. Review ulang user flows saat Phase 3+ dimulai untuk mengakomodasi langkah pemilihan TCG Type dan Language sebelum pencarian kartu.
