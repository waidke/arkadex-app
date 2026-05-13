---
title: Product Requirements Document — ArkaDex
product_name: ArkaDex
version: 1.1
status: Approved
author: Eka Dwi Ramadhan
last_updated: 2026-05-13
reviewers:
  - Tim Produk
  - Tim Engineering
---

## Change Log

| Versi | Tanggal | Author | Perubahan |
|---|---|---|---|
| **v1.0** | 2026-05-12 | Eka Dwi Ramadhan | Initial PRD — Phase 1 MVP + Phase 2 P1 features defined |
| **v1.1** | 2026-05-13 | Eka Dwi Ramadhan | Added multi-TCG vision and long-term roadmap; architecture notes for game/language extensibility (`tcg_type` dan `language` fields); Product Vision Statement section added; Phase 3+ multi-TCG backlog items added; Out of Scope updated for Phase 2 multi-TCG; new Risk added (scope creep ke multi-TCG terlalu awal); Assumption 6 added (arsitektur agnostik-game); Long-term Goals added; Phase 3+ milestone section added; Glossary updated dengan TCG Type dan Language Edition |

---

# Product Requirements Document: ArkaDex

## Executive Summary

**ArkaDex** adalah platform digital untuk mengelola koleksi kartu Trading Card Game (TCG). Visi jangka panjangnya adalah menjadi **universal TCG collection manager** — platform tunggal yang mendukung berbagai jenis TCG (Pokemon, One Piece, Digimon, Yu-Gi-Oh!, dan lainnya) dalam berbagai bahasa (Indonesia, Jepang, Inggris).

**Launch awal** difokuskan pada Pokemon TCG seri Bahasa Indonesia — segmen dengan komunitas kolektor yang paling aktif dan berkembang di Indonesia. Platform ini memberdayakan kolektor untuk dengan mudah mencatat, melacak, mengorganisir, dan memamerkan koleksi mereka, sekaligus memfasilitasi koneksi komunitas.

Produk ini dirancang untuk menghilangkan gesekan dalam manajemen koleksi TCG dibandingkan alternatif manual (Google Sheets, catatan offline) dengan menyediakan database komprehensif, alat manajemen intuitif, dan fitur berbagi yang terintegrasi dengan media sosial.

---

## Product Vision Statement

> **"ArkaDex menjadi platform manajemen koleksi TCG universal yang dimulai dari komunitas Pokemon Indonesia — dibangun dari hari pertama untuk berkembang melampaui satu game dan satu bahasa."**

### Visi Platform (Jangka Panjang)

ArkaDex dirancang sebagai **platform agnostik-game**: arsitektur database dan sistem produk dibangun untuk mengakomodasi berbagai jenis TCG dan berbagai edisi bahasa kartu sejak awal. Ini berarti:

- **Multi-TCG:** Setelah Pokemon TCG Indonesia solid, platform dapat diperluas ke One Piece TCG, Digimon TCG, Yu-Gi-Oh!, Magic: The Gathering, dan TCG lainnya tanpa refactor arsitektur besar.
- **Multi-Language:** Database kartu dirancang dengan field `language` untuk membedakan edisi Indonesia (ID), Jepang (JP), dan Inggris (EN) dari awal.
- **Multi-Market:** Komunitas kolektor di berbagai negara dapat menggunakan platform yang sama dengan database yang relevan untuk mereka.

### Tahapan Ekspansi

| Tahap | Fokus | Target |
|---|---|---|
| **Phase 1 MVP** | Pokemon TCG seri Indonesia | Q3 2026 |
| **Phase 2** | Fitur lanjutan Pokemon TCG Indonesia (scanner, share, trade, gamification) | Q4 2026 |
| **Phase 3+** | Ekspansi multi-TCG dan multi-bahasa | 2027+ |

---

## Problem Statement

**Masalah Utama:**
- Kolektor TCG Indonesia saat ini mengelola koleksi mereka menggunakan spreadsheet manual (Google Sheets), notes app, atau catatan offline — cara yang kurang efisien dan tidak dapat diskalakan
- Tidak ada database terpusat yang akurat untuk kartu Pokemon TCG seri Indonesia yang mudah diakses
- Sulit melacak progress penyelesaian set, rarity, atau kondisi kartu dalam jumlah besar
- Komunitas TCG Indonesia kurang terdapat platform dedicated untuk saling berbagi koleksi dan melakukan transaksi/trade lokal

