import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PROTECTED = ["/check-in", "/dashboard", "/reports", "/insights", "/history", "/account", "/onboarding"];

export async function middleware(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return NextResponse.next({ request });

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(url, key,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {
    // treat as unauthenticated on auth errors; page-level guard handles redirect
  }

  const isProtected = PROTECTED.some((p) =>
    request.nextUrl.pathname.startsWith(p)
  );

  if (isProtected) {
    const redirect = request.nextUrl.clone();
    redirect.pathname = "/auth";

    if (!user) {
      redirect.searchParams.set("next", request.nextUrl.pathname);
      return NextResponse.redirect(redirect);
    }

    if (!user.email_confirmed_at) {
      redirect.searchParams.set("error", "verify_email");
      return NextResponse.redirect(redirect);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|PNG|jpg|JPG|jpeg|JPEG|gif|GIF|webp|WEBP)$).*)",
  ],
};
