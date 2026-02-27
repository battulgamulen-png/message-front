"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError, apiFetch } from "../../../lib/api";

type ChatMessage = {
  id: string;
  text: string;
  createdAt: string;
};

export default function AddChat() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleCreateChat = async () => {
    const value = text.trim();
    if (!value || submitting) {
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await apiFetch<{ message: ChatMessage }>("/chats/messages", {
        method: "POST",
        body: JSON.stringify({ text: value }),
      });
      router.push("/message");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
        if (err.status === 401) {
          router.push("/login");
        }
      } else {
        setError("Чат эхлүүлэхэд алдаа гарлаа.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <article className="flex h-screen w-full flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="border-b border-slate-200 pb-4">
        <p className="text-xs uppercase tracking-[0.2em] text-sky-600">New chat</p>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Chat эхлүүлэх</h1>
        <p className="mt-2 text-sm text-slate-500">
          Эхний мессежээ бичээд чат эхлүүлнэ үү.
        </p>
      </div>

      <div className="flex flex-1 flex-col gap-4 py-6">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Сайн уу..."
          className="min-h-[180px] w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800 outline-none ring-sky-300 focus:ring-2"
        />
        {error ? <p className="text-sm text-rose-600">{error}</p> : null}
      </div>

      <div className="flex justify-end gap-2 border-t border-slate-200 pt-4">
        <button
          type="button"
          onClick={() => router.push("/message")}
          className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
        >
          Болих
        </button>
        <button
          type="button"
          onClick={handleCreateChat}
          disabled={submitting || !text.trim()}
          className="rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {submitting ? "Илгээж байна..." : "Chat эхлүүлэх"}
        </button>
      </div>
    </article>
  );
}
