'use client';

import React from 'react';
import Image from 'next/image';
import { CardHolographic } from './CardHolographic';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X } from 'lucide-react';

interface CardItemProps {
  card: {
    id: string;
    name: string;
    card_number: string;
    image_url: string;
    rarity: string;
  };
  isOwned: boolean;
  isQuickAddMode?: boolean;
  onClick: () => void;
}

export const CardItem: React.FC<CardItemProps> = ({ 
  card, 
  isOwned, 
  isQuickAddMode = false,
  onClick 
}) => {
  const [imgError, setImgError] = React.useState(false);
  const [activeAction, setActiveAction] = React.useState<'add' | 'remove' | null>(null);

  const handleClick = () => {
    if (isQuickAddMode) {
      // Lock the action based on CURRENT state
      setActiveAction(isOwned ? 'remove' : 'add');
      setTimeout(() => setActiveAction(null), 800);
    }
    onClick();
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={isQuickAddMode 
        ? `${isOwned ? 'Remove' : 'Add'} ${card.name} ${card.card_number} ${isOwned ? 'from' : 'to'} collection` 
        : `View details for ${card.name} ${card.card_number}`
      }
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      className={`relative group cursor-pointer aspect-[2/3] rounded-xl overflow-hidden transition-all duration-500
        ${isOwned 
          ? 'ring-1 ring-white/20 shadow-xl' 
          : 'opacity-40 grayscale hover:grayscale-0 hover:opacity-100'
        }
        ${isQuickAddMode ? 'ring-2 ring-ark-purple shadow-[0_0_20px_rgba(168,85,247,0.4)]' : ''}
      `}
    >
      {/* BUG-002: ARIA Live Status */}
      <div className="sr-only" aria-live="polite">
        {activeAction ? `${card.name} ${activeAction === 'remove' ? 'removed from' : 'added to'} collection` : ""}
      </div>
      <CardHolographic rarity={card.rarity} isOwned={isOwned}>
        {/* Quick Add Success Overlay */}
        <AnimatePresence>
          {activeAction && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
              animate={{ opacity: 1, scale: 1.2, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className={`absolute inset-0 z-50 flex items-center justify-center backdrop-blur-[2px]
                ${activeAction === 'remove' ? 'bg-red-500/20' : 'bg-ark-purple/20'}
              `}
            >
              <div className={`p-3 rounded-full border-2 border-white shadow-2xl
                ${activeAction === 'remove' ? 'bg-red-500 shadow-red-500/50' : 'bg-ark-purple shadow-ark-purple/50'}
              `}>
                {activeAction === 'remove' ? (
                  <X className="text-white w-6 h-6" strokeWidth={4} />
                ) : (
                  <Check className="text-white w-6 h-6" strokeWidth={4} />
                )}
              </div>
              
              {/* Neon Ring Burst */}
              <motion.div
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 2, opacity: 0 }}
                className={`absolute inset-0 border-4 rounded-full ${activeAction === 'remove' ? 'border-red-500' : 'border-ark-purple'}`}
                transition={{ duration: 0.5 }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Add Mode Indicator */}
        {isQuickAddMode && (
          <div className="absolute top-2 right-2 z-10 w-4 h-4 bg-ark-purple rounded-full border-2 border-white flex items-center justify-center animate-pulse shadow-lg pointer-events-none">
            <div className="w-1.5 h-1.5 bg-white rounded-full" />
          </div>
        )}

        {/* Card Image */}
        <div className="relative w-full h-full bg-black/20">
          {card.image_url && !imgError ? (
            <Image
              src={card.image_url}
              alt={card.name}
              fill
              sizes="(max-width: 768px) 33vw, (max-width: 1200px) 20vw, 15vw"
              className="object-contain p-1"
              loading="lazy"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-white/5 text-white/20 p-4 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-2 opacity-20"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
              <span className="text-[8px] uppercase tracking-tighter opacity-40 font-mono">{card.card_number}</span>
              <span className="text-[10px] uppercase font-black truncate w-full">{card.name}</span>
            </div>
          )}
        </div>

        {/* Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 via-black/40 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[8px] text-white/40 font-mono tracking-tighter">#{card.card_number}</p>
              <p className="text-[10px] font-bold truncate text-white uppercase leading-tight">{card.name}</p>
            </div>
            <div className="text-[8px] font-black text-ark-purple uppercase tracking-widest bg-white/5 px-1.5 py-0.5 rounded border border-white/5">
              {card.rarity.split(' ')[0]}
            </div>
          </div>
        </div>
      </CardHolographic>
    </motion.div>
  );
};
