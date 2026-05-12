---
title: Wireframe Specification & Component Structure — ArkaDex
product_name: ArkaDex
version: 1.0
status: Approved
author: Eka Dwi Ramadhan
last_updated: 2026-05-13
---

# Wireframe Specification & Component Structure: ArkaDex

## Overview

Dokumen ini mendeskripsikan secara tekstual struktur antarmuka (wireframe) halaman-halaman utama ArkaDex. Ini berfungsi sebagai blueprint sebelum di-coding atau digambar hi-fi di Figma.

---

## Global Components

### Navigation Bar (Mobile)

- **Posisi:** Sticky Bottom (karena penggunaan dominan di HP).
- **Isi (3 Menu Utama):**
    - [Icon Buku] Koleksi (Aktif/Default)
    - [Icon Kaca Pembesar] Database
    - [Icon Orang] Profil
- **Perilaku Desktop:** Berubah menjadi top navigation bar di bagian atas halaman (Kiri: Logo, Kanan: Links Menu).

---

## Page: My Collection (Dashboard)

Halaman ini adalah layar pertama yang dilihat pengguna setelah login.

### Struktur Layout

1. **Header Halaman:**
    - Judul: "Koleksiku" (H1)
    - Teks sub-judul: "Total: 150 Kartu" (Caption)

2. **View Toggle Bar:**
    - [Icon Grid] Visual View (Aktif) | [Icon List] Table View

3. **Group Content (Diulang per Set Kartu):**
    - **Header Set (Sticky):**
        - Nama Set (misalnya: "SV1S - Scarlet ex").
        - Progress Kelengkapan: Teks ("10 / 78") + Mini Progress Bar (tetap terlihat meski Set di-collapse).
    - **Card Area (Jika Grid View dipilih):**
        - Layout: Grid 3 kolom (mobile) / 5 kolom (tablet/desktop).
        - **Card Item (Visual Placeholder):**
            - Kotak warna solid rasio 2.5:3.5.
            - Tengah: Simbol elemen abstrak.
            - Bawah (Overlay): Badge jumlah "x2".
            - Atas Kanan (Overlay): Ikon Pensil Kecil (Edit) — Hanya muncul di area kartu yang dimiliki.
            - Bawah Luar: Teks Nama Kartu & Rarity (misalnya: "Pikachu", "C").
            - Interaksi: Tap kartu untuk Edit Detail; Long-press untuk aksi cepat (Hapus/Tambah).
    - **Card Area (Jika List/Table View dipilih):**
        - Layout: Baris vertikal menyusun dari atas ke bawah.
        - **Row Item:**
            - Kiri: Nomor (001/078).
            - Tengah: Nama Kartu + Badge Kondisi ("Baik").
            - Kanan: Jumlah (x2) & Rarity (C).

4. **Empty State (Bila Koleksi Kosong):**
    - Ilustrasi besar di tengah (Placeholder box/SVG).
    - Teks: "Koleksimu masih kosong!"
    - Button Primary: "Cari Kartu Pertamamu" (Navigasi ke tab Database).

---

## Page: Card Database (Search)

Fokus halaman ini adalah kecepatan mencari kartu untuk ditambahkan ke koleksi.

### Struktur Layout

1. **Search & Filter Bar (Sticky Top):**
    - Input Text: "Cari nama kartu..." (dengan ikon kaca pembesar).
    - Dropdown: "Filter by Set" (Default: Semua Set).

2. **Search Results (List View untuk kecepatan membaca informasi):**
    - Menampilkan hasil pencarian seketika (setelah debounce ketik).
    - **Result Row Item:**
        - Kiri: Placeholder Thumbnail Mini.
        - Tengah:
            - Nama Kartu, Nomor, Rarity.
            - Badge Status: "Sudah Dimiliki (x2)" — Tampilkan jika kartu ada di koleksi user (Warna kontras/Biru).
        - Kanan: Button "+ Tambah".

3. **No Results State:**
    - Teks: "Kartu '[keyword]' tidak ditemukan di database seri Indonesia."

---

## Modal / Bottom Sheet: Add to Collection & Edit

Saat menekan tombol "+ Tambah" di Database, atau menekan kartu di "Koleksiku", akan muncul modal input dari bawah (bottom sheet) di mobile, atau dialog modal di desktop.

### Struktur Layout Modal

1. **Header Modal:**
    - Judul: "Tambah Kartu" / "Ubah Detail"
    - Tombol (X) Tutup di kanan atas.

2. **Detail Singkat Kartu:**
    - Nama Kartu (H2)
    - Set dan Nomor Kartu (Caption)

3. **Form Input:**
    - **Kuantitas (Stepper):**
        - Label: "Jumlah Kartu"
        - Kontrol: [ - ] `Input Angka (min 1)` [ + ]
    - **Kondisi Kartu (Mandatory Dropdown):**
        - Label: "Kondisi" + [Icon Info (?)] — Klik untuk buka penjelasan standar kondisi (NM, EX, PL).
        - Dropdown Menu: [Pilih Kondisi...] -> ("Baik", "Cukup", "Kurang").
        - Validation Rule: Form tidak bisa di-submit jika kondisi belum dipilih (Tombol Simpan disabled).

4. **Footer Aksi (Sticky Bottom dalam Modal):**
    - (Khusus mode Edit) Button Secondary Kiri: "Hapus dari Koleksi" (Teks Merah).
    - Button Primary Kanan: "Simpan ke Koleksi".

---

## Accessibility Notes (WCAG)

- **Focus Order:** Urutan tab pada modal harus mengunci (focus trap) agar pengguna keyboard tidak menekan elemen di belakang modal saat modal terbuka.
- **Error Messaging:** Jika menekan "Simpan" tapi Dropdown Kondisi masih kosong, garis dropdown menjadi merah, dan teks di bawah dropdown muncul: "⚠ Silakan pilih kondisi kartu Anda."

---

## Next Steps

1. Import wireframe spec ini ke dalam Figma untuk high-fidelity mockup
2. Validasi layout dengan responsive design testing di berbagai ukuran layar
3. Siapkan component library berdasarkan struktur yang didefinisikan di atas
