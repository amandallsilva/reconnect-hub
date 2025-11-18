import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { ChatWidget } from "../Chat/ChatWidget";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
      <ChatWidget />
    </div>
  );
}
