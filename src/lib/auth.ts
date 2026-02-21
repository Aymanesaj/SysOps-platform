import NextAuth, { type NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";

/**
 * Centralized NextAuth configuration.
 *
 * Required environment variables:
 * - AUTH_SECRET
 * - AUTH_GITHUB_ID
 * - AUTH_GITHUB_SECRET
 */
export const authConfig = {
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID ?? "",
      clientSecret: process.env.AUTH_GITHUB_SECRET ?? "",
    }),
  ],
  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/",
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
