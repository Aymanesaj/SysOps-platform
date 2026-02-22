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
    <nav className="sticky top-0 z-40 border-b border-zinc-800/80 bg-black/70 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-3">
        <Link href="/dashboard" className="group inline-flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-lg border border-blue-500/40 bg-blue-500/10 text-blue-300 shadow-[0_0_18px_rgba(37,99,235,0.35)] transition-all duration-200 group-hover:border-blue-400 group-hover:text-blue-200">
            <TerminalSquare className="h-4.5 w-4.5" />
          </span>
          <span className="text-base font-semibold tracking-wide text-zinc-100">Heimdall</span>
        </Link>

        {user ? (
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsMenuOpen((value) => !value)}
              className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900 px-2.5 py-1.5 text-zinc-200 transition-all duration-200 hover:border-blue-500/60"
            >
              <span className="relative inline-flex">
                {user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.image}
                    alt={displayName}
                    className="h-8 w-8 rounded-full border border-zinc-600 object-cover"
                  />
                ) : (
                  <span className="grid h-8 w-8 place-items-center rounded-full border border-zinc-600 bg-zinc-800 text-xs font-bold text-zinc-200">
                    {displayName.slice(0, 1).toUpperCase()}
                  </span>
                )}
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border border-zinc-900 bg-emerald-400" />
              </span>

              <span className="hidden text-sm font-medium sm:inline">{displayName}</span>
              <ChevronDown className="h-4 w-4 text-zinc-500" />
            </button>

            <AnimatePresence>
              {isMenuOpen ? (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.16 }}
                  className="absolute right-0 mt-2 w-56 rounded-xl border border-zinc-800 bg-zinc-900 p-2 shadow-[0_0_28px_rgba(59,130,246,0.16)]"
                >
                  <p className="rounded-md px-3 py-2 text-sm text-zinc-400">{displayName}</p>
                  <button
                    type="button"
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="mt-1 inline-flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-rose-300 transition-all duration-200 hover:bg-rose-500/10"
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
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-blue-500 hover:shadow-[0_0_20px_rgba(37,99,235,0.45)]"
          >
            Sign in with GitHub
          </button>
        )}
      </div>
    </nav>
  );
}
