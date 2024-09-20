import { NextRequest } from 'next/server';
import getSession from './lib/getSession';

interface RouteUrl {
  [key: string]: boolean;
}

const publicOnlyUrl: RouteUrl = {
  '/': true,
  '/login': true,
  '/create-account': true,
  '/sms': true,
};

export const middleware = async (req: NextRequest) => {
  const session = await getSession();
  const exits = publicOnlyUrl[req.nextUrl.pathname];
  if (!session?.id) {
    if (!exits) {
      return Response.redirect(new URL('/', req.url));
    }
  } else if (exits) {
    return Response.redirect(new URL('/profile', req.url));
  }
  return null;
};

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
