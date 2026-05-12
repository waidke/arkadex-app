---
title: Usability Test Plan — ArkaDex
product_name: ArkaDex
version: 1.0
status: Approved
author: Eka Dwi Ramadhan
last_updated: 2026-05-13
---

# Usability Test Plan: ArkaDex

## Overview

Dokumen ini menguraikan rencana pengujian ketergunaan (usability testing) menggunakan purwarupa fungsional tingkat tinggi (high-fidelity HTML prototype). Tujuannya adalah memvalidasi kejelasan alur inti pengelolaan koleksi — menambah, mengedit, dan menghapus kartu — sebelum masuk ke tahap pengembangan fitur penuh.

---

## Testing Objectives

- Memvalidasi keterbacaan **empty state** dan apakah CTA mengarahkan pengguna ke langkah yang tepat.
- Menguji efisiensi **flow penambahan kartu** (tap kartu not-owned → bottom sheet → pilih kondisi → simpan).
- Mengidentifikasi titik kebingungan (*friction points*) saat pengguna **mengedit atau menghapus** data kartu yang sudah ada di koleksi.
- Memvalidasi apakah **segmented control kondisi** (NM/EX/GD/PL/PR) dipahami tanpa penjelasan tambahan.
- Menguji **discoverability** fitur collapse/expand header set sebagai mekanisme organisasi layar.

---

## Measurement Metrics

| Metrik | Deskripsi | Target |
| :--- | :--- | :--- |
| **Task Completion Rate (TCR)** | Persentase partisipan yang berhasil menyelesaikan tugas tanpa bantuan fasilitator | > 80% per task |
| **Time on Task (ToT)** | Waktu yang dihabiskan untuk menyelesaikan setiap task | Task tambah kartu: < 25 detik |
| **Severity Rating (0–4)** | Skala keparahan isu yang ditemukan: 0 = Bukan masalah, 1 = Kosmetik, 2 = Minor, 3 = Major, 4 = Blocker/Kritis | Tidak ada severity 3–4 |
| **System Usability Scale (SUS)** | Survei 10-item di akhir sesi untuk mengukur persepsi kemudahan penggunaan | Skor ≥ 68 |

---

## Participant Profile (Recruiting Criteria)

- **Jumlah:** 5 orang (optimal untuk menemukan ~85% masalah *usability* dasar).
- **Karakteristik:**
    - Berusia 15–35 tahun
    - Aktif mengumpulkan kartu Pokémon TCG (minimal pernah membeli booster pack dalam 6 bulan terakhir)
    - Pernah menggunakan alat pencatatan koleksi, dalam bentuk apapun (Google Sheets, Notes, aplikasi lain)
    - Nyaman menggunakan smartphone untuk aplikasi sehari-hari
- **Exclusion Criteria:** Tidak boleh anggota internal tim produk ArkaDex atau siapapun yang pernah melihat wireframe/prototype sebelumnya

---

## User Scenarios & Tasks

Pengujian dijalankan secara moderat (moderated). Fasilitator tidak boleh mengarahkan jawaban atau tindakan — hanya memberikan konteks tugas. Partisipan diminta berpikir keras (think-aloud protocol) selama sesi berlangsung.

Setiap task memiliki state awal yang harus disiapkan fasilitator via demo switcher sebelum kartu task dibacakan. Partisipan tidak perlu menyentuh demo switcher.

| No | State Awal (Switcher) | Konteks Skenario | Tugas Aktual | Kriteria Keberhasilan |
| :--- | :--- | :--- | :--- | :--- |
| **T1** | Empty | Kamu baru saja pasang aplikasi ArkaDex dan buka pertama kali. Koleksimu belum ada sama sekali. | Lihat apa yang muncul di layar. Ceritakan apa yang kamu pahami dan apa langkah berikutnya yang bisa kamu lakukan. | Partisipan mengidentifikasi bahwa koleksi masih kosong DAN menyebut atau mengarahkan perhatian ke tombol "Explore Database". |
| **T2** | Normal | Kamu baru dapat kartu "Decidueye ex" dari *booster pack* tadi. Kartu itu kondisinya masih mulus banget. | Tambahkan kartu Decidueye ex ke koleksimu dengan kondisi Near Mint dan jumlah 1 buah. Simpan. | Partisipan tap kartu Decidueye ex (not-owned) → bottom sheet muncul → pilih NM → qty minimal 1 → tap "Save Changes" → toast "Tersimpan! ✓" muncul. |
| **T3** | Normal | Ternyata kartu Pikachu ex yang kamu punya ujungnya ada yang lecet. Kondisinya bukan NM lagi, tapi Played. | Ubah kondisi kartu Pikachu ex di koleksimu menjadi Played (PL). Simpan perubahannya. | Partisipan tap kartu Pikachu ex (owned) → bottom sheet edit mode muncul → pilih PL → tap "Save Changes" → toast "Tersimpan! ✓" muncul. |
| **T4** | Normal | Kamu memutuskan untuk jual kartu Arcanine ex dan tidak ingin kartu itu tercatat di koleksi lagi. | Hapus kartu Arcanine ex dari koleksimu. | Partisipan tap kartu Arcanine ex → tap "Hapus dari Collection" → dialog konfirmasi muncul → tap "Hapus" → toast "Card dihapus dari collection" muncul. |
| **T5** | Normal | Layarmu sudah cukup penuh dengan daftar kartu. Kamu ingin menyembunyikan semua kartu dari set Scarlet ex untuk sementara. | Sembunyikan daftar kartu dari set Scarlet ex supaya layar lebih rapi. | Partisipan tap area header "SV1S - Scarlet ex" → grid kartu collapse (tersembunyi). |

