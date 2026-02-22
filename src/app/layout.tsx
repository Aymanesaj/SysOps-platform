import type { ReactNode } from "react";
import { Sidebar } from "@/components/Sidebar";
import { auth } from "@/lib/auth";
import "./globals.css";

export default async function RootLayout({ children }: { children: ReactNode }): Promise<JSX.Element> {
  const session = await auth();

  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-200 antialiased">
        <Sidebar user={session?.user} />
        <div className="min-h-screen lg:pl-72">{children}</div>
      </body>
    </html>
  );
}