**Kesempatan:**
- Pasar TCG di Indonesia terus berkembang dengan jumlah kolektor aktif yang semakin bertambah
- Fitur berbagi ke media sosial dapat menjadi growth loop organik
- Fitur trade local dapat meningkatkan retensi dan daily active users
- Database kartu yang akurat menjadi aset unik yang sulit ditiru pesaing
- **Ekspansi multi-TCG:** Pasar TCG global terus tumbuh — One Piece TCG, Digimon TCG, dan Yu-Gi-Oh! memiliki komunitas kolektor yang signifikan di Indonesia dan Asia. Dengan arsitektur yang extensible sejak awal, ArkaDex dapat menjadi platform pilihan untuk semua TCG, bukan hanya Pokemon.
- **Multi-bahasa:** Banyak kolektor Indonesia juga mengoleksi kartu seri Jepang (JP) yang memiliki varian dan seri eksklusif. Dukungan multi-bahasa membuka segmen kolektor yang lebih luas dan membedakan ArkaDex dari kompetitor.

---

## Goals & Success Metrics

### Primary Goals

1. **User Acquisition:** Membangun user base awal minimal 1.000 pengguna aktif dalam 3 bulan pertama post-launch MVP
2. **Retention:** Mencapai 30-day retention rate minimal 40% untuk pengguna MVP
3. **Community Building:** Memfasilitasi interaksi komunitas TCG Indonesia melalui fitur sharing dan matching lokal
4. **Data Accuracy:** Membangun database kartu TCG Indonesia yang akurat dan terus diperbarui seiring rilisan set baru
5. **Platform Extensibility (Jangka Panjang):** Memastikan arsitektur database dan API siap mendukung TCG tambahan dan multi-bahasa tanpa refactor mayor — diukur dari minimnya technical debt saat ekspansi Phase 3+

### Key Performance Indicators (KPI)

| Metrik | Target Phase 1 (MVP) | Target Phase 2 (P1) | Cara Ukur |
|---|---|---|---|
| Monthly Active Users (MAU) | 500 | 2.000 | Analytics dashboard |
| 7-day Retention | 30% | 40% | Cohort analysis |
| 30-day Retention | Baseline | 50% | Cohort analysis |
| Collection Completeness | ≥95% kartu seri Indonesia ter-cover di database | 99%+ | QA audit + user feedback |
| Session Duration (avg) | 5–10 menit | 15+ menit (dengan fitur gamif) | Analytics |
| Share-to-Install (Phase 2) | N/A | ≥10% dari total new installs | Deep link tracking |

### Long-Term Goals (Phase 3+)

- **TCG Expansion:** Onboard minimal 1 TCG tambahan (selain Pokemon) ke platform dengan effort minimal — validasi bahwa arsitektur extensible berhasil
- **Multi-Language Coverage:** Database kartu seri Jepang (JP) untuk Pokemon TCG tersedia dengan field `language` yang konsisten
- **Cross-TCG Retention:** Pengguna yang aktif di lebih dari satu TCG menunjukkan retention 20%+ lebih tinggi dibanding pengguna single-TCG

---

## User Personas & Target Audience

### 1. Casual Collectors (Kolektor Pemula)

**Demografi:** Usia 15–25 tahun, sudah/baru tertarik pada TCG, pemula dalam hobi

**Karakteristik:**
- Baru mulai koleksi atau baru mengenal TCG Indonesia
- Mencari cara mudah dan cepat mencatat kartu yang dimiliki
- Ingin memahami dasar-dasar kelangkaan dan nilai kartu
- Aktif di media sosial; suka berbagi pencapaian

**Kebutuhan:**
- Antarmuka yang sangat intuitif, tidak perlu tutorial kompleks
- Fitur pencarian sederhana dan cepat
- Informasi rarity yang jelas untuk memahami kelangkaan
- Kemudahan berbagi hasil ke Instagram/TikTok

