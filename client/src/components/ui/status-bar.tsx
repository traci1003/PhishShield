import { Shield } from "lucide-react";

export default function StatusBar() {
  return (
    <div className="bg-primary-600 text-white px-4 py-2 flex items-center justify-center text-sm">
      <Shield className="h-4 w-4 mr-2 animate-pulse" />
      <span>PhishShield AI is actively protecting your device</span>
    </div>
  );
}
