import React from 'react';

export default function LegalPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-24 min-h-screen">
      <header className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Legal Disclaimer</h1>
        <p className="text-white/40">Last Updated: May 13, 2026</p>
      </header>

      <div className="prose prose-invert max-w-none space-y-12 text-white/70 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-white mb-4">1. Project Status</h2>
          <p>
            ArkaDex is an independent, fan-made application. ArkaDex is <strong>NOT</strong> affiliated with, endorsed by, sponsored by, or otherwise officially connected to:
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li>The Pokémon Company</li>
            <li>Nintendo</li>
            <li>Creatures Inc.</li>
            <li>GAME FREAK inc.</li>
            <li>AKG Games / PT. Anugerah Kasih Gemilang (Official Indonesia Distributor)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">2. Intellectual Property (IP)</h2>
          <p>
            All Pokémon TCG card names, images, text, and related assets displayed in this application are the copyright and trademarks of their respective owners. The use of these assets within ArkaDex is intended for <strong>informational, educational, and fair use</strong> purposes for the collector community.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">3. Data Accuracy</h2>
          <p>
            ArkaDex strives to provide set and card data as accurately as possible in accordance with official releases in Indonesia. However, we do not guarantee 100% data accuracy, including but not limited to market prices, card numbering, or card rarity.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">4. Limitation of Liability</h2>
          <p>
            ArkaDex is not responsible for any financial decisions (buying/selling) made by users based on the information provided in this application. Any transactions occurring outside the application are the full responsibility of the respective parties.
          </p>
        </section>

        <footer className="pt-12 border-t border-white/10">
          <p className="italic">
            ArkaDex is developed with the spirit of advancing the Pokémon TCG community in Indonesia. We respect the rights of trademark owners and do not directly monetize access to images or card data.
          </p>
        </footer>
      </div>
      
      <div className="mt-16">
        <a href="/" className="text-ark-blue hover:underline text-sm">← Back to Home</a>
      </div>
    </main>
  );
}
