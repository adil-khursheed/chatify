import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SocketProvider } from "@/context/SocketProvider";
import { ClerkProvider } from "@clerk/nextjs";
import Providers from "./providers";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chatify |  Your Gateway to Seamless Conversations",
  description:
    "Welcome to Chatify, the ultimate chat application designed to keep you connected with friends, family, and colleagues effortlessly. With Chatify, you can chat in real-time, share media, and stay organized with intuitive features. Whether you're catching up with loved ones or collaborating on projects, Chatify ensures smooth communication experiences tailored to your needs. Say goodbye to communication barriers and hello to seamless conversations with Chatify!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} bg-violet-50 dark:bg-slate-900`}>
          <Providers>
            <SocketProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange>
                {children}
                <Toaster />
              </ThemeProvider>
            </SocketProvider>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
