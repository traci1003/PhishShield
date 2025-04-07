import { useState } from "react";
import { Shield, Settings, Bell, AccessibilityIcon } from "lucide-react";
import AccessibilitySettings from "@/components/accessibility-settings";
import { useAccessibility } from "@/contexts/accessibility-context";

export default function Header() {
  const [open, setOpen] = useState(false);
  const { highContrast } = useAccessibility();
  
  return (
    <header className={`${highContrast ? 'bg-black' : 'bg-gradient-shield'} text-white p-4 shadow-lg relative`}>
      <div className={`absolute inset-0 opacity-20 ${!highContrast ? 'bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.2),transparent_50%)]' : ''}`}></div>
      <div className="container mx-auto flex justify-between items-center relative z-10">
        <div className="flex items-center">
          <div className={`rounded-full ${highContrast ? 'bg-blue-700 border-2 border-white' : 'bg-white/20'} p-2 mr-3 shadow-md ${!highContrast ? 'float' : ''}`}>
            <Shield className="h-5 w-5" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">
            <span className={highContrast ? '' : 'text-gradient bg-gradient-to-r from-white to-blue-200'}>PhishShield</span>
            <span className={`text-xs ml-1 ${highContrast ? 'bg-blue-700 border border-white' : 'bg-white/20'} px-2 py-0.5 rounded-full`}>AI</span>
          </h1>
        </div>
        <div className="flex items-center space-x-3">
          <AccessibilitySettings />
          
          <button 
            className={`${highContrast ? 'bg-blue-700 border border-white' : 'bg-white/10 hover:bg-white/20'} rounded-full p-2 transition-all duration-300 hover:shadow-md`}
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
          </button>
          
          <button 
            className={`${highContrast ? 'bg-blue-700 border border-white' : 'bg-white/10 hover:bg-white/20'} rounded-full p-2 transition-all duration-300 hover:shadow-md`}
            onClick={() => setOpen(!open)}
            aria-label="Settings"
          >
            <Settings className={`h-5 w-5 ${!highContrast ? 'hover:rotate-90 transition-transform duration-500' : ''}`} />
          </button>
        </div>
      </div>
    </header>
  );
}
