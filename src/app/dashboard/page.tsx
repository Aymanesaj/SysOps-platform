import Link from "next/link";
import { Activity, ArrowRight, Flame, GitBranch, ShieldCheck, Target } from "lucide-react";
import { auth } from "@/lib/auth";
import type { DashboardAssignment, DashboardSession } from "@/types/domain";

const sessions: Array<DashboardSession & { category: string; completed: number }> = [
  {
    id: "session-1",
    title: "CI/CD Foundations",
    category: "CI/CD",
    description: "Set up and harden your first production-grade GitHub Actions pipeline.",
    startsAt: "2026-03-01T18:00:00.000Z",
    endsAt: "2026-03-01T20:00:00.000Z",
    completed: 1,
  },
  {
    id: "session-2",
    title: "Containers in Practice",
    category: "Docker",
    description: "Package and deploy a Next.js service with repeatable Docker workflows.",
    startsAt: "2026-03-08T18:00:00.000Z",
    endsAt: "2026-03-08T20:00:00.000Z",
    completed: 0,
  },
];

const assignments: DashboardAssignment[] = [
  {
    id: "assignment-1",
    title: "Pipeline Bootstrapping",
    instructions: "Create a workflow that runs lint and tests for every pull request.",
    deadline: "2026-03-05T23:59:59.000Z",
    templateRepoUrl: "https://github.com/heimdall-devops/template-ci-starter",
    isActive: true,
    sessionId: "session-1",
  },
  {
    id: "assignment-2",
    title: "Dockerize the App",
    instructions: "Build a multistage Docker image and run it via docker compose.",
    deadline: "2026-03-12T23:59:59.000Z",
    templateRepoUrl: "https://github.com/heimdall-devops/template-docker-starter",
    isActive: true,
    sessionId: "session-2",
  },
];

export default async function DashboardPage(): Promise<JSX.Element> {
  const session = await auth();
  const activeAssignments = assignments.filter((assignment) => assignment.isActive).length;
  const completedTasks = sessions.reduce((count, workshop) => count + workshop.completed, 0);
  const avgScore = 85;
  const currentStreak = 4;

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-200">
      <main className="mx-auto w-full max-w-7xl space-y-6 px-6 py-8">
        <header className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-[0_0_40px_rgba(99,102,241,0.08)]">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Mission Control</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-200">
                Welcome back, {session?.user?.name ?? "Operator"}
              </h1>
              <p className="mt-2 text-sm text-slate-400">Operational telemetry for sessions, missions, and submission velocity.</p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
              <Activity className="h-3.5 w-3.5" /> Systems nominal
            </span>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
              <p className="text-xs uppercase tracking-wider text-slate-500">Active Missions</p>
              <p className="mt-2 text-2xl font-semibold text-indigo-300">{activeAssignments}</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
              <p className="text-xs uppercase tracking-wider text-slate-500">Completed Tasks</p>
              <p className="mt-2 text-2xl font-semibold text-emerald-300">{completedTasks}</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
              <p className="text-xs uppercase tracking-wider text-slate-500">Avg Score</p>
              <p className="mt-2 text-2xl font-semibold text-blue-300">{avgScore}%</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
              <p className="text-xs uppercase tracking-wider text-slate-500">Current Streak</p>
              <p className="mt-2 inline-flex items-center gap-2 text-2xl font-semibold text-fuchsia-300">
                <Flame className="h-5 w-5" /> {currentStreak}d
              </p>
            </div>
          </div>
        </header>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-slate-200">Workshop Instrument Panels</h2>
          <div className="grid gap-4 xl:grid-cols-2">
            {sessions.map((workshop) => {
              const workshopAssignments = assignments.filter((assignment) => assignment.sessionId === workshop.id);
              const progress = Math.round((workshop.completed / Math.max(1, workshopAssignments.length)) * 100);
              const status = progress === 100 ? "ready" : progress > 0 ? "pending" : "failed";
              const statusClass =
                status === "ready"
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                  : status === "pending"
                    ? "border-amber-500/30 bg-amber-500/10 text-amber-300"
                    : "border-rose-500/30 bg-rose-500/10 text-rose-300";

              return (
                <article
                  key={workshop.id}
                  className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 shadow-[0_0_25px_rgba(15,23,42,0.7)] transition-all duration-200 hover:border-indigo-500/40 hover:shadow-[0_0_35px_rgba(99,102,241,0.18)]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-md border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-1 text-xs font-medium text-indigo-300">
                      {workshop.category}
                    </span>
                    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs ${statusClass}`}>
                      <Target className="h-3.5 w-3.5" /> {status}
                    </span>
                  </div>

                  <h3 className="mt-4 text-lg font-semibold text-slate-200">{workshop.title}</h3>
                  <p className="mt-1 text-sm text-slate-400">{workshop.description}</p>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="inline-flex items-center gap-1">
                        <ShieldCheck className="h-3.5 w-3.5" /> Completion vector
                      </span>
                      <span>{progress}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-blue-500 to-emerald-400"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-500">{workshopAssignments.length} linked assignment nodes</p>
                  </div>

                  <Link
                    href={`/assignments/${workshopAssignments[0]?.id ?? "assignment-1"}`}
                    className="mt-5 inline-flex items-center gap-2 rounded-lg border border-blue-500/40 bg-blue-500/10 px-3.5 py-2 text-sm font-semibold text-blue-300 transition-all duration-200 hover:bg-blue-500/20 hover:shadow-[0_0_20px_rgba(59,130,246,0.35)]"
                  >
                    <GitBranch className="h-4 w-4" /> ./launch_mission <ArrowRight className="h-4 w-4" />
                  </Link>
                </article>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
