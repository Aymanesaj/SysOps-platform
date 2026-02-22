"use client";

import { use, useEffect, useMemo, useState } from "react";
import { CheckCircle2, Clock3, Copy, ExternalLink } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { AssignmentActions } from "@/components/AssignmentActions";
import type { DashboardAssignment } from "@/types/domain";

type AssignmentPageProps = {
  params: Promise<{
    assignmentId: string;
  }>;
};

type MissionStatus = "Pending" | "Reviewing" | "Accepted";

const assignmentsById: Record<string, DashboardAssignment & { status: MissionStatus }> = {
  "assignment-1": {
    id: "assignment-1",
    title: "Pipeline Bootstrapping",
    status: "Pending",
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
    status: "Reviewing",
    instructions:
      "## Objective\nBuild and ship a production-ready container image with a compose deployment.\n\n## Deliverables\n- Multi-stage Dockerfile\n- Compose setup with Postgres\n- Healthcheck + logs documentation",
    deadline: "2026-03-12T23:59:59.000Z",
    templateRepoUrl: "https://github.com/heimdall-devops/template-docker-starter",
    isActive: true,
    sessionId: "session-2",
  },
};

function renderMarkdownLikeText(instructions: string): JSX.Element[] {
  return instructions.split("\n").map((line, index) => {
    const key = `${line}-${index}`;
    if (line.startsWith("## ")) {
      return (
        <h3 key={key} className="mt-5 text-base font-semibold text-slate-900 first:mt-0">
          {line.replace("## ", "")}
        </h3>
      );
    }
    if (line.startsWith("- ")) {
      return (
        <li key={key} className="ml-5 list-disc text-sm text-slate-700">
          {line.replace("- ", "")}
        </li>
      );
    }
    if (!line.trim()) {
      return <div key={key} className="h-2" />;
    }
    return (
      <p key={key} className="text-sm leading-7 text-slate-700">
        {line}
      </p>
    );
  });
}

export default function AssignmentPage({ params }: AssignmentPageProps): JSX.Element {
  const { assignmentId } = use(params);

  const [now, setNow] = useState<number>(Date.now());
  const [copied, setCopied] = useState<boolean>(false);

  const assignment = assignmentsById[assignmentId];

  useEffect(() => {
    const intervalId = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(intervalId);
  }, []);

  const remainingTime = assignment ? Math.max(0, new Date(assignment.deadline).getTime() - now) : 0;

  const countdown = useMemo(() => {
    const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remainingTime / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((remainingTime / (1000 * 60)) % 60);
    return `${days}d ${hours}h ${minutes}m`;
  }, [remainingTime]);

  if (!assignment) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <Navbar />
        <main className="mx-auto w-full max-w-6xl px-6 py-8">
          <h1 className="text-2xl font-bold">Assignment not found</h1>
          <p className="mt-2 text-sm text-slate-500">Please select an assignment from the dashboard.</p>
        </main>
      </div>
    );
  }

  const statusStyles: Record<MissionStatus, string> = {
    Pending: "border-amber-200 bg-amber-50 text-amber-700",
    Reviewing: "border-indigo-200 bg-indigo-50 text-indigo-700",
    Accepted: "border-emerald-200 bg-emerald-50 text-emerald-700",
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <main className="mx-auto grid w-full max-w-6xl gap-6 px-6 py-8 lg:grid-cols-[7fr_3fr]">
        <section className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">{assignment.title}</h1>
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
            <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-2">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <span className="ml-2 text-xs text-slate-400">mission-brief.md</span>
            </div>
            <div className="space-y-2 p-5">{renderMarkdownLikeText(assignment.instructions)}</div>
          </div>
          <div className="border-t border-slate-200 pt-6">
            <AssignmentActions assignmentId={assignment.id} templateRepoUrl={assignment.templateRepoUrl} />
          </div>
        </section>

        <aside className="space-y-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-24 lg:h-fit">
          <h2 className="text-sm uppercase tracking-wide text-slate-500">Mission Brief</h2>
          <div className="space-y-5">
            <div>
              <p className="text-xs text-slate-500">Countdown</p>
              <p className="mt-1 inline-flex items-center gap-2 text-lg font-semibold text-indigo-700">
                <Clock3 className="h-4 w-4" /> {countdown}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Template Repository</p>
              <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="break-all text-xs text-slate-600">{assignment.templateRepoUrl}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <a href={assignment.templateRepoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700">
                    <ExternalLink className="h-3.5 w-3.5" /> Open
                  </a>
                  <button
                    type="button"
                    onClick={async () => {
                      await navigator.clipboard.writeText(assignment.templateRepoUrl);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 1200);
                    }}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                  >
                    <Copy className="h-3.5 w-3.5" /> {copied ? "Copied" : "Copy URL"}
                  </button>
                </div>
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-500">Submission Status</p>
              <span className={`mt-2 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles[assignment.status]}`}>
                <CheckCircle2 className="h-3.5 w-3.5" /> {assignment.status}
              </span>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}