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
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar user={session?.user} />

      <main className="mx-auto w-full max-w-6xl space-y-8 px-6 py-8">
        <header className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Member Command Center</h1>
            <p className="text-sm text-slate-500">
            Monitor workshop progression, launch missions, and keep your engineering streak alive.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs uppercase tracking-wider text-slate-500">Active Assignments</p>
              <p className="mt-2 text-3xl font-semibold text-indigo-600">{activeAssignments}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs uppercase tracking-wider text-slate-500">Completed Tasks</p>
              <p className="mt-2 text-3xl font-semibold text-emerald-600">{completedTasks}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs uppercase tracking-wider text-slate-500">Current Streak</p>
              <p className="mt-2 inline-flex items-center gap-2 text-3xl font-semibold text-amber-600">
                <Flame className="h-6 w-6" /> {currentStreak} days
              </p>
            </div>
          </div>
        </header>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Workshop Grid</h2>
          <div className="grid gap-5 md:grid-cols-2">
            {sessions.map((workshop) => {
              const workshopAssignments = assignments.filter((assignment) => assignment.sessionId === workshop.id);
              const progress = Math.round((workshop.completed / Math.max(1, workshopAssignments.length)) * 100);

              return (
                <article
                  key={workshop.id}
                  className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                      {workshop.category}
                    </span>
                    <span className="text-xs text-slate-500">{workshopAssignments.length} assignments</span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-xl font-semibold text-slate-900">{workshop.title}</h3>
                    <p className="text-sm text-slate-500">{workshop.description}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <ShieldCheck className="h-3.5 w-3.5" /> Completion
                      </span>
                      <span>{progress}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-200">
                      <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500" style={{ width: `${progress}%` }} />
                    </div>
                  </div>

                  <Link
                    href={`/assignments/${workshopAssignments[0]?.id ?? "assignment-1"}`}
                    className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
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
