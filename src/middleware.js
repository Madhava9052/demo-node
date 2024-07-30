import { NextResponse } from 'next/server';
import { ROLES } from './constants/variablesNames';

// Middleware function to handle authentication
export function middleware(req) {
  const path = req.nextUrl.pathname;
  // Define public paths that do not require authentication
  const isPublicPath =
    path === '/user/login' ||
    path === '/user/register' ||
    path === '/user/forgot_password';

  // Get the token from cookies if it exists
  const token = req.cookies.get('token')?.value || '';
  const role = req.cookies.get('role')?.value || '';

  if (!isPublicPath && !token) {
    // If the path is not public and there's no token, redirect to the login page
    return NextResponse.redirect(new URL('/user/login', req.nextUrl));
  }
  if (token && isPublicPath) {
    // If there is a token but the path is public, redirect to the homepage
    return NextResponse.redirect(new URL('/', req.nextUrl));
  }
}

// Configuration for the middleware matcher
export const config = {
  // Define the paths where this middleware should be applied
  matcher: ['/user/:path*'],
};
