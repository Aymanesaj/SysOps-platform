import Link from "next/link";

export default function HomePage(): JSX.Element {
  return (
    <main className="min-h-screen bg-[#0B1120] px-6 py-10 text-slate-200">
      <div className="mx-auto max-w-3xl rounded-2xl border border-slate-800 bg-slate-900/60 p-8 shadow-[0_0_40px_rgba(99,102,241,0.08)]">
        <h1 className="text-3xl font-semibold tracking-tight">Heimdall SysOps Platform</h1>
        <p className="mt-3 text-slate-400">Enter the command center to monitor workshops, assignments, and mission telemetry.</p>
        <Link
          className="mt-6 inline-flex items-center gap-2 rounded-lg border border-indigo-500/40 bg-indigo-500/10 px-4 py-2 text-sm font-semibold text-indigo-300 transition-all duration-200 hover:bg-indigo-500/20"
          href="/dashboard"
        >
          Go to Dashboard
        </Link>
      </div>
    </main>
  );
}
