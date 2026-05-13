---
title: Design System Specification — ArkaDex
version: 1.1
status: Approved
author: Eka Dwi Ramadhan
last_updated: 2026-05-13
---

## Change Log

| Versi | Tanggal | Author | Perubahan |
|---|---|---|---|
| v1.0 | 2026-05-13 | Eka Dwi Ramadhan | Initial Design System Specification |
| v1.1 | 2026-05-13 | Eka Dwi Ramadhan | Tambah catatan multi-TCG pada token warna `--primary`/`--secondary` dan Card Type Gradients; tambah section Token Extensibility (Phase 3+) |

---

# Design System Specification: ArkaDex

Sesuai prinsip "Desain untuk Sistem", dokumen ini mendefinisikan *Design Tokens* dan komponen dasar sebelum membuat mockup spesifik per layar. Hal ini memastikan konsistensi visual di seluruh aplikasi ArkaDex.

## Design Tokens: Colors

Kami menggunakan palet warna yang memberikan kesan "Gaming/Kolektor" namun tetap bersih agar informasi teks mudah dibaca.

| Token Name | Value (Light) | Value (Dark) | Usage |
| :--- | :--- | :--- | :--- |
| `--primary` | `#800020` (ArkaDex Maroon) | `#C0252E` | CTA utama, active nav, focus ring, progress |
| `--secondary` | `#9A7B2E` (Collector Gold) | `#D4AF37` | Aksi sekunder, highlight |

> **Catatan Multi-TCG:** Token `--primary` (ArkaDex Maroon) dan `--secondary` (Collector Gold) adalah palet branding MVP untuk Pokemon TCG Indonesia. Phase 3+ akan memperluas sistem token dengan variabel per-TCG (e.g., `--primary-one-piece`, `--primary-digimon`) yang di-swap via CSS class pada `<body>` sesuai TCG aktif, tanpa mengubah nama token yang digunakan di komponen.
| `--bg-surface-0` | `#F7F3F3` | `#0D0A0A` | Background dasar halaman |
| `--bg-surface-1` | `rgba(255, 249, 249, 0.85)` | `rgba(28, 18, 18, 0.8)` | Glass card, nav, bottom sheet |
| `--nav-height` | `64px` | `64px` | CSS variable untuk sticky offset |
| `color-text-main` | `#1C1C1E` | `#F8FAFC` | Teks utama |
| `color-text-sub` | `#6C6C70` | `#94A3B8` | Teks sekunder, label, meta |
| `color-border` | `#E5E5EA` | `rgba(255,255,255,0.1)` | Border card, separator |

**Semantic Colors:**
- `color-success`: `#34C759` — notifikasi berhasil simpan
- `color-warning`: `#FF9500` — peringatan kuantitas kurang
- `color-error`: `#FF3B30` — form validation error

### Card Type Gradients

Setiap tipe elemen kartu memiliki gradient warna tersendiri sebagai background kartu di grid. Token di bawah ini spesifik untuk **Pokemon TCG** (MVP). Phase 3+ akan menambahkan set token terpisah untuk sistem elemen TCG lain (e.g., warna kartu One Piece TCG: Merah, Hijau, Biru, Ungu, Hitam, Kuning).

| Token | Gradient (135deg) | Tipe |
| :--- | :--- | :--- |
| `card-fire` | `#ef4444 → #991b1b` | Api |
| `card-water` | `#3b82f6 → #1e3a8a` | Air |
| `card-grass` | `#22c55e → #166534` | Rumput |
| `card-lightning` | `#eab308 → #854d0e` | Listrik |
| `card-psychic` | `#ec4899 → #831843` | Psikis |
| `card-fighting` | `#f97316 → #7c2d12` | Pertarungan |
| `card-darkness` | `#6b7280 → #111827` | Kegelapan |
| `card-metal` | `#94a3b8 → #334155` | Logam |
| `card-dragon` | `#818cf8 → #3730a3` | Naga |
| `card-fairy` | `#f472b6 → #9d174d` | Peri |
| `card-colorless` | `#d1d5db → #6b7280` | Tak Berwarna |

### Not-Owned Card State

Slot kartu yang belum dimiliki pengguna, ditampilkan di grid pada posisi nomor urut kartu.

| Properti | Nilai |
| :--- | :--- |
| Background | `rgba(28, 18, 18, 0.5)` |
| Border | `2px dashed rgba(192, 37, 46, 0.25)` |
| Ikon tengah | `+` SVG, opacity 20% |
| Hover border | `rgba(255,255,255,0.3)` |
| Label nama | `color-text-sub` (lebih redup dari owned) |

