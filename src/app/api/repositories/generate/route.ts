import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateRepositoryFromTemplate } from "@/lib/github";

type GenerateRepositoryBody = {
  templateOwner?: string;
  templateRepo?: string;
  newRepositoryName?: string;
  newRepositoryDescription?: string;
  isPrivate?: boolean;
};

export async function POST(request: NextRequest): Promise<NextResponse> {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const githubToken = process.env.GITHUB_TEMPLATE_TOKEN;

  if (!githubToken) {
    return NextResponse.json({ error: "Missing GITHUB_TEMPLATE_TOKEN environment variable." }, { status: 500 });
  }

  const body = (await request.json()) as GenerateRepositoryBody;

  if (!body.templateOwner || !body.templateRepo || !body.newRepositoryName) {
    return NextResponse.json(
      { error: "templateOwner, templateRepo, and newRepositoryName are required." },
      { status: 400 },
    );
  }

  try {
    const repository = await generateRepositoryFromTemplate(
      {
        templateOwner: body.templateOwner,
        templateRepo: body.templateRepo,
        newRepositoryName: body.newRepositoryName,
        newRepositoryDescription: body.newRepositoryDescription,
        isPrivate: body.isPrivate,
      },
      githubToken,
    );

    return NextResponse.json({ repository }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to generate repository.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
