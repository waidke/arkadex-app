import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase-server';

/**
 * PKCE Auth Callback Route
 * Handles the exchange of 'code' for a session.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/binder';
  const safeNext = next.startsWith('/') ? next : '/binder';

  if (!code) {
    console.error('[auth/callback] Missing code parameter');
    return NextResponse.redirect(`${origin}/?message=auth_error`);
  }

  const supabase = await createServerSupabase();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error('[auth/callback] exchangeCodeForSession failed:', error.message);
    return NextResponse.redirect(`${origin}/?message=auth_error`);
  }

  return NextResponse.redirect(`${origin}${safeNext}`);
}
