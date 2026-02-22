"use client";

import { use, useEffect, useMemo, useState } from "react";
import { CheckCircle2, Clock3, Copy, ExternalLink } from "lucide-react";
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
        <h3 key={key} className="mt-5 font-mono text-base font-semibold text-slate-200 first:mt-0">
          {line.replace("## ", "")}
        </h3>
      );
    }
    if (line.startsWith("- ")) {
      return (
        <li key={key} className="ml-5 list-disc font-mono text-sm text-slate-300">
          {line.replace("- ", "")}
        </li>
      );
    }
    if (!line.trim()) {
      return <div key={key} className="h-2" />;
    }
    return (
      <p key={key} className="font-mono text-sm leading-7 text-slate-300">
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
      <div className="min-h-screen bg-[#0B1120] text-slate-200">
        <main className="mx-auto w-full max-w-6xl px-6 py-8">
          <h1 className="text-2xl font-bold text-slate-200">Assignment not found</h1>
          <p className="mt-2 text-sm text-slate-400">Please select an assignment from the dashboard.</p>
        </main>
      </div>
    );
  }

  const statusStyles: Record<MissionStatus, string> = {
    Pending: "border-amber-500/40 bg-amber-500/10 text-amber-300 shadow-[0_0_16px_rgba(245,158,11,0.18)]",
    Reviewing: "border-blue-500/40 bg-blue-500/10 text-blue-300 shadow-[0_0_16px_rgba(59,130,246,0.18)]",
    Accepted: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300 shadow-[0_0_16px_rgba(16,185,129,0.2)]",
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-200">
      <main className="mx-auto w-full max-w-7xl space-y-6 px-6 py-8">
        <header className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-[0_0_40px_rgba(99,102,241,0.1)]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Mission Control</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-200">{assignment.title}</h1>
            </div>
            <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles[assignment.status]}`}>
              <CheckCircle2 className="h-3.5 w-3.5" /> {assignment.status}
            </span>
          </div>

          <div className="mt-5 inline-flex items-center gap-3 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-4 py-3 text-indigo-200 shadow-[inset_0_0_25px_rgba(99,102,241,0.16)]">
            <Clock3 className="h-5 w-5" />
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-indigo-300/80">Time Remaining</p>
              <p className="font-mono text-2xl font-semibold">{countdown}</p>
            </div>
          </div>
        </header>

        <section className="grid gap-6 xl:grid-cols-[7fr_3fr]">
          <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 shadow-[0_0_30px_rgba(15,23,42,0.8)]">
            <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#090f1d]">
              <div className="flex items-center gap-2 border-b border-slate-800 px-4 py-2">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <span className="ml-2 font-mono text-xs text-slate-500">mission-brief.md</span>
              </div>
              <div className="space-y-2 p-5">{renderMarkdownLikeText(assignment.instructions)}</div>
            </div>
          </article>

          <aside className="space-y-5 rounded-xl border border-slate-800 bg-slate-900/60 p-5 shadow-[0_0_30px_rgba(99,102,241,0.08)] xl:sticky xl:top-8 xl:h-fit">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Template Repository</p>
              <div className="mt-2 rounded-xl border border-slate-800 bg-[#090f1d] p-4">
                <p className="break-all text-xs text-slate-300">{assignment.templateRepoUrl}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <a
                    href={assignment.templateRepoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-blue-500/40 bg-blue-500/10 px-3 py-2 text-xs font-semibold text-blue-300 transition-all duration-200 hover:bg-blue-500/20"
                  >
                    <ExternalLink className="h-3.5 w-3.5" /> Open
                  </a>
                  <button
                    type="button"
                    onClick={async () => {
                      await navigator.clipboard.writeText(assignment.templateRepoUrl);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 1200);
                    }}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-200 transition-all duration-200 hover:border-slate-600 hover:bg-slate-800"
                  >
                    <Copy className="h-3.5 w-3.5" /> {copied ? "Copied" : "Copy URL"}
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-[#090f1d] p-4">
              <p className="mb-3 text-xs uppercase tracking-wide text-slate-500">Critical System Controls</p>
              <AssignmentActions assignmentId={assignment.id} templateRepoUrl={assignment.templateRepoUrl} />
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
