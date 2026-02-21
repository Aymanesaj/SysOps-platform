import { AssignmentBadge } from "@/components/AssignmentBadge";
import { Navbar } from "@/components/Navbar";
import { SessionCard } from "@/components/SessionCard";
import { auth } from "@/lib/auth";
import type { DashboardAssignment, DashboardSession } from "@/types/domain";

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

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto w-full max-w-6xl px-4 py-8">
        <section className="mb-8 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">Main Dashboard</h1>
          <p className="mt-2 text-sm text-slate-600">
            {session?.user
              ? `Welcome back, ${session.user.name ?? session.user.email ?? "Operator"}.`
              : "Sign in with GitHub to access assignment workflows and submissions."}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-lg font-semibold text-slate-900">Available Sessions</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {sessions.map((clubSession) => (
              <SessionCard key={clubSession.id} session={clubSession} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-slate-900">Active Assignments</h2>
          <div className="flex flex-wrap gap-2">
            {assignments.filter((assignment) => assignment.isActive).map((assignment) => (
              <AssignmentBadge key={assignment.id} assignment={assignment} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
