"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

type SettingsProps = {
  user: {
    id: string;
    email: string;
    fullName: string | null;
    profileImage: string | null;
  };
  onSignOut: () => void;
  onSaveProfile: (payload: { fullName: string; profileImage: string | null }) => Promise<void>;
};

function initials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0] || "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function Settings({ user, onSignOut, onSaveProfile }: SettingsProps) {
  const [fullName, setFullName] = useState(user.fullName || "");
  const [profileImage, setProfileImage] = useState<string | null>(user.profileImage || null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const avatarLabel = useMemo(() => {
    if (fullName.trim()) {
      return initials(fullName.trim());
    }
    return initials(user.email);
  }, [fullName, user.email]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : null;
      setProfileImage(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setStatus(null);
      await onSaveProfile({
        fullName,
        profileImage,
      });
      setStatus("Saved");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Хадгалах үед алдаа гарлаа.";
      setStatus(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <article className="flex h-screen w-full flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="border-b border-slate-200 pb-4">
        <p className="text-xs uppercase tracking-[0.2em] text-sky-600">Settings</p>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Profile</h1>
        <p className="mt-1 text-sm text-slate-500">iMessage style account settings</p>
      </div>

      <div className="mt-6 flex items-center gap-4">
        {profileImage ? (
          <Image
            src={profileImage}
            alt="Profile"
            width={80}
            height={80}
            className="h-20 w-20 rounded-full border border-slate-200 object-cover"
          />
        ) : (
          <div className="grid h-20 w-20 place-items-center rounded-full bg-sky-500 text-xl font-semibold text-white">
            {avatarLabel}
          </div>
        )}

        <label className="cursor-pointer rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200">
          Add photo
          <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
        </label>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-700">Name</span>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your name"
            className="h-11 rounded-xl border border-slate-200 px-3 text-sm text-slate-800 outline-none ring-sky-300 focus:ring-2"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-700">Gmail</span>
          <input
            value={user.email}
            disabled
            className="h-11 rounded-xl border border-slate-200 bg-slate-100 px-3 text-sm text-slate-600"
          />
        </label>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <button
          onClick={handleSave}
          className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-600 disabled:opacity-50"
          type="button"
          disabled={saving}
        >
          {saving ? "Saving..." : "Save profile"}
        </button>
        {status ? <p className="text-sm text-slate-500">{status}</p> : null}
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-slate-200 pt-5">
        <p className="text-xs text-slate-400">User ID: {user.id}</p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setProfileImage(null)}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            type="button"
          >
            Remove photo
          </button>
          <button
            onClick={onSignOut}
            className="rounded-xl bg-rose-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-600"
            type="button"
          >
            Sign out
          </button>
        </div>
      </div>
    </article>
  );
}
