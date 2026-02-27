"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch, setAuthToken } from "../../lib/api";

type AuthResponse = {
  user: {
    id: string;
    email: string;
    fullName: string | null;
  };
  token: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Имэйл болон нууц үгийг оруулна уу.");
      return;
    }

    try {
      setLoading(true);
      const data = await apiFetch<AuthResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      setAuthToken(data.token);
      router.push("/message");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Нэвтрэх үед алдаа гарлаа.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome to Message
          </h1>
          <p className="text-gray-500 mt-1">use your mail</p>
        </div>

        <div className="border border-gray-200 rounded-2xl shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
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
                className="w-full rounded-lg border border-gray-300  text-black px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-gray-300 px-4 pr-20 text-black py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-green-700 hover:underline"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">user</div>
              <button
                type="button"
                onClick={() => router.push("/login/forgot-password")}
                className="text-sm text-green-600 hover:underline"
              >
                forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 active:scale-[0.99] text-white font-medium py-3 rounded-lg transition-all disabled:opacity-50"
            >
              {loading ? "loading..." : "Welcome"}
            </button>

            <div className="flex items-center gap-3 py-2">
              <div className="h-px bg-gray-200 flex-1" />
              <span className="text-gray-400 text-sm">or</span>
              <div className="h-px bg-gray-200 flex-1" />
            </div>

            <button
              type="button"
              onClick={() => router.push("/signup")}
              className="w-full border border-green-600 text-green-600 hover:bg-green-50 py-3 rounded-lg font-medium transition"
            >
              Sign-Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
