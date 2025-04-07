import { useState } from "react";
import { Shield } from "lucide-react";

export default function Header() {
  const [open, setOpen] = useState(false);
  
  return (
    <header className="bg-gradient-to-r from-primary-700 to-primary-500 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <div className="rounded-full bg-white/20 p-2 mr-2">
            <Shield className="h-5 w-5" />
          </div>
          <h1 className="text-xl font-semibold">PhishShield AI</h1>
        </div>
        <div className="flex items-center">
          <button 
            className="bg-white/10 rounded-full p-2"
            onClick={() => setOpen(!open)}
          >
            <span className="material-icons">settings</span>
          </button>
        </div>
      </div>
    </header>
  );
}
