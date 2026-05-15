'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase-client';
import { motion } from 'framer-motion';

export const LoginButton = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) return null;

  return (
    <div className="fixed top-6 right-6 z-50">
      {user ? (
        <div className="flex items-center gap-3 ark-glass p-2 pr-4 rounded-full border border-white/10">
          {user.user_metadata.avatar_url && (
            <img 
              src={user.user_metadata.avatar_url} 
              alt="Avatar" 
              className="w-8 h-8 rounded-full border border-white/20"
            />
          )}
          <div className="flex flex-col">
            <span className="text-[10px] text-white/40 uppercase tracking-tighter leading-none">Logged In</span>
            <span className="text-xs text-white font-medium truncate max-w-[100px]">{user.email}</span>
          </div>
          <button 
            onClick={handleLogout}
            className="ml-2 p-1.5 hover:bg-white/10 rounded-full transition-colors group"
            title="Logout"
          >
            <svg className="w-4 h-4 text-white/60 group-hover:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      ) : (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogin}
          className="flex items-center gap-2 px-6 py-2.5 bg-white text-black font-bold rounded-full hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Sign In
        </motion.button>
      )}
    </div>
  );
};
