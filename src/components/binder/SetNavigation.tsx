'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { Search, Filter, SortAsc, SortDesc, ChevronDown } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

interface SetData {
  id: string;
  name: string;
  code: string;
  series: string;
  total_cards: number;
  logo_url?: string;
}

interface SetNavigationProps {
  activeSetId: string | null;
  onSetChange: (setId: string) => void;
  onSearch: (query: string) => void;
  onFilterChange: (mode: 'all' | 'owned' | 'missing') => void;
  filterMode: 'all' | 'owned' | 'missing';
  ownedCount: number;
  totalCount: number;
  isQuickAdd: boolean;
  onQuickAddToggle: () => void;
  sortBy: 'number' | 'name' | 'rarity';
  onSortChange: (sort: 'number' | 'name' | 'rarity') => void;
  sortOrder: 'asc' | 'desc';
  onSortOrderChange: (order: 'asc' | 'desc') => void;
}

export const SetNavigation: React.FC<SetNavigationProps> = ({
  activeSetId,
  onSetChange,
  onSearch,
  onFilterChange,
  filterMode,
  ownedCount,
  totalCount,
  isQuickAdd,
  onQuickAddToggle,
  sortBy,
  onSortChange,
  sortOrder,
  onSortOrderChange
}) => {
  const [sets, setSets] = useState<SetData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchSets = async () => {
      const { data } = await supabase
        .from('sets')
        .select('*')
        .order('series', { ascending: false });
      if (data) setSets(data);
    };
    fetchSets();
  }, []);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isSetOpen, setIsSetOpen] = useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    onSearch(val);
  };

  return (
    <div className="sticky top-4 z-[1000] w-full px-2 mb-12 isolate">
      <div className="max-w-7xl mx-auto ark-glass rounded-2xl border border-white/10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] p-2 md:p-3">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          
          {/* Left: Context & Identity (4 cols) */}
          <div className="lg:col-span-4 flex items-center gap-3">
            {/* Set Selector Dropdown */}
            <div className="relative group min-w-[200px] flex items-center">
              <div className="relative w-full">
                <button
                  onClick={() => { setIsSetOpen(!isSetOpen); setIsFilterOpen(false); setIsSortOpen(false); }}
                  className="w-full flex items-center justify-between bg-black/40 border border-white/10 rounded-xl h-11 px-4 text-[10px] font-black uppercase tracking-widest text-white hover:border-ark-purple/50 focus:outline-none transition-all cursor-pointer"
                >
                  <span>{sets.find(s => s.id === activeSetId)?.name || 'Scarlet ex'}</span>
                  <ChevronDown className={`w-4 h-4 text-white/20 transition-transform duration-300 ${isSetOpen ? 'rotate-180 text-ark-purple' : ''}`} />
                </button>

                <AnimatePresence>
                  {isSetOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute left-0 mt-2 w-full min-w-[240px] bg-zinc-950/95 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden z-[1010] shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-1"
                    >
                      {/* Hardcoded Fallback for Scarlet ex */}
                      <button
                        onClick={() => { onSetChange('47f90af4-c38a-42a5-a4d0-80c8c6ec7921'); setIsSetOpen(false); }}
                        className={`w-full px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest transition-all rounded-xl mb-1
                          ${activeSetId === '47f90af4-c38a-42a5-a4d0-80c8c6ec7921' ? 'bg-ark-purple text-white' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}
                      >
                        Scarlet ex
                      </button>

                      {/* Dynamic Sets */}
                      {sets.filter(s => s.id !== '47f90af4-c38a-42a5-a4d0-80c8c6ec7921').map((set) => (
                        <button
                          key={set.id}
                          onClick={() => { onSetChange(set.id); setIsSetOpen(false); }}
                          className={`w-full px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest transition-all rounded-xl
                            ${activeSetId === set.id ? 'bg-ark-purple text-white' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}
                        >
                          {set.name || set.code}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Collection Progress */}
            <div className="flex items-center gap-3 bg-black/40 px-4 h-11 rounded-xl border border-white/5 flex-grow">
              <div className="flex flex-col">
                <span className="text-[8px] text-white/30 uppercase font-black tracking-widest leading-none mb-1">Own</span>
                <span className="text-sm font-black text-white leading-none">{ownedCount}<span className="text-[10px] text-white/20 ml-1">/ {totalCount}</span></span>
              </div>
              <div className="w-px h-6 bg-white/10 mx-1" />
              <div className="flex flex-col items-end flex-grow">
                <span className="text-[8px] text-ark-purple uppercase font-black tracking-widest leading-none mb-1">Score</span>
                <span className="text-sm font-black text-white leading-none">{totalCount > 0 ? Math.round((ownedCount/totalCount)*100) : 0}%</span>
              </div>
            </div>
          </div>

          {/* Middle: Primary Search (4 cols) */}
          <div className="lg:col-span-4 relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-ark-purple transition-colors">
              <Search className="w-4 h-4" />
            </div>
            <input 
              type="text"
              placeholder="SEARCH NAME OR NUMBER..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full h-11 bg-black/60 border border-white/10 rounded-xl pl-12 pr-4 text-[10px] font-black text-white placeholder:text-white/10 focus:outline-none focus:border-ark-purple focus:ring-4 focus:ring-ark-purple/10 transition-all uppercase tracking-widest shadow-inner"
            />
          </div>

          {/* Right: Actions & Refinement (4 cols) */}
          <div className="lg:col-span-4 flex items-center justify-end gap-3">
            <button 
              onClick={onQuickAddToggle}
              className={`h-11 px-4 rounded-xl font-black uppercase text-[9px] tracking-widest transition-all duration-300 group flex items-center gap-2 border
                ${isQuickAdd 
                  ? 'bg-ark-purple border-ark-purple text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]' 
                  : 'bg-white/5 border-white/5 text-white/30 hover:bg-white/10 hover:text-white'
                }`}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${isQuickAdd ? 'bg-white animate-pulse' : 'bg-white/20'}`} />
              <span className="hidden xl:inline">Quick Mode</span>
              <span className="xl:hidden">QA</span>
            </button>

            <div className="flex items-center gap-2">
              {/* Filter Dropdown */}
              <div className="relative">
                <button
                  onClick={() => { setIsFilterOpen(!isFilterOpen); setIsSortOpen(false); }}
                  className={`w-11 h-11 flex items-center justify-center rounded-xl border transition-all
                    ${isFilterOpen || filterMode !== 'all'
                      ? 'bg-ark-purple/20 border-ark-purple/50 text-ark-purple'
                      : 'bg-white/5 border-white/5 text-white/30 hover:bg-white/10'}`}
                >
                  <Filter className="w-4 h-4" />
                </button>

                <AnimatePresence>
                  {isFilterOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-48 bg-zinc-950/95 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden z-[1010] shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-1"
                    >
                      {(['all', 'owned', 'missing'] as const).map((mode) => (
                        <button
                          key={mode}
                          onClick={() => { onFilterChange(mode); setIsFilterOpen(false); }}
                          className={`w-full px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest transition-all rounded-xl
                            ${filterMode === mode ? 'bg-ark-purple text-white' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}
                        >
                          {mode}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Integrated Sort Controller (Split Button) */}
              <div className="flex items-center bg-white/5 rounded-xl border border-white/5">
                {/* Category Dropdown Trigger */}
                <div className="relative border-r border-white/5">
                  <button
                    onClick={() => { setIsSortOpen(!isSortOpen); setIsFilterOpen(false); }}
                    className={`h-11 px-4 flex items-center gap-2 transition-all rounded-l-xl
                      ${isSortOpen ? 'bg-ark-purple/20 text-ark-purple' : 'text-white/30 hover:bg-white/10 hover:text-white'}`}
                  >
                    <span className="text-[10px] font-black uppercase tracking-widest">{sortBy}</span>
                  </button>

                  <AnimatePresence>
                    {isSortOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-48 bg-zinc-950/95 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden z-[1010] shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-1"
                      >
                        {(['number', 'name', 'rarity'] as const).map((sort) => (
                          <button
                            key={sort}
                            onClick={() => { onSortChange(sort); setIsSortOpen(false); }}
                            className={`w-full px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest transition-all rounded-xl
                              ${sortBy === sort ? 'bg-ark-purple text-white' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}
                          >
                            {sort}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Direction Toggle */}
                <button
                  onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="h-11 w-10 flex items-center justify-center text-white/20 hover:text-white hover:bg-white/10 transition-all rounded-r-xl"
                  title={sortOrder === 'asc' ? 'Switch to Descending' : 'Switch to Ascending'}
                >
                  <motion.div
                    key={sortOrder}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  >
                    {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                  </motion.div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
