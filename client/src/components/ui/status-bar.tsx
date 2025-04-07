import { Shield, Lock, AlertTriangle, WifiOff } from "lucide-react";
import { useState, useEffect } from "react";

export default function StatusBar() {
  const [status, setStatus] = useState<"active" | "alert" | "offline">("active");
  const [statusMessage, setStatusMessage] = useState("PhishShield AI is actively protecting your device");
  
  // This is just for demo purposes to show different states
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly change status for demonstration
      const random = Math.random();
      if (random > 0.9) {
        setStatus("alert");
        setStatusMessage("⚠️ Potential threat detected! Scanning in progress...");
      } else if (random < 0.1) {
        setStatus("offline");
        setStatusMessage("Protection temporarily paused. Tap to resume.");
      } else {
        setStatus("active");
        setStatusMessage("PhishShield AI is actively protecting your device");
      }
    }, 10000); // Change every 10 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  let bgColor = "";
  let Icon = Shield;
  
  switch (status) {
    case "alert":
      bgColor = "bg-gradient-alert";
      Icon = AlertTriangle;
      break;
    case "offline":
      bgColor = "bg-gray-600";
      Icon = WifiOff;
      break;
    default:
      bgColor = "bg-gradient-shield";
      Icon = Shield;
  }
  
  return (
    <div className={`${bgColor} text-white px-4 py-2 flex items-center justify-center text-sm relative overflow-hidden`}>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgcGF0dGVyblRyYW5zZm9ybT0icm90YXRlKDQ1KSI+PHJlY3Qgd2lkdGg9IjIiIGhlaWdodD0iMiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2EpIi8+PC9zdmc+')] opacity-30"></div>
      <div className="absolute inset-0 w-full h-full" style={{ 
        backgroundImage: 'linear-gradient(to right, transparent, rgba(255,255,255,0.1), transparent)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 2s infinite'
      }}></div>
      <Icon className={`h-4 w-4 mr-2 ${status === "alert" ? "animate-ping" : "pulse-slow"}`} />
      <span className="relative z-10">{statusMessage}</span>
    </div>
  );
}
