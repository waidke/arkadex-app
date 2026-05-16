-- Migration: Add supertype and element to cards table
-- Created at: 2026-05-16 00:33:30
-- Task: T1.3 Phase 0 (Decision Opsi B)

ALTER TABLE cards 
ADD COLUMN IF NOT EXISTS supertype TEXT,
ADD COLUMN IF NOT EXISTS element TEXT;

-- Comment for documentation
COMMENT ON COLUMN cards.supertype IS 'Pokemon | Trainer | Energy';
COMMENT ON COLUMN cards.element IS 'Fire | Grass | Water | Lightning | Psychic | Fighting | Darkness | Metal | Dragon | Colorless | Fairy';
