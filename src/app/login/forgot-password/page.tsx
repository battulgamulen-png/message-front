"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch, ApiError } from "@/lib/api";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email) {
      setError("Имэйл оруулна уу.");
      return;
    }

    try {
      setLoading(true);
      await apiFetch("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });

      setSent(true);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Сервертэй холбогдож чадсангүй.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Reset your password</h1>
          <p className="text-gray-500 mt-1">We send your new passwrod to mail</p>
        </div>

        <div className="border border-gray-200 rounded-2xl shadow-sm p-8">
          {sent ? (
            <div className="space-y-4">
              <div className="text-green-700 bg-green-50 p-4 rounded-md">
                Холбоос амжилттай илгээгдлээ. Имэйлээ шалгана уу.
              </div>
              <button
                onClick={() => router.push("/login")}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg transition"
              >
                Нэвтрэх рүү буцах
              </button>
            </div>
          ) : (
            <form onSubmit={handleSend} className="space-y-5">
              {error && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                Mail
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 active:scale-[0.99] text-white font-medium py-3 rounded-lg transition-all disabled:opacity-50"
              >
                {loading ? "sending..." : "resend"}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => router.push("/login")}
                  className="text-sm text-gray-600 hover:underline"
                >
                 Back to login
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
