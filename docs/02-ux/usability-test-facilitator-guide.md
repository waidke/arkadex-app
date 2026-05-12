---
title: Usability Testing Facilitator Guide — ArkaDex
product_name: ArkaDex
version: 1.0
status: Approved
author: Eka Dwi Ramadhan
last_updated: 2026-05-13
---

# Usability Testing Facilitator Guide: ArkaDex

## Overview

Panduan ini digunakan oleh fasilitator selama sesi moderated usability testing hi-fi prototype ArkaDex. Baca seluruh dokumen sebelum sesi pertama dan pastikan sudah mencoba prototype minimal sekali.

---

## Intro Script

Bacakan dengan santai, bukan seperti membaca teks. Sesuaikan intonasi dengan partisipan.

---

"Hei, [nama partisipan], terima kasih sudah mau luang waktu hari ini. Saya [nama fasilitator], dan kita akan ngobrol santai sekitar 45–60 menit.

Jadi, yang akan kita lakukan hari ini bukan test kemampuan Anda — sama sekali bukan. Kita sedang menguji aplikasinya, bukan Anda. Jika Anda merasa bingung atau kesulitan, itu justru informasi yang paling berharga bagi kami. Jadi tidak ada jawaban yang salah.

Ini namanya prototype — semacam versi percobaan aplikasinya. Beberapa bagian sudah berjalan, beberapa belum. Saya akan memberitahu jika ada bagian yang memang belum bisa diklik.

Selama kita berjalan, ada satu hal yang saya minta bantuannya: **silakan ceritakan apa yang sedang Anda pikirkan dan rasakan**. Misalnya, "saya sedang mencari tombol ini", atau "saya bingung ini maksudnya apa", atau "oh, ternyata di sini". Jujur saja, apapun yang ada di pikiran Anda.

Saya tidak akan membantu Anda atau menjawab pertanyaan selama Anda mengerjakan task — bukan karena pelit, tapi supaya kami bisa melihat bagaimana pengalaman aslinya. Tapi jika sudah selesai, kita bisa diskusi bebas.

Boleh saya rekam layarnya dan suaranya? Rekaman ini hanya untuk tim kami sendiri, tidak akan disebarluaskan ke mana-mana. [Tunggu persetujuan.]

Ada pertanyaan dulu sebelum kita mulai?"

---

## Think-Aloud Instructions

Setelah intro script selesai dan partisipan siap, lakukan latihan singkat think-aloud sebelum masuk ke task pertama.

**Contoh latihan:**

"Sebelum mulai, kita coba dulu. Silakan buka browser di HP Anda dan ceritakan apa yang Anda lihat dan sedang Anda pikirkan — apapun yang ada di kepala."

Dengarkan apakah partisipan mulai berpikir keras. Jika diam, cukup ingatkan dengan:

"Silakan ceritakan apa yang sedang Anda pikirkan."

Jangan pernah mengatakan "mengapa Anda tidak klik yang itu?" — itu mengarahkan.

---

## Task Cards

Cetak atau siapkan kartu-kartu ini secara terpisah. Satu kartu = satu task. Bacakan konteks ke partisipan, lalu tunjukkan instruksi tugasnya. Jangan tunjukkan observer notes ke partisipan.

Sebelum membacakan setiap kartu, atur state prototype via demo switcher sesuai kolom "State Awal". Partisipan tidak perlu tahu tentang demo switcher.

---

### Task 1 — Kenali Empty State

**State awal: klik "Empty" di demo switcher**

---

**[Kartu untuk Partisipan]**

*Konteks:*  
Bayangkan Anda baru saja memasang aplikasi ArkaDex dan membukanya untuk pertama kali. Koleksi kartu Anda di aplikasi ini belum ada sama sekali.

*Instruksi:*  
Lihat layar ini dan ceritakan — apa yang Anda pahami? Apa yang bisa Anda lakukan dari sini?

---

**[Observer Notes — jangan ditunjukkan ke partisipan]**

| Item | Catatan |
| :--- | :--- |
| Waktu mulai | |
| Waktu selesai | |
| Success (Y/N) | Y = partisipan menyebut atau mengarahkan ke tombol "Explore Database" |
| Apakah partisipan langsung memahami bahwa koleksi kosong? | |
| Apakah partisipan menemukan tombol "Explore Database" tanpa panduan? | |
| Apakah ada kebingungan terhadap teks atau visual empty state? | |
| Quote / komentar verbatim | |
| Error / momen macet | |

---

### Task 2 — Tambah Kartu ke Koleksi

**State awal: klik "Normal" di demo switcher**

---

**[Kartu untuk Partisipan]**

*Konteks:*  
Anda baru dapat kartu "Decidueye ex" dari booster pack tadi. Kartu itu kondisinya masih mulus banget, baru banget.

*Instruksi:*  
Tambahkan kartu Decidueye ex ke koleksi Anda dengan kondisi Near Mint dan jumlah 1 buah. Simpan.

---

**[Observer Notes — jangan ditunjukkan ke partisipan]**

