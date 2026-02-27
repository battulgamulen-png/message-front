"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../_components/sidebar";
import Settings from "../_components/settings";
import { apiFetch, clearAuthToken } from "../../../lib/api";

type AuthUser = {
  id: string;
  email: string;
  fullName: string | null;
  profileImage: string | null;
  createdAt: string;
};

export default function MessageSettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadUser = async () => {
      try {
        const data = await apiFetch<{ user: AuthUser }>("/auth/me");
        if (!mounted) {
          return;
        }
        setUser(data.user);
      } catch {
        clearAuthToken();
        if (mounted) {
          setUser(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadUser();
    return () => {
      mounted = false;
    };
  }, []);

  const handleSignOut = () => {
    clearAuthToken();
    router.push("/login");
  };

  const handleSaveProfile = async (payload: {
    fullName: string;
    profileImage: string | null;
  }) => {
    const data = await apiFetch<{ user: AuthUser }>("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    setUser(data.user);
  };

  if (loading) {
    return (
      <main className="h-screen w-full grid place-items-center px-4 bg-slate-50">
        <p className="text-slate-600">Түр хүлээнэ үү...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="h-screen w-full grid place-items-center px-4 bg-slate-50">
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
    <main className="h-screen w-full bg-[radial-gradient(circle_at_top,_#e0f2fe,_#f8fafc_55%)] px-4 py-6">
      <section className="grid h-screen w-full gap-4 md:grid-cols-[360px_minmax(0,1fr)]">
        <Sidebar />
        <Settings user={user} onSignOut={handleSignOut} onSaveProfile={handleSaveProfile} />
      </section>
    </main>
  );
}
