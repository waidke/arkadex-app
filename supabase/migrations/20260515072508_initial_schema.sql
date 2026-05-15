-- ArkaDex Initial Schema Migration
-- Milestone: M1 Foundations
-- Phase: B (Schema Design)

-- 1. Enable Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Master Data: Sets
CREATE TABLE IF NOT EXISTS public.sets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT NOT NULL UNIQUE, -- e.g., 'SV4a', 'SV5K'
    name TEXT NOT NULL,
    release_date DATE,
    total_cards INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.sets IS 'Reference data for Pokémon TCG IDN set expansions.';

-- 3. Master Data: Cards
CREATE TABLE IF NOT EXISTS public.cards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    set_id UUID NOT NULL REFERENCES public.sets(id) ON DELETE CASCADE,
    card_number TEXT NOT NULL, -- e.g., '001/190', '212/190'
    name TEXT NOT NULL,
    rarity TEXT, -- e.g., 'C', 'U', 'R', 'SR', 'SAR'
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(set_id, card_number)
);

CREATE INDEX idx_cards_set_id ON public.cards(set_id);
COMMENT ON TABLE public.cards IS 'Reference data for individual cards within a set.';

-- 4. Transactional Data: User Collections
CREATE TABLE IF NOT EXISTS public.user_cards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    card_id UUID NOT NULL REFERENCES public.cards(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 0 CHECK (quantity >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, card_id)
);

CREATE INDEX idx_user_cards_user_id ON public.user_cards(user_id);
CREATE INDEX idx_user_cards_card_id ON public.user_cards(card_id);
COMMENT ON TABLE public.user_cards IS 'User-specific card collection data (Inventory). Isolated via RLS.';

-- 5. Updated_at Trigger for User Cards
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_user_cards_updated_at
    BEFORE UPDATE ON public.user_cards
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
