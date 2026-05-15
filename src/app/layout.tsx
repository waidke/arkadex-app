import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LoginButton } from "@/components/auth/LoginButton";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ArkaDex | TCG Collector Hub",
  description: "Your premium TCG collection management platform.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-ark-black text-white antialiased flex flex-col min-h-screen`}>
        <div className="flex-grow">
          <LoginButton />
          {children}
        </div>
        
        {/* F-02: Legal Compliance Footer */}
        <footer className="border-t border-white/5 py-8 px-6 bg-black/40 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-white/30 uppercase tracking-widest">
            <p className="text-center md:text-left max-w-xl">
              ArkaDex is a fan-made tool. Pokémon and its trademarks are ©1995–2026 Nintendo/Creatures Inc./GAME FREAK inc. 
              This project is not affiliated with The Pokémon Company.
            </p>
            <div className="flex gap-6">
              <a href="/legal" className="hover:text-white transition-colors">Legal Disclaimer</a>
              <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