**Quote:** *"Saya baru beli beberapa kartu Pokemon Indonesian. Saya pengen tahu kartu apa aja yang udah punya dan yang perlu dicari. Biar gampang, pakai yang bisa scan pake kamera HP aja."*

---

### 2. Serious Collectors (Kolektor Berpengalaman)

**Demografi:** Usia 20–40 tahun, koleksi cukup besar (ratusan hingga ribuan kartu), sering trading/membeli/menjual

**Karakteristik:**
- Memiliki koleksi besar dan kompleks; butuh organisasi yang efisien
- Peduli pada detail: kondisi kartu (Mint, NM, EX, dll.), rarity, set completion percentage
- Aktif tracking progress set completion dan target koleksi
- Sering melakukan transaksi/trade dengan kolektor lain
- Mungkin tertarik pada value estimation atau market data

**Kebutuhan:**
- Filter dan sortir lanjutan per set, rarity, kondisi, tipe
- Fitur tracking progress set completion dengan visualisasi jelas
- Kemampuan menandai kartu duplikat untuk dijual/ditukar
- Matching lokal dengan kolektor lain di kota yang sama untuk trade
- Export/import koleksi dari platform lain
- Gamification (badge, leaderboard) sebagai motivasi

**Quote:** *"Saya udah kumpul kartu Indonesia dari 5 set berbeda. Pengen tahu persentase completion per set dan cari kolektor lokal yang punya kartu yang aku cari. Google Sheets sudah nggak bisa dipakai."*

---

### 3. Komunitas TCG Pokemon Indonesia

**Demografi:** Semua usia yang aktif di komunitas TCG, baik casual maupun serious

**Karakteristik:**
- Suka berbagi koleksi dan berbincang tentang kartu
- Mencari komunitas yang solid untuk trading dan diskusi
- Ingin visibility tinggi di komunitas
- Concern: legalitas, keamanan transaksi, trust antar member

**Kebutuhan:**
- Fitur profil publik yang menampilkan koleksi
- Kemampuan berbagi koleksi dan mendapat feedback dari komunitas
- Matching dan messaging untuk transaksi lokal
- Leaderboard atau badges untuk gamifikasi kompetisi sehat
- Jaminan keamanan data dan moderasi untuk mencegah penipuan

**Quote:** *"Aku pengen pamer koleksi favorite-ku ke komunitas dan liat siapa aja di Jakarta yang punya kartu yang aku butuh buat ditukar."*

---

## Functional Requirements

### Phase 1 — MVP (Must-Have)

#### FR 1.1 — Manajemen Akun Pengguna
- Registrasi dengan email dan password
- Login dengan email dan password
- Logout dan session management
- Profil dasar: username, email, optional: foto profil
- Reset password via email verification

#### FR 1.2 — Database Kartu TCG (Dimulai dengan Pokemon TCG Seri Indonesia)

**Catatan Arsitektur:** Database kartu dirancang **extensible sejak awal** untuk mendukung multi-TCG dan multi-bahasa di masa depan. Schema mencakup field `tcg_type` (jenis TCG) dan `language` (edisi bahasa) pada setiap entri kartu, sehingga ekspansi ke TCG lain atau edisi bahasa lain tidak memerlukan refactor schema yang besar. Untuk MVP dan Phase 2, hanya data Pokemon TCG seri Indonesia yang akan dipopulasikan.

Database komprehensif kartu TCG yang mencakup:
- Nama kartu
- Set rilisan
- Nomor kartu (e.g., `001/100`)
- Rarity (Common, Uncommon, Rare, Holo Rare, dll.)
- Supertype: Pokemon, Trainer, Energy
- Element/Type (untuk Pokemon): Fire, Water, Grass, Lightning, Psychic, Fighting, Darkness, Metal, Dragon, Fairy, Colorless
- **`tcg_type`** — Jenis TCG kartu ini (e.g., `pokemon`, `one_piece`, `digimon`); untuk MVP selalu bernilai `pokemon`
- **`language`** — Edisi bahasa kartu (e.g., `ID` untuk Indonesia, `JP` untuk Jepang, `EN` untuk Inggris); untuk MVP selalu bernilai `ID`

