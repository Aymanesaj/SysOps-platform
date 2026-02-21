"use client";

import { useMemo, useState } from "react";

type AssignmentActionsProps = {
  assignmentId: string;
  templateRepoUrl: string;
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
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleGenerateRepository = async (): Promise<void> => {
    if (!templateRepository) {
      setStatusMessage("Template repository URL is invalid.");
      return;
    }

    setIsSubmitting(true);
    setStatusMessage("Generating repository...");

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
        setStatusMessage(data.error ?? "Failed to generate repository.");
        return;
      }

      setRepositoryUrl(data.repository.htmlUrl);
      setStatusMessage(`Repository generated: ${data.repository.htmlUrl}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLinkRepository = async (): Promise<void> => {
    if (!repositoryUrl.trim()) {
      setStatusMessage("Please paste a GitHub repository URL first.");
      return;
    }

    setIsSubmitting(true);
    setStatusMessage("Saving submission...");

    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignmentId, repositoryUrl }),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setStatusMessage(data.error ?? "Failed to link repository.");
        return;
      }

      setStatusMessage("Repository linked successfully.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mt-6 space-y-3">
      <label className="block text-sm font-medium text-slate-700" htmlFor="repository-url">
        Submission Repository URL
      </label>
      <input
        id="repository-url"
        type="url"
        value={repositoryUrl}
        onChange={(event) => setRepositoryUrl(event.target.value)}
        placeholder="https://github.com/your-org/your-repo"
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
      />

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleGenerateRepository}
          disabled={isSubmitting}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:opacity-60"
        >
          Generate Repo
        </button>
        <button
          type="button"
          onClick={handleLinkRepository}
          disabled={isSubmitting}
          className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-100 disabled:opacity-60"
        >
          Link Repo
        </button>
      </div>

      {statusMessage ? <p className="text-sm text-slate-600">{statusMessage}</p> : null}
    </section>
  );
}