## Design Tokens: Typography

Font utama: **Inter** (Google Fonts, `wght@300;400;600;700`). Dipilih karena keterbacaan optimal di dark background dan konsistensi lintas platform.

| Token Name | Font Size | Font Weight | Line Height | Usage |
| :--- | :--- | :--- | :--- | :--- |
| `text-h1` | `32–40px` | `Bold (700)` | `1.2` | Header Halaman ("Koleksiku") — responsif |
| `text-h2` | `20px` | `Bold (700)` | `1.3` | Nama Set Kartu |
| `text-h3` | `18px` | `Bold (700)` | `1.3` | Nama kartu di Bottom Sheet |
| `text-body` | `14–16px` | `Regular (400)` | `1.5` | Teks paragraf, sub-label |
| `text-body-bold` | `14–16px` | `SemiBold (600)` | `1.5` | Label form, teks tombol |
| `text-caption` | `12px` | `SemiBold (600)` | `1.4` | Nama kartu di grid, label nav |
| `text-small` | `12px` | `Regular (400)` | `1.2` | Meta info (tanggal set, rarity) |

> **Minimum font size: 12px** untuk semua teks yang tampil di UI. Ukuran di bawah 12px tidak boleh digunakan (WCAG 1.4.4).

## Design Tokens: Spacing & Grid

Menggunakan sistem kelipatan 4pt/8pt (`8-point grid system`).

- `space-2`: `8px` — jarak antar elemen kecil (ikon + teks)
- `space-3`: `12px` — padding dalam tombol kecil, gap grid mobile
- `space-4`: `16px` — padding standar komponen, margin samping mobile
- `space-6`: `24px` — jarak antar seksi, gap grid tablet/desktop
- `space-8`: `32px` — margin bawah header halaman

**Grid System (Mobile-First):**

| Breakpoint | Kolom | Gap | Margin |
| :--- | :--- | :--- | :--- |
| Mobile (`< 768px`) | 3 | 12px | 16px |
| Tablet (`768–1023px`) | 5 | 24px | 24px |
| Desktop (`≥ 1024px`) | 7 | 24px | 48px (max-width 1280px, centered) |

## Komponen (Atomic Design)

### Buttons

| Varian | Style |
| :--- | :--- |
| Primary | `bg: --primary`, `text-white`, `rounded-xl`, `h-12`, `font-semibold` |
| Secondary | `bg-white/5`, `border border-white/20`, `text-white`, `rounded-lg` |
| Danger | `bg-transparent`, `text-red-400`, `hover:bg-red-900/20` |
| Disabled | `opacity-30`, `cursor-not-allowed` |

Touch target minimum: **48×48px** (semua platform).

### Form Inputs & Stepper

**Text Input:**
- Background `--bg-surface-1`, border `1px solid color-border`, `border-radius: 8px`
- Padding: `12px 16px`
- Focus: border `--primary` 2px (outline ring)
- Error: border `color-error`, teks error merah di bawah input

**Stepper (dipakai di Bottom Sheet):**
- Tombol `−` dan `+`: min `48×48px`, `bg-white/10`, `border border-white/20`, `rounded-xl`
- Display qty: `text-3xl font-bold`, `min-w-[48px] text-center`, `aria-live="polite"`
- Tombol `−` disabled (`opacity-30`) saat qty = 0

### Card Thumbnail

- Aspek rasio: **2.5 : 3.5** (standar kartu TCG)
- Background: gradient sesuai token tipe kartu (Seksi 1.1)
- Badge qty (`x1`, `x2`, dst.): pojok kanan bawah, `bg-black/60`, `text-[10px]` (exception — badge, bukan teks baca)
- Hover (desktop): `scale(1.05)`, `200ms ease-in-out`
- Focus: `outline 2px solid --primary`, `outline-offset: 2px`

### Bottom Sheet

Komponen utama untuk interaksi edit/tambah kartu. Detail spesifikasi di `design-handover-spec.md` Seksi 5.

- Trigger: tap kartu (mobile + desktop) atau hover edit button (desktop shortcut)
- Background: class `glass` + `rounded-t-3xl`
- Max height: `85dvh`
- Dismiss: swipe down > 80px, tap backdrop, `Escape`

### Skeleton / Shimmer Loader

Dipakai sebagai loading state grid kartu dan set header.

