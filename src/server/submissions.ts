import { prisma } from "@/lib/prisma";

const GITHUB_REPOSITORY_URL_REGEX =
  /^https:\/\/github\.com\/(?<owner>[A-Za-z0-9_.-]+)\/(?<repo>[A-Za-z0-9_.-]+)(?:\.git)?\/?$/;

export type ParsedGitHubRepository = {
  owner: string;
  repo: string;
};

export function parseGitHubRepositoryUrl(url: string): ParsedGitHubRepository | null {
  const trimmedUrl = url.trim();
  const match = trimmedUrl.match(GITHUB_REPOSITORY_URL_REGEX);

  if (!match?.groups?.owner || !match.groups.repo) {
    return null;
  }

  return {
    owner: match.groups.owner,
    repo: match.groups.repo,
  };
}

export async function saveSubmission(params: {
  assignmentId: string;
  repositoryUrl: string;
  githubId: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}) {
  const parsedRepository = parseGitHubRepositoryUrl(params.repositoryUrl);

  if (!parsedRepository) {
    throw new Error("Please provide a valid GitHub repository URL.");
  }

  const user = await prisma.user.upsert({
    where: { githubId: params.githubId },
    update: {
      name: params.name ?? undefined,
      email: params.email ?? undefined,
      image: params.image ?? undefined,
    },
    create: {
      githubId: params.githubId,
      name: params.name,
      email: params.email,
      image: params.image,
    },
  });

  return prisma.submission.upsert({
    where: {
      assignmentId_userId: {
        assignmentId: params.assignmentId,
        userId: user.id,
      },
    },
    update: {
      repositoryUrl: params.repositoryUrl,
      submittedAt: new Date(),
    },
    create: {
      assignmentId: params.assignmentId,
      repositoryUrl: params.repositoryUrl,
      userId: user.id,
    },
  });
}
