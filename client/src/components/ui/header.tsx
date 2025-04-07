import { useState } from "react";
import { Shield, Settings, Bell } from "lucide-react";

export default function Header() {
  const [open, setOpen] = useState(false);
  
  return (
    <header className="bg-gradient-shield text-white p-4 shadow-lg relative">
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.2),transparent_50%)]"></div>
      <div className="container mx-auto flex justify-between items-center relative z-10">
        <div className="flex items-center">
          <div className="rounded-full bg-white/20 p-2 mr-3 shadow-md float">
            <Shield className="h-5 w-5" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">
            <span className="text-gradient bg-gradient-to-r from-white to-blue-200">PhishShield</span>
            <span className="text-xs ml-1 bg-white/20 px-2 py-0.5 rounded-full">AI</span>
          </h1>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            className="bg-white/10 hover:bg-white/20 rounded-full p-2 transition-all duration-300 hover:shadow-md"
          >
            <Bell className="h-5 w-5" />
          </button>
          <button 
            className="bg-white/10 hover:bg-white/20 rounded-full p-2 transition-all duration-300 hover:shadow-md"
            onClick={() => setOpen(!open)}
          >
            <Settings className="h-5 w-5 hover:rotate-90 transition-transform duration-500" />
          </button>
        </div>
      </div>
    </header>
  );
}
