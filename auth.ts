import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { authConfig } from "./auth.config";

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    Google,
    Credentials({
      async authorize(credentials) {
        try {
          const response = await fetch(
            `${process.env.FAST_API_URL}/user/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(credentials),
            }
          );

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || "Failed to authenticate");
          }

          if (data.success) {
            return {
              id: data.data._id,
              name: data.data.name,
              email: data.data.email,
            };
          }

          return null;
        } catch (error) {
          console.error("Error during authentication:", error);
          throw new Error("Failed to authenticate");
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 1 * 24 * 60 * 60, // 1 day
  },
  trustHost: true,
});