| Item | Catatan |
| :--- | :--- |
| Waktu mulai | |
| Waktu selesai | |
| Success (Y/N) | Y = toast "Tersimpan! ✓" muncul setelah save |
| Apakah partisipan langsung mengenali kartu not-owned (border putus-putus)? | |
| Berapa lama sebelum partisipan tap kartu Decidueye ex? | |
| Apakah partisipan memahami segmented control NM/EX/GD/PL/PR tanpa penjelasan? | |
| Apakah tombol "Save Changes" ditemukan dengan mudah? | |
| Apakah ada kebingungan soal stepper qty (tombol +/−)? | |
| Quote / komentar verbatim | |
| Error / momen macet | |

---

### Task 3 — Edit Kondisi Kartu

**State awal: klik "Normal" di demo switcher**

---

**[Kartu untuk Partisipan]**

*Konteks:*  
Ternyata kartu Pikachu ex yang Anda punya ujungnya ada yang lecet. Kondisinya bukan Near Mint lagi, sekarang Played.

*Instruksi:*  
Ubah kondisi kartu Pikachu ex di koleksi Anda menjadi Played (PL). Simpan perubahannya.

---

**[Observer Notes — jangan ditunjukkan ke partisipan]**

| Item | Catatan |
| :--- | :--- |
| Waktu mulai | |
| Waktu selesai | |
| Success (Y/N) | Y = toast "Tersimpan! ✓" muncul setelah save |
| Apakah partisipan langsung tahu harus tap kartu Pikachu ex? | |
| Apakah partisipan mengenali perbedaan antara mode tambah dan mode edit di bottom sheet? | |
| Apakah kondisi "PL" dipahami sebagai "Played"? | |
| Apakah ada momen partisipan ragu sebelum save? | |
| Quote / komentar verbatim | |
| Error / momen macet | |

---

### Task 4 — Hapus Kartu dari Koleksi

**State awal: klik "Normal" di demo switcher**

---

**[Kartu untuk Partisipan]**

*Konteks:*  
Anda memutuskan untuk menjual kartu Arcanine ex. Anda tidak ingin kartu itu tercatat di koleksi lagi.

*Instruksi:*  
Hapus kartu Arcanine ex dari koleksi Anda.

---

**[Observer Notes — jangan ditunjukkan ke partisipan]**

| Item | Catatan |
| :--- | :--- |
| Waktu mulai | |
| Waktu selesai | |
| Success (Y/N) | Y = toast "Card dihapus dari collection" muncul |
| Apakah partisipan menemukan opsi hapus di bottom sheet tanpa kesulitan? | |
| Apakah dialog konfirmasi "Hapus dari collection?" dibaca partisipan sebelum konfirmasi? | |
| Apakah ada keraguan di dialog (baca teks, hesitasi)? | |
| Apakah teks tombol "Hapus" dan "Batal" di dialog jelas? | |
| Quote / komentar verbatim | |
| Error / momen macet | |

---

### Task 5 — Collapse Set Header

**State awal: klik "Normal" di demo switcher**

---

**[Kartu untuk Partisipan]**

*Konteks:*  
Layar Anda sudah cukup penuh dengan daftar kartu. Anda ingin menyembunyikan semua kartu dari set Scarlet ex untuk sementara agar lebih rapi.

*Instruksi:*  
Sembunyikan daftar kartu dari set Scarlet ex.

---

**[Observer Notes — jangan ditunjukkan ke partisipan]**

| Item | Catatan |
| :--- | :--- |
| Waktu mulai | |
| Waktu selesai | |
| Success (Y/N) | Y = grid kartu collapse (tersembunyi) setelah tap header |
| Berapa lama sebelum partisipan menemukan area yang bisa ditap? | |
| Apakah partisipan mencoba tap di tempat lain sebelum header? | |
| Apakah ikon chevron (panah bawah) memberikan cue yang cukup? | |
| Apakah animasi collapse terlihat oleh partisipan? | |
| Quote / komentar verbatim | |
| Error / momen macet | |

---

## Probing Questions

Gunakan pertanyaan-pertanyaan berikut **hanya jika partisipan diam terlalu lama (>15–20 detik) atau terlihat stuck total**. Tujuannya menggali pemikiran, bukan mengarahkan ke solusi.

Hindari pertanyaan yang mengandung petunjuk, misalnya "Coba klik yang pojok kanan" atau "Perhatikan tombol merahnya".

| Situasi | Pertanyaan yang Boleh Digunakan |
| :--- | :--- |
| Partisipan diam terlalu lama | "Apa yang sedang Anda pikirkan?" / "Apa yang sedang Anda cari?" |
| Partisipan ragu sebelum klik | "Apa yang membuat Anda ragu?" |
| Partisipan salah jalan | "Oke, dan sekarang apa yang Anda rasakan?" |
| Partisipan komentar soal desain | "Bisa ceritakan lebih lanjut maksudnya?" |
| Partisipan minta petunjuk | "Jika ini benar-benar aplikasi yang Anda gunakan, Anda akan melakukan apa?" |
| Setelah task selesai | "Apa yang Anda rasakan tadi?" / "Ada yang membingungkan?" |