Pencarian kartu berdasarkan:
- Nama kartu (case-insensitive, partial match)
- Nomor kartu
- Set rilisan
- Filter: rarity, supertype, element
- Pagination dan limit untuk query besar

#### FR 1.3 — Manajemen Koleksi Dasar
- Tambah kartu ke koleksi pribadi via pencarian
- Edit detail kartu di koleksi: kuantitas (1–99), kondisi (NM/EX/GD/PL/PR)
- Hapus kartu dari koleksi
- Upsert: jika user menambahkan kartu yang sudah ada, increment quantity dan update condition (bukan duplikasi entri)
- Tampilkan grid koleksi per set dengan status kepemilikan
- Tampilkan statistik koleksi: jumlah kartu di setiap set, progress completion

#### FR 1.4 — Informasi Rarity Kartu
- Display simbol rarity untuk setiap kartu (Common, Uncommon, Rare, Holo Rare, dll.)
- Penjelasan singkat rarity di card detail modal
- Konsistensi rarity legend di seluruh UI

#### FR 1.5 — Profil Koleksi Publik (Terbatas MVP)
- Pengguna dapat membuat profil yang menampilkan sebagian atau seluruh koleksi
- Share link langsung ke koleksi tertentu
- Koleksi publik read-only untuk pengguna lain (tidak bisa edit)

---

### Phase 2 — P1 (Post-MVP, Prioritas Tinggi)

Lihat Section 3.5 dan 4A di dokumen ini untuk detail keempat fitur P1 Phase 2.

#### FR 2.1 — Card Scanner via Kamera
- Pengguna dapat membuka scanner dari halaman koleksi
- Foto kartu fisik dengan kamera device → sistem mengenali kartu otomatis
- Hasil identifikasi: nama, set, nomor kartu
- Konfirmasi → add langsung ke koleksi
- Fallback manual jika identifikasi gagal
- Batch scanning untuk multiple cards in one session

#### FR 2.2 — Collection Showcase One-Tap Share
- Generate gambar koleksi dalam format:
  - 1:1 (Instagram feed)
  - 9:16 (Instagram/TikTok story)
- Visual yang clean dengan watermark ArkaDex
- Elemen visual menggunakan desain original, bukan artwork Pokemon berhak cipta
- One-tap share ke Instagram, TikTok, WhatsApp
- Legal review wajib sebelum development

#### FR 2.3 — Trade Matchmaking Lokal
- Pengguna dapat menandai kartu sebagai "Dijual/Ditukar" atau menambah ke wishlist
- Sistem matching: cari pengguna lain di kota yang sama dengan kebalikan yang dicari
- In-app atau external messaging untuk kontak antar pengguna
- Notifikasi saat ada match
- Exposure lokasi hanya ke pengguna terverifikasi (opsional: anonymize until match)

#### FR 2.4 — Set Completion Gamification
- Badge otomatis saat pengguna mencapai milestone (set pertama 100%, rarity tertinggi pertama kali, dll.)
- Leaderboard per kota dan nasional berdasarkan set completion %
- Badge dapat di-share ke media sosial sebagai gambar

---

### Phase 3+ — Backlog (TBD)

- Estimasi nilai/harga kartu (membutuhkan data pasar, legal review terpisah)
- Kondisi granular (Mint, Near Mint, Light Play, Moderate Play, Heavy Play)
- Import/export koleksi (CSV, JSON)
- Filter dan sortir lanjutan
- Hosting gambar artwork (akan dievaluasi legal solution-nya atau external link)
- Social Login (Google, Facebook)
- Wishlist global (bukan hanya per kota)
- **Support TCG tambahan:** One Piece TCG, Digimon TCG, Yu-Gi-Oh!, Magic: The Gathering, dan TCG lainnya — memanfaatkan field `tcg_type` yang sudah ada di schema
- **Multi-language database:** Database kartu seri Jepang (JP) dan Inggris (EN) untuk Pokemon TCG dan TCG lain — memanfaatkan field `language` yang sudah ada di schema
- **Language switcher UI:** Opsi antarmuka dalam Bahasa Indonesia dan Bahasa Inggris untuk menjangkau kolektor non-Indonesia

