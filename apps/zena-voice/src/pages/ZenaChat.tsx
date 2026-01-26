import Navigation from "@/components/Navigation";

export default function ZenaChat() {
  return (
    <div className="min-h-screen bg-[#FFF8F0] text-[#24160E] flex flex-col">
      <Navigation />
      <main className="flex-1 max-w-4xl mx-auto px-6 py-24">
        <h1 className="text-3xl font-semibold mb-4">Conversation ZÉNA</h1>
        <p className="text-base text-[#6B5442]">Page de conversation — placeholder. The full chat page is available at <code>/zena-chat</code> (ZenaChatpage component).</p>
      </main>
    </div>
  );
}
