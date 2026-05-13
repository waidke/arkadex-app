---
title: UX Strategy & Desain — ArkaDex
product_name: ArkaDex
version: 1.1
status: Approved
author: Eka Dwi Ramadhan
last_updated: 2026-05-13
---

## Change Log

| Versi | Tanggal | Author | Perubahan |
|---|---|---|---|
| v1.0 | 2026-05-13 | Eka Dwi Ramadhan | Initial UX Strategy & Desain |
| v1.1 | 2026-05-13 | Eka Dwi Ramadhan | Tambah visi multi-TCG di Executive Summary dan Problem Statement; tambah Design Principle ke-5 (Extensible-by-Design); tambah JTBD Mengelola Multi-TCG (Phase 3+); tambah Design Risk terminologi TCG generik |

---

# UX Strategy & Desain: ArkaDex

## Executive Summary

Dokumen ini mendefinisikan strategi pengalaman pengguna (UX Strategy) untuk ArkaDex. Strategi ini berfungsi sebagai kompas bagi tim desain dan pengembang untuk memastikan setiap fitur yang dibangun benar-benar menyelesaikan masalah nyata pengguna dan memberikan nilai bisnis yang terukur.

ArkaDex diposisikan sebagai *universal TCG collection manager* — platform manajemen koleksi kartu kolektabel (TCG) yang terintegrasi untuk kolektor Indonesia. Pengembangan dimulai dari Pokemon TCG seri Bahasa Indonesia sebagai fokus MVP dan Phase 2, dengan fondasi arsitektur yang dirancang untuk mengakomodasi ekspansi ke TCG lain (One Piece, Digimon, dll.) pada Phase 3+ (2027+).

---

## Problem Statement

**Kolektor kartu Pokemon TCG seri Bahasa Indonesia** saat ini kesulitan untuk mengelola dan melacak koleksi mereka secara akurat karena ketiadaan platform lokal yang komprehensif. Mereka seringkali:

- Mengalami kesulitan dalam mencatat kartu yang baru didapat secara cepat.
- Kehilangan jejak kartu mana yang masih kurang untuk melengkapi satu set tertentu.
- Tidak memiliki referensi kelangkaan (*rarity*) yang mudah diakses dalam bahasa Indonesia.
- Berisiko membeli kartu duplikat karena tidak mengetahui status kepemilikan kartu secara *real-time*.
- Tidak ada platform manajemen koleksi TCG multi-game yang terintegrasi untuk kolektor Indonesia, padahal banyak kolektor yang mengoleksi lebih dari satu jenis TCG (Pokemon, One Piece, Digimon, dll.).

---

## Research Synthesis: Jobs-to-be-Done (JTBD)

Berdasarkan analisis kebutuhan kolektor (pemula maupun berpengalaman), kita merancang fitur berdasarkan kerangka kerja JTBD:

- **Mencatat Koleksi:** "Saat saya mendapatkan kartu baru, saya ingin mencatatnya dengan cepat ke dalam database, sehingga saya tahu kartu apa saja yang sudah saya miliki dan menghindari duplikasi."

- **Melengkapi Set:** "Saat saya ingin melengkapi sebuah set tertentu, saya ingin melihat daftar kartu yang masih kurang dari set tersebut, sehingga saya bisa fokus mencari kartu yang tepat."

- **Identifikasi Rarity:** "Saat saya memegang sebuah kartu, saya ingin mengetahui tingkat kelangkaannya secara instan, sehingga saya memahami nilai koleksi yang saya miliki."

- **Mengelola Multi-TCG `(Phase 3+)`:** "Saat saya mengoleksi lebih dari satu jenis TCG (Pokemon dan One Piece), saya ingin satu platform yang bisa mengelola semua koleksi saya, sehingga saya tidak perlu berpindah-pindah aplikasi."

---

## Design Principles

Untuk mencapai visi produk, seluruh keputusan antarmuka (UI) dan interaksi (UX) harus mematuhi prinsip berikut:

1. **Efficiency over Decoration:** Prioritaskan kecepatan input dan kemudahan navigasi. Tampilan harus bersih agar teks informasi kartu mudah dibaca di layar mobile yang kecil.

2. **Data Integrity:** Karena data koleksi adalah aset pengguna, setiap aksi (tambah/edit/hapus) harus memberikan umpan balik visual yang jelas (misalnya: success toast).

3. **Low Friction Onboarding:** Meminimalkan hambatan bagi pengguna baru. Proses registrasi hingga penambahan kartu pertama harus dapat diselesaikan dalam waktu kurang dari 2 menit.

4. **Copyright Compliance:** Menggunakan elemen visual pengganti yang cerdas dan estetis untuk menghormati hak cipta tanpa mengurangi keindahan antarmuka.

5. **Extensible-by-Design:** Komponen, label, dan struktur navigasi dirancang untuk mengakomodasi penambahan TCG baru di masa depan (Phase 3+) tanpa perubahan besar pada pola interaksi yang sudah ada. Contoh: filter "Set" nantinya dapat berkembang menjadi filter "TCG Type + Set".

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
| Terminologi "TCG" terlalu generik saat MVP masih hanya Pokemon | Medium | Kebingungan pengguna tentang cakupan platform | Gunakan label "Pokemon TCG" secara eksplisit di semua copy UI MVP, dengan desain yang memungkinkan label berganti menjadi "One Piece TCG" dll. di Phase 3+ |

---

## Next Steps

Dokumen ini melengkapi seluruh pilar perencanaan UX ArkaDex. Dengan penyelesaian strategi ini, fase desain konseptual dan struktural telah selesai. Tim siap sepenuhnya untuk masuk ke fase technical implementation (scaffolding kode & setup framework).