---

## Prototype Setup & Opening Guide

### How to Open the Prototype

1. Buka file `docs/04-prototype/dashboard.html` langsung di browser Chrome atau Firefox
2. **Untuk simulasi mobile yang akurat** (direkomendasikan untuk task yang melibatkan bottom sheet dan touch target):
    - Buka Chrome DevTools (F12 atau Cmd+Option+I)
    - Aktifkan mode Device Emulation (Ctrl+Shift+M atau Cmd+Shift+M)
    - Pilih device preset: iPhone 14 atau Pixel 7 (atau set dimensi manual ke 390 × 844)
    - Pastikan mode Responsive aktif, bukan mode desktop
3. Alternatif jika tersedia: buka prototype di smartphone nyata via jaringan lokal (http://[IP-komputer]:port)

### Demo Switcher

Demo switcher adalah kumpulan tombol kecil di pojok kanan atas layar (bertuliskan "Normal", "Loading", "Empty", dll). Switcher ini adalah **alat fasilitator** — partisipan tidak perlu menyentuhnya.

Sebelum membacakan setiap kartu task, fasilitator mengatur state prototype sesuai kolom "State Awal" di tabel task:

| State | Kapan Digunakan |
| :--- | :--- |
| **Normal** | T2, T3, T4, T5 — tampilkan grid koleksi dengan kartu owned dan not-owned |
| **Empty** | T1 — tampilkan halaman koleksi kosong dengan CTA |
| **Loading** | Opsional, untuk observasi reaksi terhadap shimmer skeleton |
| **Error: Network / Server / Auth** | Opsional, di luar sesi task utama jika waktu tersisa |

### Important Notes for Facilitator

- Tab Database dan Profile tidak berfungsi — akan memunculkan toast "Halaman ini segera hadir". Ini bukan bug, sampaikan di briefing awal bahwa scope pengujian hanya halaman Collection
- Data tidak tersimpan permanen — setiap refresh prototype akan kembali ke state awal
- Jika partisipan tidak sengaja tap demo switcher, kembalikan ke state yang sesuai task tanpa komentar berlebihan

---

## Synthesis & Reporting Plan

Setelah 5 sesi selesai, data dikumpulkan menggunakan affinity mapping untuk mengelompokkan pola masalah berdasarkan tema: empty state recognition, affordance kartu not-owned, pemahaman kondisi NM/EX/GD/PL/PR, interaksi bottom sheet, stepper qty, dialog konfirmasi, dan collapse set header.

Hasil akhir dilaporkan dengan format:

**ID Temuan | Deskripsi | Frekuensi (n/5) | Severity (0–4) | Rekomendasi Perbaikan**

Gunakan template di `docs/02-ux/findings_template.md` untuk mencatat dan mensintesis hasil.

---

## Prerequisites Before Testing

Pastikan prototype `docs/04-prototype/dashboard.html` dapat dibuka sempurna di browser target (Chrome/Firefox), semua state via demo switcher berfungsi, dan bottom sheet dapat dibuka-tutup dengan benar. Uji coba prototype minimal sekali sebelum sesi pertama.

---

## Next Steps

1. Konfirmasi ketersediaan 5 partisipan sesuai kriteria
2. Siapkan ruang testing yang tenang dan privat
3. Cetak semua observer sheets dan task cards
4. Test prototype 2–3 kali untuk familiarisasi
5. Jadwalkan sesi dengan interval 2–3 hari antar partisipan untuk affinity mapping lebih efektif
