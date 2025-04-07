import LiveChatComponent from "@/components/support/live-chat";

export default function LiveChatPage() {
  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6 text-[#1E1442]">Live Chat Support</h1>
      <LiveChatComponent />
    </div>
  );
}