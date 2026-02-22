"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Github, Loader2, PlugZap, Terminal } from "lucide-react";

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

function wait(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

const primaryButtonClass =
  "inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-blue-500 hover:shadow-[0_0_22px_rgba(37,99,235,0.45)] disabled:cursor-not-allowed disabled:opacity-60";

const secondaryButtonClass =
  "inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-zinc-200 transition-all duration-200 hover:border-zinc-500 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60";

export function AssignmentActions({ assignmentId, templateRepoUrl }: AssignmentActionsProps): JSX.Element {
  const templateRepository = useMemo(() => parseTemplateRepo(templateRepoUrl), [templateRepoUrl]);
  const [repositoryUrl, setRepositoryUrl] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isLinking, setIsLinking] = useState<boolean>(false);
  const [terminalLogs, setTerminalLogs] = useState<TerminalLog[]>([
    { level: "info", message: "> Awaiting command..." },
  ]);

  const addLog = (level: TerminalLog["level"], message: string): void => {
    setTerminalLogs((currentLogs) => [...currentLogs.slice(-7), { level, message }]);
  };

  const handleGenerateRepository = async (): Promise<void> => {
    if (!templateRepository) {
      addLog("error", "> Invalid template repository URL.");
      return;
    }

    setIsGenerating(true);
    addLog("info", "> Contacting GitHub API...");
    await wait(200);
    addLog("info", "> Cloning Template...");

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
        addLog("error", `> Error: ${data.error ?? "Failed to generate repository."}`);
        return;
      }

      setRepositoryUrl(data.repository.htmlUrl);
      addLog("success", `> Success: Repository Ready (${data.repository.htmlUrl})`);
    } catch {
      addLog("error", "> Network error during generation.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleLinkRepository = async (): Promise<void> => {
    if (!repositoryUrl.trim()) {
      addLog("error", "> Provide a repository URL first.");
      return;
    }

    setIsLinking(true);
    addLog("info", "> Submitting mission artifact...");

    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignmentId, repositoryUrl }),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        addLog("error", `> Error: ${data.error ?? "Failed to link repository."}`);
        return;
      }

      addLog("success", "> Submission linked successfully.");
    } catch {
      addLog("error", "> Network error while linking repository.");
    } finally {
      setIsLinking(false);
    }
  };

  return (
    <section className="space-y-4">
      <label className="block text-sm font-medium text-zinc-300" htmlFor="repository-url">
        Submission Repository URL
      </label>
      <input
        id="repository-url"
        type="url"
        value={repositoryUrl}
        onChange={(event) => setRepositoryUrl(event.target.value)}
        placeholder="https://github.com/your-org/your-repo"
        className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none ring-blue-500 transition-all duration-200 placeholder:text-zinc-500 focus:ring"
      />

      <div className="flex flex-wrap items-center gap-3">
        <motion.button
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={handleGenerateRepository}
          disabled={isGenerating || isLinking}
          className={primaryButtonClass}
        >
          {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Github className="h-4 w-4" />}
          {isGenerating ? "Generating..." : "Generate Repo"}
        </motion.button>

        <button
          type="button"
          onClick={handleLinkRepository}
          disabled={isGenerating || isLinking}
          className={secondaryButtonClass}
        >
          {isLinking ? <Loader2 className="h-4 w-4 animate-spin" /> : <PlugZap className="h-4 w-4" />}
          {isLinking ? "Linking..." : "Link Repo"}
        </button>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 shadow-[0_0_24px_rgba(168,85,247,0.08)]">
        <div className="mb-2 inline-flex items-center gap-2 text-xs uppercase tracking-wide text-zinc-500">
          <Terminal className="h-4 w-4" />
          Mini Terminal Output
        </div>
        <div className="space-y-1 font-mono text-xs">
          <AnimatePresence initial={false}>
            {terminalLogs.map((log, index) => (
              <motion.p
                key={`${log.message}-${index}`}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className={
                  log.level === "error"
                    ? "text-rose-400"
                    : log.level === "success"
                      ? "text-emerald-400"
                      : "text-zinc-300"
                }
              >
                {log.message}
              </motion.p>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
