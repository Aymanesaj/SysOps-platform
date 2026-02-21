"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Github, Loader2, PlugZap, Terminal } from "lucide-react";

type AssignmentActionsProps = {
  assignmentId: string;
  templateRepoUrl: string;
};

type TerminalLog = {
  level: "info" | "success" | "error";
  message: string;
};

function parseTemplateRepo(url: string): { owner: string; repo: string } | null {
  const match = url.match(/^https:\/\/github\.com\/([^/]+)\/([^/]+)\/?$/);

  if (!match) {
    return null;
  }

  return {
    owner: match[1],
    repo: match[2],
  };
}

export function AssignmentActions({ assignmentId, templateRepoUrl }: AssignmentActionsProps): JSX.Element {
  const templateRepository = useMemo(() => parseTemplateRepo(templateRepoUrl), [templateRepoUrl]);
  const [repositoryUrl, setRepositoryUrl] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isLinking, setIsLinking] = useState<boolean>(false);
  const [terminalLogs, setTerminalLogs] = useState<TerminalLog[]>([
    { level: "info", message: "$ awaiting assignment command..." },
  ]);

  const addLog = (level: TerminalLog["level"], message: string): void => {
    setTerminalLogs((currentLogs) => [...currentLogs.slice(-5), { level, message }]);
  };

  const handleGenerateRepository = async (): Promise<void> => {
    if (!templateRepository) {
      addLog("error", "template repo URL is invalid.");
      return;
    }

    setIsGenerating(true);
    addLog("info", "$ generating repository from template...");

    try {
      const payload = {
        templateOwner: templateRepository.owner,
        templateRepo: templateRepository.repo,
        newRepositoryName: `heimdall-${assignmentId}-${Date.now()}`,
      };

      const response = await fetch("/api/repositories/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as { repository?: { htmlUrl: string }; error?: string };

      if (!response.ok || !data.repository) {
        addLog("error", data.error ?? "failed to generate repository.");
        return;
      }

      setRepositoryUrl(data.repository.htmlUrl);
      addLog("success", `repository ready: ${data.repository.htmlUrl}`);
    } catch {
      addLog("error", "network error while generating repository.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleLinkRepository = async (): Promise<void> => {
    if (!repositoryUrl.trim()) {
      addLog("error", "provide a repository URL first.");
      return;
    }

    setIsLinking(true);
    addLog("info", "$ linking repository to assignment...");

    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignmentId, repositoryUrl }),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        addLog("error", data.error ?? "failed to link repository.");
        return;
      }

      addLog("success", "submission stored successfully.");
    } catch {
      addLog("error", "network error while linking repository.");
    } finally {
      setIsLinking(false);
    }
  };

  return (
    <section className="space-y-4">
      <label className="block text-sm font-medium text-slate-300" htmlFor="repository-url">
        Submission Repository URL
      </label>
      <input
        id="repository-url"
        type="url"
        value={repositoryUrl}
        onChange={(event) => setRepositoryUrl(event.target.value)}
        placeholder="https://github.com/your-org/your-repo"
        className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none ring-indigo-500 transition placeholder:text-slate-500 focus:ring"
      />

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleGenerateRepository}
          disabled={isGenerating || isLinking}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Github className="h-4 w-4" />}
          {isGenerating ? "Generating..." : "Generate Repo"}
        </button>
        <button
          type="button"
          onClick={handleLinkRepository}
          disabled={isGenerating || isLinking}
          className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-2.5 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLinking ? <Loader2 className="h-4 w-4 animate-spin" /> : <PlugZap className="h-4 w-4" />}
          {isLinking ? "Linking..." : "Link Repo"}
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-slate-700 bg-[#0b1220] p-4"
      >
        <div className="mb-3 inline-flex items-center gap-2 text-xs uppercase tracking-wide text-slate-400">
          <Terminal className="h-4 w-4" />
          Mission Terminal Output
        </div>

        <div className="space-y-1 font-mono text-xs text-slate-300">
          <AnimatePresence initial={false}>
            {terminalLogs.map((log, index) => (
              <motion.p
                key={`${log.message}-${index}`}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                className={
                  log.level === "error"
                    ? "text-red-300"
                    : log.level === "success"
                      ? "text-emerald-300"
                      : "text-slate-300"
                }
              >
                {log.level === "success" ? <CheckCircle2 className="mr-1 inline h-3.5 w-3.5" /> : null}
                {log.message}
              </motion.p>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
}
