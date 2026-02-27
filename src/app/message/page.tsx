"use client";

import { useEffect, useState } from "react";
import * as Ably from "ably";
import { useRouter } from "next/navigation";
import { apiFetch, clearAuthToken, getAuthToken } from "../../lib/api";
import Sidebar from "./_components/sidebar";

type AuthUser = {
  id: string;
  email: string;
  fullName: string | null;
  profileImage: string | null;
  createdAt: string;
};

type ChatMessage = {
  id: string;
  text: string;
  createdAt: string;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
  "http://localhost:4000";

export default function MessagePage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [deletingChat, setDeletingChat] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        const [profile, chatData] = await Promise.all([
          apiFetch<{ user: AuthUser }>("/auth/me"),
          apiFetch<{ messages: ChatMessage[] }>("/chats/messages"),
        ]);
        if (!mounted) {
          return;
        }
        setUser(profile.user);
        setMessages(chatData.messages);
      } catch {
        clearAuthToken();
        if (mounted) {
          setUser(null);
          setMessages([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }

    const token = getAuthToken();
    if (!token) {
      return;
    }

    const realtimeClient = new Ably.Realtime({
      authUrl: `${API_BASE_URL}/ably/token`,
      authHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    const channel = realtimeClient.channels.get(`chat:${user.id}`);
    const onMessage = (event: { data?: { message?: ChatMessage } }) => {
      const incoming = event?.data?.message;
      if (!incoming?.id || !incoming.text || !incoming.createdAt) {
        return;
      }

      setMessages((prev) => {
        if (prev.some((msg) => msg.id === incoming.id)) {
          return prev;
        }
        return [...prev, incoming];
      });
    };
    const onChatCleared = () => {
      setMessages([]);
    };

    channel.subscribe("message.created", onMessage);
    channel.subscribe("chat.cleared", onChatCleared);

    return () => {
      try {
        channel.unsubscribe("message.created", onMessage);
        channel.unsubscribe("chat.cleared", onChatCleared);
        if (realtimeClient.connection.state !== "closed") {
          realtimeClient.close();
        }
      } catch (error) {
        console.warn("Ably cleanup error:", error);
      }
    };
  }, [user]);

  const handleDeleteChat = async () => {
    if (deletingChat) {
      return;
    }
    if (messages.length === 0) {
      return;
    }
    const confirmed = window.confirm(
      "Энэ чатын бүх мессежийг устгах уу?",
    );
    if (!confirmed) {
      return;
    }

    setDeletingChat(true);
    try {
      await apiFetch<{ ok: boolean }>("/chats/messages", { method: "DELETE" });
      setMessages([]);
    } catch (error) {
      console.error(error);
    } finally {
      setDeletingChat(false);
    }
  };

  const handleSend = async () => {
    const value = text.trim();
    if (!value) {
      return;
    }
    try {
      const data = await apiFetch<{ message: ChatMessage }>("/chats/messages", {
        method: "POST",
        body: JSON.stringify({ text: value }),
      });
      setMessages((prev) => {
        if (prev.some((msg) => msg.id === data.message.id)) {
          return prev;
        }
        return [...prev, data.message];
      });
      setText("");
    } catch (error) {
      console.error(error);
    }
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
          <h1 className="text-2xl font-bold text-slate-900">
            Нэвтрэлт шаардлагатай
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Энэ хуудсыг үзэхийн тулд эхлээд нэвтэрнэ үү.
          </p>
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
    <main className="h-full w-full bg-[radial-gradient(circle_at_top,_#e0f2fe,_#f8fafc_55%)] px-4 py-6">
      <section className="grid h-screen w-full gap-4 md:grid-cols-[360px_minmax(0,1fr)]">
        <Sidebar
          messageCount={messages.length}
          deleting={deletingChat}
          onDeleteChat={handleDeleteChat}
        />

        <article className="flex h-screen w-full flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between border-b border-slate-200 pb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-sky-600">
                Message
              </p>
              <h1 className="mt-1 text-2xl font-semibold text-slate-900">
                {user.fullName || user.email}
              </h1>
              <p className="mt-1 text-sm text-slate-500">ID: {user.id}</p>
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-4 py-4">
            <div className="flex-1 space-y-3 overflow-y-auto pr-1">
              {messages.map((message) => (
                <div key={message.id} className="flex justify-end">
                  <p
                    className={[
                      "max-w-[80%] rounded-2xl px-4 py-2 text-sm",
                      "bg-sky-500 text-white rounded-br-md",
                    ].join(" ")}
                  >
                    {message.text}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Type iMessage..."
                className="h-11 w-full rounded-xl bg-white px-4 text-sm text-slate-700 outline-none ring-sky-300 focus:ring-2"
              />
              <button
                type="button"
                onClick={handleSend}
                className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-sky-500 text-white transition hover:bg-sky-600"
                aria-label="Send message"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <path d="M3.36 2.72a.75.75 0 0 0-.24 1.46l7.34 2.45 2.45 7.34a.75.75 0 0 0 1.4.08l7.5-15a.75.75 0 0 0-.98-.98l-15 7.5a.75.75 0 0 0 .08 1.4l7.34 2.45 2.45 7.34a.75.75 0 0 0 1.4.08l7.5-15a.75.75 0 0 0-.98-.98l-15 7.5z" />
                </svg>
              </button>
            </div>
          </div>
        </article>
      </section>
    </main>
  );
}