---

## SUS Questionnaire (System Usability Scale)

Berikan kuesioner ini **setelah semua task selesai**, sebelum post-session interview. Minta partisipan mengisi sendiri menggunakan skala 1–5.

**Skala:** 1 = Sangat Tidak Setuju, 2 = Tidak Setuju, 3 = Netral, 4 = Setuju, 5 = Sangat Setuju

---

*"Silakan jawab 10 pernyataan berikut berdasarkan pengalaman Anda menggunakan aplikasi ArkaDex tadi. Tidak ada jawaban benar atau salah — pilih yang paling sesuai dengan perasaan Anda."*

| No | Pernyataan | 1 | 2 | 3 | 4 | 5 |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| 1 | Saya rasa saya akan sering menggunakan aplikasi ini. | | | | | |
| 2 | Menurut saya, aplikasi ini terlalu rumit dan tidak perlu. | | | | | |
| 3 | Menurut saya, aplikasi ini mudah digunakan. | | | | | |
| 4 | Saya rasa saya butuh bantuan orang teknis untuk bisa memakai aplikasi ini. | | | | | |
| 5 | Saya merasa berbagai fungsi di aplikasi ini terintegrasi dengan baik. | | | | | |
| 6 | Menurut saya, terlalu banyak hal yang tidak konsisten di aplikasi ini. | | | | | |
| 7 | Saya bayangkan kebanyakan orang bisa belajar memakai aplikasi ini dengan cepat. | | | | | |
| 8 | Menurut saya, aplikasi ini sangat tidak praktis digunakan. | | | | | |
| 9 | Saya merasa sangat percaya diri saat menggunakan aplikasi ini. | | | | | |
| 10 | Saya perlu belajar banyak hal dulu sebelum bisa menggunakan aplikasi ini dengan lancar. | | | | | |

**Cara menghitung skor SUS:**
- Item ganjil (1, 3, 5, 7, 9): skor kontribusi = nilai jawaban − 1
- Item genap (2, 4, 6, 8, 10): skor kontribusi = 5 − nilai jawaban
- Total skor kontribusi × 2.5 = Skor SUS (0–100)
- Skor ≥ 68 = di atas rata-rata industri

---

## Post-Session Interview Questions

Setelah SUS diisi, lanjutkan dengan wawancara terbuka singkat (5–10 menit). Tujuannya menggali mental model dan ekspektasi pengguna yang tidak muncul saat mengerjakan task.

1. "Secara keseluruhan, bagaimana kesan Anda terhadap aplikasi ArkaDex tadi?"

2. "Saat Anda ingin menambahkan kartu, apa yang pertama kali Anda cari di layar? Mengapa ke sana?"

3. "Mengenai kondisi kartu — NM, EX, GD, PL, PR — apakah sebelumnya Anda sudah familiar dengan istilah-istilah itu? Jika iya, dari mana?"

4. "Fitur apa yang menurut Anda paling berguna sebagai kolektor? Dan apakah ada yang menurut Anda kurang atau seharusnya ada tetapi belum ada?"

5. "Jika dibandingkan dengan cara Anda sekarang mencatat koleksi kartu (jika ada), bagaimana bedanya? Mana yang lebih mudah?"

---

## Observer Sheet Template

Isi satu sheet ini per partisipan. Gunakan kode P1–P5 untuk menjaga anonimitas di dokumen sintesis.

**ID Partisipan:** _______ | **Tanggal:** _______ | **Fasilitator:** _______ | **Observer:** _______

### Ringkasan Task

| Task | Waktu Mulai | Waktu Selesai | ToT (detik) | Success (Y/N) | Jumlah Error | Catatan Singkat |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| T1 — Empty State | | | | | | |
| T2 — Tambah Kartu | | | | | | |
| T3 — Edit Kondisi | | | | | | |
| T4 — Hapus Kartu | | | | | | |
| T5 — Collapse Set | | | | | | |

### Catatan Error & Quotes Per Task

**T1 — Empty State**
- Error: ___
- Quote verbatim: "___"

**T2 — Tambah Kartu**
- Error: ___
- Quote verbatim: "___"

**T3 — Edit Kondisi**
- Error: ___
- Quote verbatim: "___"

**T4 — Hapus Kartu**
- Error: ___
- Quote verbatim: "___"

**T5 — Collapse Set**
- Error: ___
- Quote verbatim: "___"

### SUS & Post-Session

| Item | Nilai |
| :--- | :--- |
| Skor SUS | /100 |
| Kesan umum (1 kalimat) | |
| Hal yang paling disukai | |
| Hal yang paling membingungkan | |
| Fitur yang diharapkan (belum ada) | |

---

## Next Steps

1. Cetak semua task cards sebelum sesi pertama
2. Siapkan smartphone atau tablet untuk simulasi mobile
3. Test prototype 2–3 kali sebelum sesi pertama
4. Kumpulkan observer sheets dan mulai affinity mapping setelah 5 sesi selesai
