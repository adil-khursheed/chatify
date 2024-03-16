import ChatPage from "@/components/chat-page";
import Sidebar from "@/components/sidebar";
import { getAllUsers } from "@/server/users.actions";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";

const HomePage = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
  });
  return (
    <main className="w-full h-screen grid grid-cols-12 gap-3 bg-violet-100 dark:bg-slate-900 p-4">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <section className="hidden md:col-span-4 h-[99%] bg-white dark:bg-slate-800 rounded md:flex md:flex-col md:justify-start">
          <Sidebar />
        </section>
        <section className="col-span-12 md:col-span-8 h-[99%] bg-white dark:bg-slate-800 rounded">
          <ChatPage />
        </section>
      </HydrationBoundary>
    </main>
  );
};

export default HomePage;
