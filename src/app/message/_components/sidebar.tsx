"use client";

import { useRouter } from "next/navigation";

type Conversation = {
  id: string;
  name: string;
  preview: string;
  time: string;
  unread?: number;
  active?: boolean;
  online?: boolean;
};

const conversations: Conversation[] = [
  {
    id: "1",
    name: "Personal Notes",
    preview: "Chat-аа энд хадгална.",
    time: "Now",
    active: true,
    online: true,
  },
];

function initials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0] || "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function Sidebar() {
  const router = useRouter();

  return (
    <aside className="h-screen w-full rounded-3xl border border-slate-200 bg-white/95 p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
          Messages
        </h2>
        <div className="flex items-center justify-center gap-1.5">
          <button
            type="button"
            className="grid h-9 w-9 place-items-center rounded-full bg-sky-500 text-lg font-semibold text-white transition hover:bg-sky-600"
            aria-label="New chat"
          >
            +
          </button>
          <button
            type="button"
            onClick={() => router.push("/message/settings")}
            className="grid h-9 w-9 place-items-center rounded-full bg-sky-500 text-lg font-semibold text-white transition hover:bg-sky-600"
            aria-label="Settings"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path d="M12 8.25A3.75 3.75 0 1 0 12 15.75A3.75 3.75 0 1 0 12 8.25z" />
              <path
                fillRule="evenodd"
                d="M3.273 10.934a1.125 1.125 0 0 1 0-1.868l1.03-.613a8.93 8.93 0 0 1 .786-1.894l-.289-1.164a1.125 1.125 0 0 1 1.321-1.322l1.164.29c.59-.33 1.224-.592 1.894-.787l.613-1.03a1.125 1.125 0 0 1 1.868 0l.613 1.03c.67.195 1.303.456 1.894.787l1.164-.29a1.125 1.125 0 0 1 1.321 1.322l-.289 1.164c.33.59.591 1.224.786 1.894l1.03.613a1.125 1.125 0 0 1 0 1.868l-1.03.613a8.932 8.932 0 0 1-.786 1.894l.289 1.164a1.125 1.125 0 0 1-1.321 1.322l-1.164-.29a8.93 8.93 0 0 1-1.894.787l-.613 1.03a1.125 1.125 0 0 1-1.868 0l-.613-1.03a8.93 8.93 0 0 1-1.894-.787l-1.164.29a1.125 1.125 0 0 1-1.321-1.322l.289-1.164a8.932 8.932 0 0 1-.786-1.894l-1.03-.613ZM12 6.75a5.25 5.25 0 1 0 0 10.5a5.25 5.25 0 1 0 0-10.5Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="mb-4">
        <input
          placeholder="Search"
          className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-700 outline-none ring-sky-300 transition focus:ring-2"
        />
      </div>

      <div className="space-y-1">
        {conversations.map((chat) => (
          <button
            key={chat.id}
            type="button"
            className={[
              "flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition",
              chat.active ? "bg-sky-500 text-white" : "hover:bg-slate-100",
            ].join(" ")}
          >
            <div className="relative shrink-0">
              <div
                className={[
                  "grid h-11 w-11 place-items-center rounded-full text-sm font-semibold",
                  chat.active
                    ? "bg-white/20 text-white"
                    : "bg-slate-200 text-slate-700",
                ].join(" ")}
              >
                {initials(chat.name)}
              </div>
              {chat.online ? (
                <span className="absolute right-0 top-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-400" />
              ) : null}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p
                  className={[
                    "truncate text-sm font-semibold",
                    chat.active ? "text-white" : "text-slate-900",
                  ].join(" ")}
                >
                  {chat.name}
                </p>
                <p
                  className={[
                    "shrink-0 text-xs",
                    chat.active ? "text-sky-100" : "text-slate-400",
                  ].join(" ")}
                >
                  {chat.time}
                </p>
              </div>
              <div className="mt-0.5 flex items-center justify-between gap-2">
                <p
                  className={[
                    "truncate text-xs",
                    chat.active ? "text-sky-100" : "text-slate-500",
                  ].join(" ")}
                >
                  {chat.preview}
                </p>
                {chat.unread ? (
                  <span
                    className={[
                      "grid h-5 min-w-5 place-items-center rounded-full px-1 text-[11px] font-semibold",
                      chat.active
                        ? "bg-white text-sky-600"
                        : "bg-sky-500 text-white",
                    ].join(" ")}
                  >
                    {chat.unread}
                  </span>
                ) : null}
              </div>
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
}
