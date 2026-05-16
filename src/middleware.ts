import { NextResponse, type NextRequest } from 'next/server';
import { createMiddlewareSupabase } from '@/lib/supabase-server';

/**
 * ArkaDex Middleware
 * 1. Syncs Supabase session for all routes.
 * 2. Protects /admin/* routes using ADMIN_EMAIL_WHITELIST.
 */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createMiddlewareSupabase(request, response);

  // IMPORTANT: getUser() is the only safe way to get the session in middleware
  // as it validates the JWT against Supabase Auth server.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protect Admin Routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const whitelist = (process.env.ADMIN_EMAIL_WHITELIST ?? '')
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);
    const isAuthorized = (user && whitelist.includes((user.email ?? '').toLowerCase()));

    if (!isAuthorized) {
      // Redirect to home if not authorized
      const url = request.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
