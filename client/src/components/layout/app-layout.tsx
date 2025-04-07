import { ReactNode } from "react";
import BottomNavigation from "@/components/ui/bottom-navigation";
import Header from "@/components/ui/header";
import StatusBar from "@/components/ui/status-bar";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <StatusBar />
      <main className="flex-grow container mx-auto p-4 pb-20">
        {children}
      </main>
      <BottomNavigation />
    </div>
  );
}
