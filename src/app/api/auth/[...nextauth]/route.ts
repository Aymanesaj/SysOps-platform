import NextAuth, { type NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";

/**
 * GitHub-only authentication configuration.
 *
 * Required environment variables:
 * - AUTH_SECRET
 * - AUTH_GITHUB_ID
 * - AUTH_GITHUB_SECRET
 */
const authConfig: NextAuthConfig = {
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
};

const authHandler = NextAuth(authConfig);

export { authHandler as GET, authHandler as POST };
