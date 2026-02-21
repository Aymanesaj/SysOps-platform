export type GenerateRepositoryInput = {
  templateOwner: string;
  templateRepo: string;
  newRepositoryName: string;
  newRepositoryDescription?: string;
  isPrivate?: boolean;
};

export type GeneratedRepository = {
  id: number;
  name: string;
  fullName: string;
  htmlUrl: string;
};

/**
 * Generate a new repository from a template using the GitHub REST API.
 * Requires a token with repo creation rights.
 */
export async function generateRepositoryFromTemplate(
  input: GenerateRepositoryInput,
  githubAccessToken: string,
): Promise<GeneratedRepository> {
  const endpoint = `https://api.github.com/repos/${input.templateOwner}/${input.templateRepo}/generate`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${githubAccessToken}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: input.newRepositoryName,
      description: input.newRepositoryDescription,
      private: input.isPrivate ?? true,
      include_all_branches: false,
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Failed to generate repository from template: ${message}`);
  }

  const payload = (await response.json()) as {
    id: number;
    name: string;
    full_name: string;
    html_url: string;
  };

  return {
    id: payload.id,
    name: payload.name,
    fullName: payload.full_name,
    htmlUrl: payload.html_url,
  };
}
