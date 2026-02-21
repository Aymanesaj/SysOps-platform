import { AssignmentActions } from "@/components/AssignmentActions";
import { Navbar } from "@/components/Navbar";
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
      "Initialize CI checks that run lint + tests on pull requests. Ensure status checks gate merges to main.",
    deadline: "2026-03-05T23:59:59.000Z",
    templateRepoUrl: "https://github.com/heimdall-devops/template-ci-starter",
    isActive: true,
    sessionId: "session-1",
  },
  "assignment-2": {
    id: "assignment-2",
    title: "Dockerize the App",
    instructions:
      "Create a multistage Dockerfile and launch the app with PostgreSQL using docker compose.",
    deadline: "2026-03-12T23:59:59.000Z",
    templateRepoUrl: "https://github.com/heimdall-devops/template-docker-starter",
    isActive: true,
    sessionId: "session-2",
  },
};

export default function AssignmentPage({ params }: AssignmentPageProps): JSX.Element {
  const assignment = assignmentsById[params.assignmentId];

  if (!assignment) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <main className="mx-auto w-full max-w-4xl px-4 py-8">
          <h1 className="text-2xl font-bold text-slate-900">Assignment not found</h1>
          <p className="mt-2 text-sm text-slate-600">Please select an assignment from the dashboard.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto w-full max-w-4xl px-4 py-8">
        <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">{assignment.title}</h1>
          <p className="mt-3 text-sm text-slate-700">{assignment.instructions}</p>

          <div className="mt-5 space-y-2 text-sm text-slate-600">
            <p>
              <span className="font-semibold text-slate-900">Deadline:</span>{" "}
              {new Date(assignment.deadline).toLocaleString()}
            </p>
            <p>
              <span className="font-semibold text-slate-900">Template Repository:</span>{" "}
              <a
                href={assignment.templateRepoUrl}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline underline-offset-2"
              >
                {assignment.templateRepoUrl}
              </a>
            </p>
          </div>

          <AssignmentActions assignmentId={assignment.id} templateRepoUrl={assignment.templateRepoUrl} />
        </article>
      </main>
    </div>
  );
}