---

## User Stories

### User Stories Phase 1 — MVP

**US-001: Registrasi & Login**
- Sebagai pengguna baru, saya ingin mendaftar dengan email dan password, sehingga saya bisa akses aplikasi.
  - Kriteria: Form registrasi dengan validasi email unik; email verification (optional untuk dev, mandatory untuk prod); password minimal 8 karakter dengan kombinasi huruf dan angka.

**US-002: Menambah Kartu ke Koleksi**
- Sebagai kolektor pemula, saya ingin bisa dengan mudah menambahkan kartu yang baru saya dapatkan ke koleksi saya, sehingga saya tahu apa saja yang sudah saya miliki.
  - Kriteria: Saya dapat mencari kartu berdasarkan nama atau nomor; memilih set; menambahkan kuantitas dan kondisi dasar.

**US-003: Melihat Kartu dari Satu Set**
- Sebagai kolektor, saya ingin melihat semua kartu yang saya miliki dari satu set tertentu, sehingga saya bisa melacak progress set completion saya.
  - Kriteria: Saya dapat filter berdasarkan Set untuk menampilkan grid kartu; status owned/not owned jelas terlihat; progress bar menunjukkan persentase completion.

**US-004: Mengetahui Rarity Kartu**
- Sebagai kolektor, saya ingin mengetahui rarity dari kartu yang saya miliki, sehingga saya bisa memahami kelangkaannya.
  - Kriteria: Saat melihat detail kartu, saya bisa lihat simbol rarity dan penjelasannya.

**US-005: Mengedit Detail Kartu di Koleksi**
- Sebagai kolektor, saya ingin mengedit detail kartu jika kondisi atau jumlahnya berubah, sehingga koleksi saya selalu akurat.
  - Kriteria: Saya dapat memilih kartu di koleksi dan mengubah kuantitas atau kondisi.

**US-006: Mencari Informasi Kartu dari Database**
- Sebagai pengguna, saya ingin mencari informasi dasar tentang kartu Pokemon TCG seri Indonesia, sehingga saya bisa mengidentifikasi kartu yang saya miliki atau ingin cari.
  - Kriteria: Saya dapat mengetik nama kartu atau memilih set untuk melihat daftar kartu beserta detail dasarnya.

**US-007: Membuat Profil Koleksi Publik**
- Sebagai kolektor, saya ingin membuat profil yang menampilkan koleksi saya kepada publik, sehingga teman atau komunitas bisa lihat apa yang saya kumpulkan.
  - Kriteria: Saya bisa generate link publik untuk koleksi; orang lain bisa view koleksi saya (read-only); saya bisa enable/disable sharing per set atau full collection.

---

### User Stories Phase 2 — P1

Lihat Section 4A di dokumen ini.

---

## Non-Functional Requirements

### Security
- Seluruh komunikasi client-server menggunakan HTTPS
- Password hashed dan encrypted (Supabase Auth mengelola bcrypt internally)
- Autentikasi sesi dilindungi dari CSRF (HttpOnly cookie + SameSite)
- Validasi input ketat untuk mencegah XSS, SQL Injection, XXE
- Rate limiting pada endpoint auth untuk mencegah brute force
- Data pribadi pengguna hanya diakses oleh user yang authorized
- PII (email, username) tidak disimpan di client-side storage yang tidak aman

### Performance
- API response time (P95): < 500ms
- Halaman utama dan koleksi muat < 3 detik (4G/Fiber typical)
- Pencarian kartu responsif: hasil muncul < 1 detik
- Database index pada kolom frequently-queried: `user_id`, `set_id`, `name`, `tcg_type`, `language`
- Pagination mandatory untuk endpoint list (default limit 24, max 100)

### Availability & Reliability
- Target uptime: 99.9% per bulan
- Database backup reguler dan teruji (ditangani Supabase managed service)
- Health check endpoint untuk monitoring uptime
- Graceful degradation jika salah satu service down (e.g., scanner AI)

