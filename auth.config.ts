import type { NextAuthConfig } from "next-auth";

export const publicRoutes = [
  "/login",
  "/signup",
  "/api/health",
  "/forgot-password",
  "/api/auth/signin",
  "/api/auth/callback/google",
];

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isPublicRoute = publicRoutes.includes(nextUrl.pathname);

      // Allow public routes
      if (isPublicRoute) return true;

      // Protect all other routes
      if (!isLoggedIn) return false;

      return true;
    },
    async signIn({ user, account }) {
      try {
        if (account?.provider === "google") {
          const response = await fetch(
            `${process.env.FAST_API_URL}/user/google-auth`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: user.email,
                name: user.name,
                google_id: user.id,
              }),
            }
          );

          if (!response.ok) {
            return false;
          }

          const data = await response.json();
          if (!data.success) {
            return false;
          }

          // Store the backend response data in the user object
          user.id = data.data._id;
          user.name = data.data.name;
          user.email = data.data.email;
          return true;
        }
        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      }
    },
    jwt({ token, user, account }) {
      if (account?.provider === "google") {
        token.provider = "google";
      }
      if (user) {
        token.id = user.id!;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id!;
      session.user.email = token.email!;
      session.user.name = token.name;
      return session;
    },
  },
  providers: [], // Configured in auth.ts
} satisfies NextAuthConfig;
