import { Navbar } from "@/components/Navbar";
import { auth } from "@/lib/auth";
import type { DashboardAssignment, DashboardSession } from "@/types/domain";
import Link from "next/link";

const sessions: DashboardSession[] = [
  {
    id: "session-1",
    title: "CI/CD Foundations",
    description: "Set up and harden your first production-grade GitHub Actions pipeline.",
    startsAt: "2026-03-01T18:00:00.000Z",
    endsAt: "2026-03-01T20:00:00.000Z",
  },
  {
    id: "session-2",
    title: "Containers in Practice",
    description: "Package and deploy a Next.js service with repeatable Docker workflows.",
    startsAt: "2026-03-08T18:00:00.000Z",
    endsAt: "2026-03-08T20:00:00.000Z",
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
  const activeAssignments = assignments.filter((assignment) => assignment.isActive);
  const completedSubmissions = 1;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <Navbar user={session?.user} />

      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
        <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 shadow-2xl shadow-indigo-900/20">
          <h1 className="text-2xl font-semibold tracking-tight">Operations Dashboard</h1>
          <p className="mt-2 text-sm text-slate-400">
            {session?.user
              ? `Welcome, ${session.user.name ?? session.user.email ?? "Operator"}.`
              : "Sign in with GitHub to access assignment workflows and submissions."}
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">Active Assignments</p>
              <p className="mt-2 text-3xl font-semibold text-indigo-300">{activeAssignments.length}</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">Completed Submissions</p>
              <p className="mt-2 text-3xl font-semibold text-emerald-300">{completedSubmissions}</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 sm:col-span-2 lg:col-span-1">
              <p className="text-xs uppercase tracking-wide text-slate-400">Workshops Running</p>
              <p className="mt-2 text-3xl font-semibold text-slate-200">{sessions.length}</p>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="mb-4 text-lg font-semibold text-slate-100">Workshop Overview</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {sessions.map((workshop) => {
              const workshopAssignments = assignments.filter((assignment) => assignment.sessionId === workshop.id);
              const progress = Math.min(100, Math.round((completedSubmissions / Math.max(1, workshopAssignments.length)) * 100));

              return (
                <article
                  key={workshop.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg shadow-slate-950/30"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-100">{workshop.title}</h3>
                      <p className="mt-1 text-sm text-slate-400">{workshop.description}</p>
                    </div>
                    <span className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs text-indigo-200">
                      {workshopAssignments.length} assignments
                    </span>
                  </div>

                  <div className="mt-5">
                    <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
                      <span>Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-800">
                      <div className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-8">
          <h2 className="mb-4 text-lg font-semibold text-slate-100">Active Missions</h2>
          <div className="flex flex-wrap gap-3">
            {activeAssignments.map((assignment) => (
              <Link
                key={assignment.id}
                href={`/assignments/${assignment.id}`}
                className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-200 transition hover:bg-emerald-500/20"
              >
                {assignment.title}
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
