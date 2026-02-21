"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, LogOut, TerminalSquare } from "lucide-react";
import { signIn, signOut } from "next-auth/react";

type NavbarUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

type NavbarProps = {
  user?: NavbarUser | null;
};

export function Navbar({ user }: NavbarProps): JSX.Element {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const displayName = user?.name ?? user?.email ?? "Operator";

  return (
    <nav className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/75 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/dashboard" className="group inline-flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-lg border border-indigo-400/40 bg-indigo-500/15 text-indigo-300 shadow-lg shadow-indigo-500/20 transition group-hover:border-indigo-300 group-hover:text-indigo-200">
            <TerminalSquare className="h-4.5 w-4.5" />
          </span>
          <span className="text-base font-semibold tracking-wide text-slate-100">Heimdall</span>
        </Link>

        {user ? (
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsMenuOpen((value) => !value)}
              className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/80 px-2.5 py-1.5 text-slate-200 transition hover:border-indigo-400/60"
            >
              <span className="relative inline-flex">
                {user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.image}
                    alt={displayName}
                    className="h-8 w-8 rounded-full border border-slate-600 object-cover"
                  />
                ) : (
                  <span className="grid h-8 w-8 place-items-center rounded-full border border-slate-600 bg-slate-800 text-xs font-bold text-slate-200">
                    {displayName.slice(0, 1).toUpperCase()}
                  </span>
                )}
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border border-slate-950 bg-emerald-500" />
              </span>

              <span className="hidden text-sm font-medium sm:inline">{displayName}</span>
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </button>

            <AnimatePresence>
              {isMenuOpen ? (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.16 }}
                  className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-800 bg-slate-900/95 p-2 shadow-2xl"
                >
                  <p className="rounded-md px-3 py-2 text-sm text-slate-300">{displayName}</p>
                  <button
                    type="button"
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="mt-1 inline-flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-red-300 transition hover:bg-red-500/10"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
            className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400"
          >
            Sign in with GitHub
          </button>
        )}
      </div>
    </nav>
  );
}
