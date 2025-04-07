import { useState } from "react";
import ThreatHistory from "@/components/history/threat-history";

export default function History() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Scan History</h1>
        <p className="text-gray-600">
          All messages that have been scanned by PhishShield AI
        </p>
      </div>
      
      <ThreatHistory />
    </div>
  );
}
