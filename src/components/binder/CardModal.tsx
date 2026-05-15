'use client';

import React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface CardModalProps {
  card: {
    id: string;
    name: string;
    card_number: string;
    image_url: string;
    rarity: string;
    supertype: string;
    element?: string | null;
  } | null;
  isOpen: boolean;
  isOwned: boolean;
  onClose: () => void;
  onToggle: (cardId: string) => void;
}

export const CardModal: React.FC<CardModalProps> = ({ card, isOpen, isOwned, onClose, onToggle }) => {
  const [imgError, setImgError] = React.useState(false);

  // Reset error state when card changes
  React.useEffect(() => {
    setImgError(false);
  }, [card?.id]);

  if (!card) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4 md:p-8"
          >
            {/* Modal Content */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full ark-glass rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-2xl ring-1 ring-white/10"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors z-[110]"
              >
                <X size={20} />
              </button>

              {/* Left: Image Section */}
              <div className="w-full md:w-1/2 p-8 flex items-center justify-center bg-black/20">
                <div className="relative aspect-[2/3] w-full max-w-[350px] drop-shadow-[0_0_30px_rgba(139,92,246,0.3)]">
                  {!imgError ? (
                    <Image
                      src={card.image_url}
                      alt={card.name}
                      fill
                      className="object-contain"
                      priority
                      onError={() => setImgError(true)}
                    />
                  ) : (
                    <div className="w-full h-full ark-glass border border-white/5 rounded-2xl flex flex-col items-center justify-center text-white/10">
                       <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4 opacity-20"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                       <p className="text-xs uppercase tracking-widest font-black opacity-30">Image Unavailable</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Info Section */}
              <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                <header className="mb-8">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 rounded-full bg-ark-purple/20 text-ark-purple text-[10px] font-bold uppercase tracking-widest border border-ark-purple/30">
                      {card.supertype}
                    </span>
                    <span className="text-white/40 text-[10px] font-mono">#{card.card_number}</span>
                  </div>
                  <h2 className="text-4xl font-black text-white uppercase tracking-tight leading-none mb-2">
                    {card.name}
                  </h2>
                  <p className="text-ark-blue font-bold tracking-widest text-xs uppercase opacity-80">
                    {card.rarity}
                  </p>
                </header>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <p className="text-[10px] text-white/30 uppercase mb-1">Element</p>
                    <p className="text-sm font-bold text-white capitalize">{card.element || 'None'}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <p className="text-[10px] text-white/30 uppercase mb-1">Collection Status</p>
                    <p className={`text-sm font-bold uppercase ${isOwned ? 'text-green-400' : 'text-white/40'}`}>
                      {isOwned ? 'Owned' : 'Missing'}
                    </p>
                  </div>
                </div>

                <div className="mt-auto pt-8 border-t border-white/10">
                  <button 
                    onClick={() => onToggle(card.id)}
                    className={`w-full py-4 rounded-xl font-bold uppercase text-xs tracking-widest transition-all active:scale-95 shadow-lg
                      ${isOwned 
                        ? 'bg-red-500/10 border border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white' 
                        : 'bg-white text-black hover:bg-ark-purple hover:text-white'
                      }
                    `}
                  >
                    {isOwned ? 'Remove from Collection' : 'Add to Collection'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
