import type { DashboardSession } from "@/types/domain";

type SessionCardProps = {
  session: DashboardSession;
};

export function SessionCard({ session }: SessionCardProps): JSX.Element {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-base font-semibold text-slate-900">{session.title}</h3>
      <p className="mt-2 text-sm text-slate-600">{session.description}</p>
      <p className="mt-3 text-xs text-slate-500">
        {new Date(session.startsAt).toLocaleString()} → {new Date(session.endsAt).toLocaleString()}
      </p>
    </article>
  );
}