### Scalability
- Arsitektur serverless (Vercel) untuk auto-scaling
- Database connection pooling (Supabase PgBouncer)
- Horizontal scaling: stateless API, session dalam cookie
- Bersiap untuk 10.000+ concurrent users tanpa re-architecture
- Partisi atau archiving data koleksi user yang sudah lama inactive (TBD di phase berikutnya)

### Usability
- Antarmuka intuitif untuk pengguna casual (tidak perlu tutorial)
- Responsif di desktop, tablet, mobile (mobile-first design)
- Aksesibilitas: WCAG AA compliance (contrast, font size, keyboard navigation)
- Konsistensi terminologi di seluruh aplikasi (Glossary maintained)
- Loading state yang jelas (skeleton, spinner) untuk operasi async

### Compliance & Legal
- **Intellectual Property:** Aplikasi TIDAK menyimpan atau mendistribusikan gambar artwork kartu berhak cipta The Pokemon Company tanpa lisensi
  - Database hanya mencakup informasi tekstual: nama, set, nomor, rarity (publik)
  - Jika artwork diperlukan di masa depan: tautan ke sumber resmi/publik yang sah atau solusi legal lain akan dievaluasi
- **Fitur Visual (Phase 2):** Showcase dan Badge gamification wajib melalui legal review sebelum development; tidak boleh menyertakan artwork Pokemon berlisensi
- **Privacy:** Privacy policy yang jelas; compliance dengan regulasi data lokal Indonesia

---

## Out of Scope

### Phase 1 MVP
- Card scanner dengan AI vision
- Social sharing dengan format visual
- Trade matchmaking lokal
- Gamification (badges, leaderboard)
- Price estimation / market value tracking
- User-to-user messaging atau payment processing
- Admin panel yang sophisticated (basic CSV import saja)
- Third-party social login
- Multi-language support (Indonesian only untuk MVP)
- Mobile native app (web-based untuk MVP)
- Analytics dashboard customer-facing
- API public untuk third-party developers (internal only)

### Phase 2
- **Support TCG lain selain Pokemon** — Ekspansi ke One Piece TCG, Digimon TCG, Yu-Gi-Oh!, atau TCG lainnya adalah out of scope untuk Phase 2. Namun field `tcg_type` sudah disiapkan di schema database sejak MVP.
- **Multi-language database** — Database kartu seri Jepang (JP) dan Inggris (EN) adalah out of scope untuk Phase 2. Field `language` sudah disiapkan di schema untuk memudahkan ekspansi di Phase 3+.
- **Language switcher UI** — Antarmuka multi-bahasa adalah out of scope untuk Phase 2.

### Ongoing / Always Out of Scope
- Hosting atau distribusi artwork kartu berhak cipta tanpa lisensi
- Merchant processing / payment gateway (untuk Phase 2 trade feature)
- Verification of physical card authenticity (anti-counterfeiting service)
- Live marketplace dengan pricing engine (alternatif: link ke marketplace eksternal)

---

## Assumptions & Dependencies

### Key Assumptions
1. **Database Availability:** Basis data komprehensif kartu TCG seri Indonesia dapat dikumpulkan dari sumber publik dan/atau dataset existing (e.g., dari fan wiki, data mining tcgplayer, dll.). Asumsi: 95%+ dari rilisan official TCG Indonesia dapat di-cover di MVP.
2. **User Density:** Densitas pengguna per kota akan cukup untuk membuat trade matching feature (Phase 2) bernilai. Asumsi ini perlu divalidasi via user research sebelum commit ke development.
3. **Legal Clearance:** Solusi yang tidak melanggar IP The Pokemon Company untuk fitur showcase dan badges sudah feasible. Legal review di phase 2 akan memvalidasi ini.
4. **Internet Access:** Target pengguna memiliki akses internet yang stabil (3G/4G/Fiber) di Indonesia urban areas (Jakarta, Surabaya, Bandung, Medan, etc.).
5. **Device Capability:** Target market memiliki smartphone dengan kamera decent untuk feature scanner (Phase 2). Fallback manual tetap tersedia.
6. **Arsitektur Agnostik-Game:** Schema database dirancang agnostik-game dari hari pertama dengan field `tcg_type` dan `language` pada setiap entri kartu. Asumsi ini memastikan bahwa ekspansi ke multi-TCG dan multi-bahasa di Phase 3+ tidak memerlukan refactor schema yang signifikan — hanya membutuhkan penambahan data dan logika bisnis baru di lapisan aplikasi.

