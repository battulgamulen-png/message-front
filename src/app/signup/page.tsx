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

export default function SignUpPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validate = () => {
    if (!fullName.trim()) return "Нэрээ оруулна уу.";
    if (!email.trim()) return "Имэйл оруулна уу.";
    const re = /\S+@\S+\.\S+/;
    if (!re.test(email)) return "Зөв имэйл хаяг оруулна уу.";
    if (password.length < 8) return "Нууц үг дор хаяж 8 тэмдэгт байх ёстой.";
    if (password !== confirm) return "Нууц үг болон баталгаажуулалт таарахгүй байна.";
    return null;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    try {
      setLoading(true);
      const data = await apiFetch<AuthResponse>("/auth/signup", {
        method: "POST",
        body: JSON.stringify({
          email,
          fullName,
          password,
        }),
      });

      setAuthToken(data.token);
      router.push("/message");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Бүртгэх үед алдаа гарлаа.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">New account</h1>
          <p className="text-gray-500 mt-1">To create</p>
        </div>

        <div className="border border-gray-200 rounded-2xl shadow-sm p-8">
          <form onSubmit={handleRegister} className="space-y-5">
            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ex: Mulen Battulga"
                className="w-full rounded-lg border text-black border-gray-300 px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:black transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-black outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="at least 8 digit"
                  className="w-full rounded-lg border border-gray-300 text-black px-4 pr-20 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition"
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
              <p className="text-xs text-gray-400 mt-1">
                Good password: 8+ characters, including lowercase/uppercase letters and numbers.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm passwords</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Confirm password"
                  className="w-full rounded-lg border border-gray-300 text-black px-4 pr-20 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-green-700 hover:underline"
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 active:scale-[0.99] text-white font-medium py-3 rounded-lg transition-all disabled:opacity-50"
            >
              {loading ? "register" : "Sign up"}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="text-sm text-gray-600 hover:underline"
              >
                Already exists my account
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
