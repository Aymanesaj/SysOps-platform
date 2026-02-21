"use client";

import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

export function Navbar(): JSX.Element {
  const { data: session, status } = useSession();

  return (
    <nav className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/dashboard" className="text-lg font-semibold text-slate-900">
          Heimdall SysOps
        </Link>

        <div className="flex items-center gap-3">
          {status === "loading" ? (
            <span className="text-sm text-slate-500">Loading...</span>
          ) : session?.user ? (
            <>
              <span className="text-sm text-slate-600">{session.user.name ?? session.user.email ?? "GitHub User"}</span>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-slate-700"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
              className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-slate-700"
            >
              Login with GitHub
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
