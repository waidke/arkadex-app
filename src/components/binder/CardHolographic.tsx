'use client';

import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface CardHolographicProps {
  children: React.ReactNode;
  rarity?: string;
  isOwned: boolean;
}

export const CardHolographic: React.FC<CardHolographicProps> = ({ 
  children, 
  rarity, 
  isOwned 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Motion values for tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for rotation
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  // Transform rotation values
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  // Shimmer position based on mouse
  const shimmerX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"]);
  const shimmerY = useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !isOwned) return;

    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Only apply holofact if rare and owned
  const isRare = rarity?.toLowerCase().includes('rare') || 
                 rarity?.toLowerCase().includes('ultra') ||
                 rarity?.toLowerCase().includes('secret');

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: "1000px",
        rotateX: isOwned ? rotateX : 0,
        rotateY: isOwned ? rotateY : 0,
        willChange: "transform", // BUG-001: GPU Acceleration
      }}
      className="relative w-full h-full preserve-3d"
    >
      {children}

      {/* Shimmer Overlay */}
      {isOwned && isRare && (
        <motion.div
          style={{
            background: useTransform(
              [mouseXSpring, mouseYSpring],
              ([mx, my]) => `radial-gradient(circle at ${((mx as number) + 0.5) * 100}% ${((my as number) + 0.5) * 100}%, rgba(255, 255, 255, 0.4) 0%, transparent 60%)`
            ),
            willChange: "background", // BUG-001: Performance optimization
          }}
          className="absolute inset-0 z-20 pointer-events-none opacity-0 group-hover:opacity-40 transition-opacity duration-500 mix-blend-overlay"
        />
      )}

      {/* Rainbow Foil Effect for Super Rares */}
      {isOwned && rarity?.toLowerCase().includes('secret') && (
        <motion.div
          style={{
            background: `linear-gradient(135deg, rgba(255,0,0,0.1) 0%, rgba(0,255,0,0.1) 50%, rgba(0,0,255,0.1) 100%)`,
            backgroundSize: '200% 200%',
          }}
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute inset-0 z-10 pointer-events-none mix-blend-color-dodge opacity-30"
        />
      )}
    </motion.div>
  );
};
