import Sidebar from "@/components/sidebar";
import ChatSidebar from "./components/ChatSidebar";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getAllUsers } from "@/server/users.actions";

export default async function ChatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
  });
  return (
    <Sidebar>
      <div className="h-full">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <ChatSidebar />
          {children}
        </HydrationBoundary>
      </div>
    </Sidebar>
  );
}
