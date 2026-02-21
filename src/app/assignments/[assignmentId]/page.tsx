import { AssignmentActions } from "@/components/AssignmentActions";
import { Navbar } from "@/components/Navbar";
import { auth } from "@/lib/auth";
import type { DashboardAssignment } from "@/types/domain";

type AssignmentPageProps = {
  params: {
    assignmentId: string;
  };
};

const assignmentsById: Record<string, DashboardAssignment> = {
  "assignment-1": {
    id: "assignment-1",
    title: "Pipeline Bootstrapping",
    instructions:
      "## Objective\nCreate a CI workflow that runs linting and tests on each pull request.\n\n## Deliverables\n- Enforce required status checks on main\n- Add workflow badges to README\n- Document rollback plan",
    deadline: "2026-03-05T23:59:59.000Z",
    templateRepoUrl: "https://github.com/heimdall-devops/template-ci-starter",
    isActive: true,
    sessionId: "session-1",
  },
  "assignment-2": {
    id: "assignment-2",
    title: "Dockerize the App",
    instructions:
      "## Objective\nBuild and ship a production-ready container image with a compose deployment.\n\n## Deliverables\n- Multi-stage Dockerfile\n- Compose setup with Postgres\n- Healthcheck + logs documentation",
    deadline: "2026-03-12T23:59:59.000Z",
    templateRepoUrl: "https://github.com/heimdall-devops/template-docker-starter",
    isActive: true,
    sessionId: "session-2",
  },
};

function statusLabel(isActive: boolean): "Pending" | "Submitted" | "Accepted" {
  return isActive ? "Pending" : "Submitted";
}

function renderMarkdownLikeText(instructions: string): JSX.Element[] {
  return instructions.split("\n").map((line) => {
    if (line.startsWith("## ")) {
      return (
        <h3 key={line} className="mt-5 text-base font-semibold text-slate-100 first:mt-0">
          {line.replace("## ", "")}
        </h3>
      );
    }

    if (line.startsWith("- ")) {
      return (
        <li key={line} className="ml-5 list-disc text-sm text-slate-300">
          {line.replace("- ", "")}
        </li>
      );
    }

    return (
      <p key={line} className="text-sm leading-7 text-slate-300">
        {line}
      </p>
    );
  });
}

export default async function AssignmentPage({ params }: AssignmentPageProps): Promise<JSX.Element> {
  const assignment = assignmentsById[params.assignmentId];
  const session = await auth();

  if (!assignment) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <Navbar user={session?.user} />
        <main className="mx-auto w-full max-w-4xl px-4 py-8">
          <h1 className="text-2xl font-bold">Assignment not found</h1>
          <p className="mt-2 text-sm text-slate-400">Please select an assignment from the dashboard.</p>
        </main>
      </div>
    );
  }

  const currentStatus = statusLabel(assignment.isActive);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <Navbar user={session?.user} />
      <main className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[300px_1fr]">
        <aside className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 lg:sticky lg:top-24 lg:h-fit">
          <h2 className="text-sm uppercase tracking-wide text-slate-400">Mission Briefing</h2>

          <div className="mt-5 space-y-4">
            <div>
              <p className="text-xs text-slate-400">Deadline</p>
              <p className="mt-1 text-sm font-medium text-slate-100">{new Date(assignment.deadline).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Status</p>
              <span className="mt-1 inline-block rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-200">
                {currentStatus}
              </span>
            </div>
            <div>
              <p className="text-xs text-slate-400">Template</p>
              <a
                href={assignment.templateRepoUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-1 inline-block text-sm text-indigo-300 underline decoration-indigo-400/50 underline-offset-2"
              >
                Open Template Repository
              </a>
            </div>
          </div>
        </aside>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl shadow-slate-950/30">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-50">{assignment.title}</h1>
          <div className="mt-5 space-y-2">{renderMarkdownLikeText(assignment.instructions)}</div>

          <div className="mt-8 border-t border-slate-800 pt-6">
            <AssignmentActions assignmentId={assignment.id} templateRepoUrl={assignment.templateRepoUrl} />
          </div>
        </section>
      </main>
    </div>
  );
}
