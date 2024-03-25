import Sidebar from "@/components/sidebar";
import ChatSidebar from "./components/ChatSidebar";

export default async function ChatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Sidebar>
      <div className="h-full">
        <ChatSidebar />
        {children}
      </div>
    </Sidebar>
  );
}
