import type { NextAuthConfig } from "next-auth"

export const publicRoutes = [
  '/login',
  '/signup',
  '/api/health',
  '/forgot-password'
]

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
      
      // Allow public routes
      if (isPublicRoute) return true
      
      // Protect all other routes
      if (!isLoggedIn) return false
      
      return true
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id!
        token.email = user.email
        token.name = user.name
      }
      return token
    },
    session({ session, token }) {
      session.user.id = token.id!
      session.user.email = token.email!
      session.user.name = token.name
      return session
    },
  },
  providers: [], // Configured in auth.ts
} satisfies NextAuthConfig