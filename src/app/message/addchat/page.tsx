"use client";

import Sidebar from "../_components/sidebar";
import AddChat from "../_components/addchat";

export default function AddChatPage() {
  return (
    <main className="h-full w-full bg-[radial-gradient(circle_at_top,_#e0f2fe,_#f8fafc_55%)] px-4 py-6">
      <section className="grid h-screen w-full gap-4 md:grid-cols-[360px_minmax(0,1fr)]">
        <Sidebar messageCount={0} deleting={false} onDeleteChat={() => {}} />
        <AddChat />
      </section>
    </main>
  );
}
