import Link from "next/link";

export default function HomePage(): JSX.Element {
  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <h1 className="text-2xl font-bold text-slate-900">Heimdall SysOps Platform</h1>
      <p className="mt-2 text-slate-600">Use the dashboard to view sessions and assignments.</p>
      <Link className="mt-4 inline-block text-blue-600 underline" href="/dashboard">
        Go to Dashboard
      </Link>
    </main>
  );
}
