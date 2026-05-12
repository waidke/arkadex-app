---
title: UX Strategy & Desain — ArkaDex
product_name: ArkaDex
version: 1.0
status: Approved
author: Eka Dwi Ramadhan
last_updated: 2026-05-13
---

# UX Strategy & Desain: ArkaDex

## Executive Summary

Dokumen ini mendefinisikan strategi pengalaman pengguna (UX Strategy) untuk ArkaDex. Strategi ini berfungsi sebagai kompas bagi tim desain dan pengembang untuk memastikan setiap fitur yang dibangun benar-benar menyelesaikan masalah nyata pengguna dan memberikan nilai bisnis yang terukur.

---

## Problem Statement

**Kolektor kartu Pokemon TCG seri Bahasa Indonesia** saat ini kesulitan untuk mengelola dan melacak koleksi mereka secara akurat karena ketiadaan platform lokal yang komprehensif. Mereka seringkali:

- Mengalami kesulitan dalam mencatat kartu yang baru didapat secara cepat.
- Kehilangan jejak kartu mana yang masih kurang untuk melengkapi satu set tertentu.
- Tidak memiliki referensi kelangkaan (*rarity*) yang mudah diakses dalam bahasa Indonesia.
- Berisiko membeli kartu duplikat karena tidak mengetahui status kepemilikan kartu secara *real-time*.

---

## Research Synthesis: Jobs-to-be-Done (JTBD)

Berdasarkan analisis kebutuhan kolektor (pemula maupun berpengalaman), kita merancang fitur berdasarkan kerangka kerja JTBD:

- **Mencatat Koleksi:** "Saat saya mendapatkan kartu baru, saya ingin mencatatnya dengan cepat ke dalam database, sehingga saya tahu kartu apa saja yang sudah saya miliki dan menghindari duplikasi."

- **Melengkapi Set:** "Saat saya ingin melengkapi sebuah set tertentu, saya ingin melihat daftar kartu yang masih kurang dari set tersebut, sehingga saya bisa fokus mencari kartu yang tepat."

- **Identifikasi Rarity:** "Saat saya memegang sebuah kartu, saya ingin mengetahui tingkat kelangkaannya secara instan, sehingga saya memahami nilai koleksi yang saya miliki."

---

## Design Principles

Untuk mencapai visi produk, seluruh keputusan antarmuka (UI) dan interaksi (UX) harus mematuhi prinsip berikut:

1. **Efficiency over Decoration:** Prioritaskan kecepatan input dan kemudahan navigasi. Tampilan harus bersih agar teks informasi kartu mudah dibaca di layar mobile yang kecil.

2. **Data Integrity:** Karena data koleksi adalah aset pengguna, setiap aksi (tambah/edit/hapus) harus memberikan umpan balik visual yang jelas (misalnya: success toast).

3. **Low Friction Onboarding:** Meminimalkan hambatan bagi pengguna baru. Proses registrasi hingga penambahan kartu pertama harus dapat diselesaikan dalam waktu kurang dari 2 menit.

4. **Copyright Compliance:** Menggunakan elemen visual pengganti yang cerdas dan estetis untuk menghormati hak cipta tanpa mengurangi keindahan antarmuka.

---

## UX Success Metrics (Leading Indicators)

Keberhasilan desain ini akan diukur melalui:

- **Task Success Rate:** Pengguna berhasil menambahkan 5 kartu ke koleksi dalam waktu < 60 detik.
- **Search Latency Perception:** Hasil pencarian database muncul secara instan (terasa < 1 detik) melalui teknik debouncing.
- **Set Completion Visibility:** Pengguna dapat mengidentifikasi kartu yang kurang dari sebuah set dalam maksimal 2 kali klik dari halaman utama.

---

## Design Risks & Mitigations

| Risiko | Level | Impact | Mitigasi |
| :--- | :---: | :--- | :--- |
| Database terlalu besar untuk mobile | High | Loading lambat | Gunakan pagination atau infinite scroll pada list kartu |
| Tanpa gambar artwork, UI terasa kosong | Medium | Engagement rendah | Gunakan skema warna gradien dinamis berdasarkan elemen kartu (Api, Air, dll) |
| Kesalahan input data kondisi | Low | Data koleksi tidak akurat | Terapkan mandatory dropdown tanpa default value |

---

## Next Steps

Dokumen ini melengkapi seluruh pilar perencanaan UX ArkaDex. Dengan penyelesaian strategi ini, fase desain konseptual dan struktural telah selesai. Tim siap sepenuhnya untuk masuk ke fase technical implementation (scaffolding kode & setup framework).
