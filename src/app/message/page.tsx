"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "../../../utils/supabase/client";

const supabase = createClient();

export default function MessagePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadUser = async () => {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      if (!mounted) {
        return;
      }

      setUser(currentUser);
      setLoading(false);
    };

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) {
    return (
      <main className="min-h-screen grid place-items-center px-4 bg-slate-50">
        <p className="text-slate-600">Түр хүлээнэ үү...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen grid place-items-center px-4 bg-slate-50">
        <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">Нэвтрэлт шаардлагатай</h1>
          <p className="mt-2 text-sm text-slate-600">Энэ хуудсыг үзэхийн тулд эхлээд нэвтэрнэ үү.</p>
          <button
            onClick={() => router.push("/login")}
            className="mt-4 w-full rounded-lg bg-green-600 px-4 py-3 text-white transition hover:bg-green-700"
          >
            Login руу очих
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <section className="mx-auto w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs uppercase tracking-[0.2em] text-green-700">Supabase Session</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Welcome, {user.email}</h1>
        <p className="mt-4 text-sm text-slate-600">User ID: {user.id}</p>
        <button
          onClick={handleSignOut}
          className="mt-6 rounded-lg bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
        >
          Sign out
        </button>
      </section>
    </main>
  );
}
