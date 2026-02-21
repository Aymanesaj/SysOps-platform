import { type DefaultSession } from "next-auth";

/**
 * NextAuth module augmentation for strict app-wide auth typing.
 */
declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      githubId: string;
    };
  }

  interface User {
    id: string;
    githubId: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    githubId: string;
  }
}
