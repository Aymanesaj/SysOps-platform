import Link from "next/link";
import { ArrowRight, Flame, GitBranch, ShieldCheck } from "lucide-react";
import { Navbar } from "@/components/Navbar";
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
  const currentStreak = 4;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar user={session?.user} />

      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
        <header className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl shadow-slate-950/40">
          <h1 className="text-2xl font-semibold tracking-tight">Member Command Center</h1>
          <p className="mt-2 text-sm text-slate-400">
            Monitor workshop progression, launch missions, and keep your engineering streak alive.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-xs uppercase tracking-wider text-slate-500">Active Assignments</p>
              <p className="mt-2 text-3xl font-semibold text-indigo-300">{activeAssignments}</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-xs uppercase tracking-wider text-slate-500">Completed Tasks</p>
              <p className="mt-2 text-3xl font-semibold text-emerald-300">{completedTasks}</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-xs uppercase tracking-wider text-slate-500">Current Streak</p>
              <p className="mt-2 inline-flex items-center gap-2 text-3xl font-semibold text-amber-300">
                <Flame className="h-6 w-6" /> {currentStreak} days
              </p>
            </div>
          </div>
        </header>

        <section className="mt-8">
          <h2 className="mb-4 text-lg font-semibold">Workshop Grid</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {sessions.map((workshop) => {
              const workshopAssignments = assignments.filter((assignment) => assignment.sessionId === workshop.id);
              const progress = Math.round((workshop.completed / Math.max(1, workshopAssignments.length)) * 100);

              return (
                <article key={workshop.id} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full border border-indigo-500/40 bg-indigo-500/10 px-3 py-1 text-xs text-indigo-200">
                      {workshop.category}
                    </span>
                    <span className="text-xs text-slate-400">{workshopAssignments.length} assignments</span>
                  </div>

                  <h3 className="mt-4 text-lg font-semibold">{workshop.title}</h3>
                  <p className="mt-1 text-sm text-slate-400">{workshop.description}</p>

                  <div className="mt-4">
                    <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
                      <span className="inline-flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5" /> Completion</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-800">
                      <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500" style={{ width: `${progress}%` }} />
                    </div>
                  </div>

                  <Link
                    href={`/assignments/${workshopAssignments[0]?.id ?? "assignment-1"}`}
                    className="mt-5 inline-flex items-center gap-2 rounded-lg border border-indigo-500/40 bg-indigo-500/10 px-3.5 py-2 text-sm font-semibold text-indigo-200 transition hover:shadow-[0_0_20px_rgba(99,102,241,0.35)]"
                  >
                    <GitBranch className="h-4 w-4" /> Launch <ArrowRight className="h-4 w-4" />
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
