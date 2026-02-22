"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Settings, TerminalSquare, Wrench, LogIn, LogOut } from "lucide-react";
import { signIn, signOut } from "next-auth/react";

type SidebarUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

type SidebarProps = {
  user?: SidebarUser | null;
};

type NavItem = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
};

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard", label: "Workshops", icon: Wrench },
  { href: "/dashboard", label: "Settings", icon: Settings },
];

export function Sidebar({ user }: SidebarProps): JSX.Element {
  const pathname = usePathname();
  const displayName = user?.name ?? user?.email ?? "Operator";

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-slate-800 bg-[#0B1120]/90 backdrop-blur-xl lg:flex lg:flex-col">
      <div className="flex h-full flex-col p-4">
        <Link
          href="/dashboard"
          className="group inline-flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-3 transition-all duration-200 hover:border-indigo-500/40"
        >
          <span className="grid h-9 w-9 place-items-center rounded-lg border border-indigo-500/40 bg-indigo-500/10 text-indigo-300 shadow-[0_0_18px_rgba(99,102,241,0.35)]">
            <TerminalSquare className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-200">Heimdall</p>
            <p className="text-xs text-slate-400">SysOps Command</p>
          </div>
        </Link>

        <nav className="mt-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);

            return (
              <Link
                key={`${item.href}-${item.label}`}
                href={item.href}
                className={`group flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "border-indigo-500/40 bg-indigo-500/10 text-indigo-200 shadow-[inset_0_0_20px_rgba(99,102,241,0.12)]"
                    : "border-slate-800 bg-slate-900/30 text-slate-300 hover:border-slate-700 hover:bg-slate-900/60"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto rounded-xl border border-slate-800 bg-slate-900/60 p-3">
          <div className="flex items-center gap-3">
            {user?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.image} alt={displayName} className="h-9 w-9 rounded-full border border-slate-700 object-cover" />
            ) : (
              <span className="grid h-9 w-9 place-items-center rounded-full border border-slate-700 bg-slate-800 text-xs font-bold text-slate-200">
                {displayName.slice(0, 1).toUpperCase()}
              </span>
            )}
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-200">{displayName}</p>
              <p className="truncate text-xs text-slate-400">Engineering Access</p>
            </div>
          </div>

          {user ? (
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-300 transition-all duration-200 hover:bg-rose-500/20"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </button>
          ) : (
            <button
              type="button"
              onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-indigo-500/40 bg-indigo-500/10 px-3 py-2 text-xs font-semibold text-indigo-200 transition-all duration-200 hover:bg-indigo-500/20"
            >
              <LogIn className="h-3.5 w-3.5" /> Sign in
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
