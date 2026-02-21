import Link from "next/link";
import type { DashboardAssignment } from "@/types/domain";

type AssignmentBadgeProps = {
  assignment: DashboardAssignment;
};

export function AssignmentBadge({ assignment }: AssignmentBadgeProps): JSX.Element {
  return (
    <Link
      href={`/assignments/${assignment.id}`}
      className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
    >
      {assignment.title} · Due {new Date(assignment.deadline).toLocaleDateString()}
    </Link>
  );
}
