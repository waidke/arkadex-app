-- ArkaDex RLS Policies Migration
-- Milestone: M1 Foundations
-- Phase: C (RLS Authoring)
-- Principles: Shift Security Left, Default Deny, Zero Trust Tenant Isolation

-------------------------------------------------------------------------------
-- 1. ENABLE ROW LEVEL SECURITY (DEFAULT DENY BASELINE)
-------------------------------------------------------------------------------
-- Mengaktifkan RLS berarti segala akses (SELECT/INSERT/UPDATE/DELETE)
-- akan ditolak secara default kecuali ada policy yang secara eksplisit mengizinkan.

ALTER TABLE public.sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_cards ENABLE ROW LEVEL SECURITY;

-------------------------------------------------------------------------------
-- 2. MASTER DATA POLICIES (STRICT READ-ONLY)
-------------------------------------------------------------------------------
-- Tabel referensi (sets dan cards) dapat dibaca oleh publik tanpa token
-- dan oleh pengguna yang login, untuk keperluan katalog aplikasi.
-- Modifikasi (INSERT/UPDATE/DELETE) hanya bisa via Service Role (Bypass RLS).

-- Table: sets
CREATE POLICY "Allow public read access on sets" 
ON public.sets 
FOR SELECT 
USING (true);

-- Table: cards
CREATE POLICY "Allow public read access on cards" 
ON public.cards 
FOR SELECT 
USING (true);


-------------------------------------------------------------------------------
-- 3. TRANSACTIONAL DATA POLICIES (TENANT ISOLATION)
-------------------------------------------------------------------------------
-- Tabel user_cards menyimpan koleksi pribadi. Hanya pengguna terautentikasi (auth.uid)
-- yang bisa memanipulasi data milik mereka sendiri.

-- A. SELECT: Pengguna hanya dapat melihat kartu milik mereka sendiri.
CREATE POLICY "Users can view their own collection" 
ON public.user_cards 
FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

-- B. INSERT: Pengguna hanya dapat menambah kartu ke koleksi mereka sendiri.
-- WITH CHECK memastikan payload user_id yang dikirim sesuai dengan token mereka.
CREATE POLICY "Users can add cards to their own collection" 
ON public.user_cards 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- C. UPDATE: Pengguna hanya dapat mengubah kuantitas (atau atribut lain)
-- pada kartu yang sudah ada di koleksi mereka.
CREATE POLICY "Users can update their own collection" 
ON public.user_cards 
FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- D. DELETE: Pengguna hanya dapat menghapus kartu dari koleksi mereka.
CREATE POLICY "Users can delete from their own collection" 
ON public.user_cards 
FOR DELETE 
TO authenticated 
USING (auth.uid() = user_id);
