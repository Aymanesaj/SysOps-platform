import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { saveSubmission } from "@/server/submissions";

type SubmissionRequestBody = {
  assignmentId?: string;
  repositoryUrl?: string;
};

export async function POST(request: NextRequest): Promise<NextResponse> {
  const session = await auth();

  if (!session?.user?.githubId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as SubmissionRequestBody;

  if (!body.assignmentId || !body.repositoryUrl) {
    return NextResponse.json({ error: "assignmentId and repositoryUrl are required." }, { status: 400 });
  }

  try {
    const submission = await saveSubmission({
      assignmentId: body.assignmentId,
      repositoryUrl: body.repositoryUrl,
      githubId: session.user.githubId,
      name: session.user.name,
      email: session.user.email,
      image: session.user.image,
    });

    return NextResponse.json({ submission }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to save submission.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
