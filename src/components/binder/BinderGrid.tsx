'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { createClient } from '@/lib/supabase-client';
import { CardItem } from './CardItem';
import { CardModal } from './CardModal';
import { persistenceManager } from '@/lib/persistence';
import { SetNavigation } from './SetNavigation';
import { motion, AnimatePresence } from 'framer-motion';

interface Card {
  id: string;
  name: string;
  card_number: string;
  image_url: string;
  rarity: string;
  supertype: string;
  element?: string | null;
}

export const BinderGrid = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [ownedCardIds, setOwnedCardIds] = useState<Set<string>>(new Set());
  const [syncing, setSyncing] = useState(false);
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [isQuickAdd, setIsQuickAdd] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [activeSetId, setActiveSetId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'owned' | 'missing'>('all');
  const [sortBy, setSortBy] = useState<'number' | 'name' | 'rarity'>('number');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. Check Auth Status
        const { data: { user } } = await supabase.auth.getUser();
        setIsAnonymous(!user);

        // 2. Fetch ALL available sets to initialize activeSetId
        const { data: allSets, error: setsError } = await supabase
          .from('sets')
          .select('id, name, code');

        if (setsError) console.error('Sets fetch error:', setsError);

        if (allSets && allSets.length > 0) {
          if (!activeSetId) {
            setActiveSetId(allSets[0].id);
          }
        } else if (!activeSetId) {
          // Fallback to Scarlet ex if DB fails or is empty
          setActiveSetId('47f90af4-c38a-42a5-a4d0-80c8c6ec7921');
        }

        // 4. Fetch cards for active set
        const currentSetId = activeSetId || (allSets && allSets.length > 0 ? allSets[0].id : null);
        
        if (currentSetId) {
          const { data: cardsData } = await supabase
            .from('cards')
            .select('*')
            .eq('set_id', currentSetId)
            .order('card_number', { ascending: true });

          if (cardsData) setCards(cardsData);
        }

        // 5. Fetch collections
        if (user) {
          const { data: collectionsData } = await supabase
            .from('user_cards')
            .select('card_id')
            .eq('user_id', user.id);
          
          if (collectionsData) {
            setOwnedCardIds(new Set(collectionsData.map(c => c.card_id)));
          }
        } else {
          const localItems = await persistenceManager.loadCollection();
          setOwnedCardIds(new Set(localItems.map(i => i.cardId)));
        }

      } catch (error) {
        console.error('Error fetching binder data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeSetId]);

  // Filtering & Sorting Logic
  const processedCards = cards
    .filter(card => {
      // 1. Search Filter
      const matchesSearch = card.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            card.card_number.includes(searchQuery);
      
      // 2. Ownership Filter
      const isOwned = ownedCardIds.has(card.id);
      const matchesOwnership = filterMode === 'all' || 
                               (filterMode === 'owned' && isOwned) || 
                               (filterMode === 'missing' && !isOwned);
                               
      return matchesSearch && matchesOwnership;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === 'rarity') {
        const rarityWeights: Record<string, number> = {
          'common': 1, 'uncommon': 2, 'rare': 3, 'holo rare': 4, 'double rare': 5,
          'ultra rare': 6, 'illustration rare': 7, 'special illustration rare': 8, 'hyper rare': 9,
          'c': 1, 'u': 2, 'r': 3, 'rr': 5, 'sr': 6, 'ur': 6, 'ar': 7, 'ir': 7, 'sar': 8, 'sir': 8, 'hr': 9
        };
        const getWeight = (r: string) => rarityWeights[r?.toLowerCase() || ''] || 0;
        comparison = getWeight(a.rarity) - getWeight(b.rarity);
      } else {
        // Default to Number Sort
        const numA = parseInt(a.card_number.replace(/\D/g, '')) || 0;
        const numB = parseInt(b.card_number.replace(/\D/g, '')) || 0;
        comparison = numA - numB;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const toggleOwnership = async (cardId: string) => {
    const isCurrentlyOwned = ownedCardIds.has(cardId);
    const willAdd = !isCurrentlyOwned;
    
    console.log(`[BinderGrid] Toggle card ${cardId}: ${isCurrentlyOwned ? 'Removing' : 'Adding'}`);

    // 1. Optimistic Update
    setOwnedCardIds(prev => {
      const next = new Set(prev);
      if (willAdd) next.add(cardId);
      else next.delete(cardId);
      return next;
    });

    // 2. Sync
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        if (willAdd) {
          const { error } = await supabase
            .from('user_cards')
            .upsert({ 
              user_id: user.id, 
              card_id: cardId,
              quantity: 1
            });
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('user_cards')
            .delete()
            .eq('card_id', cardId)
            .eq('user_id', user.id);
          if (error) throw error;
        }
      } else {
        await persistenceManager.toggleCard(cardId);
      }
      console.log(`[BinderGrid] Sync successful for ${cardId}`);
    } catch (error) {
      console.error(`[BinderGrid] Sync FAILED for ${cardId}:`, error);
      
      // 3. Revert to original state
      setOwnedCardIds(prev => {
        const next = new Set(prev);
        if (isCurrentlyOwned) next.add(cardId); // Put it back
        else next.delete(cardId); // Remove what was optimistically added
        return next;
      });
      
      alert('Gagal memperbarui koleksi. Silakan cek koneksi atau login kembali.');
    }
  };

  // 3. Sync localStorage -> DB when user logs in
  useEffect(() => {
    const syncLocalStorage = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const localItems = await persistenceManager.loadCollection();
      if (localItems.length === 0) return;

      console.log(`[Sync] Migrating ${localItems.length} items from local to DB...`);
      setSyncing(true);

      try {
        const payload = localItems.map(item => ({
          user_id: user.id,
          card_id: item.cardId,
          quantity: item.quantity,
          created_at: item.addedAt
        }));

        const { error } = await supabase
          .from('user_cards')
          .upsert(payload, { onConflict: 'user_id,card_id' });

        if (error) throw error;

        // SUCCESS: Clear local storage
        await persistenceManager.clearCollection();
        console.log('[Sync] Migration successful. Local storage cleared.');

        // Refresh ownedCardIds to include synced data
        const { data: freshCollection } = await supabase
          .from('user_cards')
          .select('card_id')
          .eq('user_id', user.id);
        
        if (freshCollection) {
          setOwnedCardIds(new Set(freshCollection.map(c => c.card_id)));
        }
      } catch (error) {
        console.error('[Sync] Migration failed:', error);
      } finally {
        setSyncing(false);
      }
    };

    syncLocalStorage();
  }, []);

  return (
    <div className="space-y-4">
      {/* Set Navigation & Search - Always Visible */}
      <SetNavigation
        activeSetId={activeSetId || ''}
        onSetChange={setActiveSetId}
        onSearch={setSearchQuery}
        onFilterChange={setFilterMode}
        filterMode={filterMode}
        ownedCount={ownedCardIds.size}
        totalCount={cards.length}
        isQuickAdd={isQuickAdd}
        onQuickAddToggle={() => setIsQuickAdd(!isQuickAdd)}
        sortBy={sortBy}
        onSortChange={setSortBy}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
      />

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <div className="w-12 h-12 border-4 border-ark-purple border-t-transparent rounded-full animate-spin" />
          <p className="text-white/40 text-xs uppercase tracking-widest animate-pulse">Loading Collection...</p>
        </div>
      ) : (
        <>
          <motion.div 
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-4 md:gap-6"
          >
            <AnimatePresence mode="popLayout">
              {processedCards.map((card) => (
                <CardItem
                  key={card.id}
                  card={card}
                  isOwned={ownedCardIds.has(card.id)}
                  isQuickAddMode={isQuickAdd}
                  onClick={() => {
                    if (isQuickAdd) {
                      toggleOwnership(card.id);
                    } else {
                      setSelectedCard(card);
                    }
                  }}
                />
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Empty State */}
          {cards.length === 0 && (
            <div className="py-20 text-center ark-glass rounded-3xl border border-white/5">
              <p className="text-white/20 uppercase tracking-[0.2em] text-sm">No cards found in this set.</p>
            </div>
          )}

          {/* Modal */}
          <CardModal
            card={selectedCard}
            isOpen={!!selectedCard}
            isOwned={selectedCard ? ownedCardIds.has(selectedCard.id) : false}
            onClose={() => setSelectedCard(null)}
            onToggle={toggleOwnership}
          />
        </>
      )}
    </div>
  );
};
