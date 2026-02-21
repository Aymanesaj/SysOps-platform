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
  callbacks: {
    jwt({ token, account, profile }) {
      token.id = token.sub;

      if (account?.provider === "github") {
        const profileWithId = profile as { id?: number | string } | undefined;
        token.githubId =
          (typeof profileWithId?.id === "number" || typeof profileWithId?.id === "string"
            ? String(profileWithId.id)
            : undefined) ?? account.providerAccountId;
      }

      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id ?? "";
        session.user.githubId = token.githubId;
      }

      return session;
    },
  },
  pages: {
    signIn: "/",
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