### Dependencies
1. **Supabase Service Availability:** Seluruh aplikasi bergantung pada Supabase (Database + Auth + Hosting)
2. **Vision API (Phase 2):** Card scanner Phase 2 membutuhkan Google Vision API atau model ML custom untuk kartu TCG Indonesia
3. **Legal Approval (Phase 2):** Fitur visual showcase dan badges membutuhkan approval legal sebelum go-to-market
4. **Master Data Quality:** Akurasi database kartu sangat bergantung pada input data yang akurat; akan butuh QA process yang ketat
5. **SEO & Organic Growth:** Long-term acquisition bergantung pada SEO (database kartu yang searchable di Google) dan organik sharing di komunitas TCG online

---

## Risks & Mitigations

| Risk | Severity | Likelihood | Mitigation |
|---|---|---|---|
| **Database Kartu Tidak Lengkap** — Data kartu yang missing atau salah akan merusak kepercayaan pengguna | High | Medium | Mulai dengan satu set lengkap untuk MVP; user-contributed corrections allowed; QA audit ketat sebelum launch per set |
| **Intellectual Property Claim** — The Pokemon Company memberi cease & desist untuk usage artwork atau trademark | Critical | Low | Legal review untuk setiap fitur yang menyertakan visual; tidak menyimpan artwork lokal; gunakan hanya info tekstual public domain |
| **Low Retention** — Pengguna churn tinggi setelah mencoba MVP karena fitur masih basic | Medium | Medium | Focus pada Phase 2 features yang drive retention (gamification, trade matching); validate user hypothesis early dengan beta testing |
| **Scalability Bottleneck** — Database atau API tidak handle traffic spike saat viral moment | Medium | Low | Arsitektur serverless + managed DB dari hari pertama; performance testing; rate limiting; caching strategy |
| **Competitor Entry** — Produk sejenis muncul dengan fitur yang sama | Medium | High | Move fast untuk Phase 2 features; focus pada community & network effects (trade matching); unique design & UX |
| **Card Scanner Accuracy Low** — Vision API accuracy < 80%; user frustrasi dengan multiple retries | Medium | Medium | Start dengan model yang sudah ada (Google Vision); fine-tune dengan dataset kartu Indonesia; fallback manual selalu tersedia |
| **Scope Creep ke Multi-TCG Terlalu Awal** — Tim tergoda untuk menambahkan support TCG lain sebelum Pokemon TCG Indonesia solid, mengakibatkan fokus terpecah dan MVP terlambat | High | Medium | Tetapkan gating criteria yang ketat: ekspansi TCG baru hanya dimulai setelah Pokemon TCG Indonesia mencapai target MAU Phase 2 (2.000 MAU) dan 30-day retention 50%; semua request TCG baru di-backlog ke Phase 3+ tanpa pengecualian; lakukan architecture review saat Phase 3 dimulai untuk memastikan field `tcg_type` dan `language` sudah cukup sebelum onboarding TCG pertama |

---

## Timeline & Milestones

### Phase 1 — MVP (Target 8–10 minggu)

| Milestone | Duration | Owner | Deliverable |
|---|---|---|---|
| **M1: Setup & Database Schema** | 1–2 minggu | Engineering | Repo Next.js siap, DB schema (termasuk field `tcg_type` dan `language`), seed data awal |
| **M2: Auth & User Mgmt** | 2 minggu | Engineering | Registration, Login, Logout, Profile; Supabase Auth integrated |
| **M3: Admin Panel & Data Import** | 1–2 minggu | Engineering | CSV/JSON bulk import kartu; basic admin UI |
| **M4: Core Collection Features** | 3–4 minggu | Engineering + Design | UI komponen (card grid, add modal, edit dialog); API endpoints full; full stack testing |
| **M5: QA & Beta Testing** | 1–2 minggu | QA + Product | Internal beta dengan 50–100 beta testers; bug fix; UX refinement |
| **M6: Launch Prep** | 1 minggu | Product + Ops | Production deployment; monitoring; documentation; soft launch; PR strategy |

