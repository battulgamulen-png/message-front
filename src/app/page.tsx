

import Link from "next/link";

const authLinks = [
  { href: "/login", label: "Login", detail: "Sign in with your account" },
  { href: "/signup", label: "Signup", detail: "Create a new account" },
 
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-cyan-100 p-6 text-slate-900 md:p-10">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-5xl items-center justify-center">
        <section className="w-full rounded-3xl border border-slate-200/80 bg-white/75 p-8 shadow-xl backdrop-blur md:p-12">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700">
           Real time messages
          </p>
          <h1 className="text-3xl font-bold leading-tight md:text-5xl">
            Welcome
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-600 md:text-base">
            Create your own memory
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {authLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-2">
                  <h2 className="text-base font-semibold text-slate-900">
                    {item.label}
                  </h2>
                  <span className="text-cyan-600 transition group-hover:translate-x-0.5">
                    →
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-600">{item.detail}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