```css
@keyframes shimmer {
    0%   { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
}
.skeleton-card {
    background: rgba(28, 18, 18, 0.5);
    border: 2px dashed rgba(192, 37, 46, 0.15);
    position: relative;
    overflow: hidden;
}
.skeleton-card::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg,
        rgba(255,255,255,0) 0%,
        rgba(255,255,255,0.06) 50%,
        rgba(255,255,255,0) 100%
    );
    animation: shimmer 1.5s linear infinite;
}
@media (prefers-reduced-motion: reduce) {
    .skeleton-card::after { animation: none; }
}
```

Tampilkan **21 skeleton card** (3 baris penuh mobile) tanpa delay agar tidak ada blank flash.

### Empty State

| Elemen | Spesifikasi |
| :--- | :--- |
| Layout | `flex flex-col items-center text-center`, `min-h-[60dvh]`, `py-24 px-8` |
| Ilustrasi | 3 kartu bertumpuk (style `card-not-owned`), kartu tengah dengan border gradient `--primary → --secondary` |
| Heading | `text-xl font-bold`, `text-slate-100` |
| Subheading | `text-sm text-slate-400`, `max-w-[280px] leading-relaxed` |
| CTA Primer | "Jelajahi Database" — `bg: --primary`, `rounded-xl`, `max-w-[240px]`, `h-12` |
| CTA Sekunder | "Pelajari Cara Kerja" — text link, `underline-offset-4`, tanpa background |

### Error States

| Tipe | Tampilan | Ikon | Heading | CTA |
| :--- | :--- | :--- | :--- | :--- |
| Network | Inline section | wifi-off | "Koneksi terputus" | "Coba Lagi" |
| Server | Inline section | cloud-off | "Gagal memuat koleksi" | "Coba Lagi" |
| Auth | Full-page | lock | "Sesi kamu berakhir" | "Masuk Kembali" |

Error container: `glass`, `rounded-xl`, `p-10`, `flex flex-col items-center text-center`, `role="alert"`, `aria-live="assertive"`.

## Terminologi Standar (TCG Condition)

Untuk konsistensi data antara kolektor dan aplikasi, gunakan label berikut pada dropdown/badge kondisi:

- **NM (Near Mint):** Kondisi sempurna atau hampir sempurna.
- **LP (Lightly Played):** Ada sedikit goresan atau tanda pemakaian ringan.
- **MP (Moderately Played):** Kerusakan terlihat jelas namun kartu masih layak dikoleksi.
- **HP (Heavily Played) / Damaged:** Kerusakan berat atau cacat fisik signifikan.

## Aksesibilitas (WCAG AA)

- **Touch Targets:** Minimum **48×48px** untuk semua elemen interaktif di mobile.
- **Font Size Minimum:** **12px** — tidak ada teks UI di bawah ukuran ini.
- **Kontras:** Teks utama di atas `--bg-surface-0` harus memenuhi ratio 4.5:1.
- **Focus:** Semua elemen interaktif wajib punya `:focus-visible` — `outline 2px solid --primary`.
- **ARIA:** Gunakan `aria-label` pada semua icon-only button, `aria-current="page"` pada nav aktif, `aria-live="polite"` pada nilai qty stepper, `role="alert"` pada error state.
- **Bahasa:** `<html lang="id">` untuk memastikan screen reader menggunakan pronunciation Bahasa Indonesia.
- **Motion:** Seluruh animasi wajib memiliki fallback `prefers-reduced-motion: reduce`.

---

## Token Extensibility (Phase 3+)

Sistem token dirancang agar mudah diperluas saat multi-TCG diaktifkan tanpa mengubah nama token yang sudah dipakai di komponen:

| Lapisan | Strategi |
| :--- | :--- |
| **Brand color per TCG** | Definisikan variasi `--primary` dan `--secondary` per TCG sebagai CSS class pada `<body>` (e.g., `.theme-pokemon`, `.theme-one-piece`). Komponen tidak perlu berubah. |
| **Card type gradient per TCG** | Tambahkan prefix namespace token (e.g., `card-op-red`, `card-op-green` untuk One Piece). Komponen `CardThumbnail` membaca token via prop `tcgType + element`. |
| **Typography & spacing** | Tidak berubah — bersifat universal untuk semua TCG. |
| **Condition labels** | NM/EX/GD/PL/PR berlaku universal untuk semua TCG kartu fisik. Tidak perlu token baru. |

---

*Spesifikasi ini menjadi referensi developer untuk menyusun utility classes (Tailwind CSS) atau CSS Variables. Implementasi referensi: `prototype_dashboard.html`.*
