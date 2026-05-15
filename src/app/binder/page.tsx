import React from 'react';
import { BinderGrid } from '@/components/binder/BinderGrid';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Digital Binder | ArkaDex',
  description: 'View your Pokémon TCG Indonesia collection progress.',
};

export default function BinderPage() {
  return (
    <main className="min-h-screen bg-ark-black pt-24 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <BinderGrid />
      </div>
    </main>
  );
}