**MVP Target Launch:** Q3 2026 (end of August, jika project dimulai mid-May)

---

### Phase 2 — P1 (Target 6–8 minggu post-MVP, Conditional)

| Feature | Duration | Priority (ICE Score) | Conditional Go? |
|---|---|---|---|
| Set Completion Gamification | 2–3 minggu | 1st (448) | MVP harus achieve 500+ MAU & 40%+ retention |
| Card Scanner via Kamera | 3–4 minggu | 1st (315) | Legal + Vision API integration decision |
| Collection Showcase One-Tap Share | 2–3 minggu | 2nd (336) | Legal review clear; design system ready |
| Trade Matchmaking Lokal | 3–4 minggu | 3rd (180) | User density validation per kota; infrastructure ready |

**Phase 2 Target Launch:** Q4 2026 (conditional)

---

### Phase 3+ — Multi-TCG Expansion (Target 2027+, Conditional)

Ekspansi ke multi-TCG dan multi-bahasa dimulai hanya setelah Phase 2 mencapai target KPI. Berikut item yang sudah direncanakan untuk Phase 3+:

- Support TCG tambahan (One Piece TCG, Digimon TCG, Yu-Gi-Oh!, dll.) — memanfaatkan field `tcg_type` yang sudah ada
- Database kartu seri Jepang (JP) dan Inggris (EN) — memanfaatkan field `language` yang sudah ada
- Language switcher UI (Bahasa Indonesia / English)

**Gate criteria Phase 3:** Pokemon TCG Indonesia mencapai 2.000 MAU dan 30-day retention 50% di akhir Phase 2.

---

## Appendix

### A. Glossary

| Term | Definition |
|---|---|
| **ArkaDex** | Platform manajemen koleksi TCG universal; launch awal dengan Pokemon TCG seri Indonesia |
| **TCG** | Trading Card Game |
| **TCG Type** | Jenis TCG yang didukung platform (e.g., Pokemon, One Piece, Digimon, Yu-Gi-Oh!); direpresentasikan oleh field `tcg_type` di database |
| **Language Edition** | Versi bahasa kartu: Indonesian (ID), Japanese (JP), English (EN); direpresentasikan oleh field `language` di database |
| **Set** | Koleksi kartu yang dirilis dalam satu periode (e.g., "Pedang dan Perisai") |
| **Card Number** | Nomor unik kartu dalam satu set (e.g., `001/100` = kartu pertama dari 100 total) |
| **Rarity** | Tingkat kelangkaan kartu: Common, Uncommon, Rare, Holo Rare, etc. |
| **Condition** | Kondisi fisik kartu: NM (Near Mint), EX (Excellent), GD (Good), PL (Poor/Light Play), PR (Poor/Damaged) |
| **Supertype** | Klasifikasi utama kartu: Pokemon, Trainer, Energy |
| **Element/Type** | Tipe elemen Pokemon: Fire, Water, Grass, Lightning, Psychic, Fighting, Darkness, Metal, Dragon, Fairy, Colorless |
| **Holo / Holographic** | Kartu dengan efek berkilau/iridescent pada artwork |
| **Set Completion** | Persentase kartu milik user dari total kartu di satu set (e.g., 42/100 = 42% completion) |
| **Badge** | Achievement/reward yang diberikan saat pengguna mencapai milestone (Phase 2) |
| **Leaderboard** | Ranking pengguna berdasarkan set completion percentage per kota dan nasional (Phase 2) |
| **Trade/Tukar** | Transaksi menukar kartu duplikat dengan kolektor lain (Phase 2) |
| **Wishlist** | Daftar kartu yang pengguna ingin cari/miliki (Phase 2) |

### B. Reference Documents

- Technical Design Document (TDD): `/docs/05-engineering/tdd-arkadex.md`
- User Flow: `/docs/02-design/user-flows.md` (TBD)
- Wireframe & Design: `/docs/02-design/wireframes.md` (TBD)
- Data Source References (TCG Card Database): TBD
