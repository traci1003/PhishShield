import QuickActions from "@/components/dashboard/quick-actions";
import ThreatDashboard from "@/components/dashboard/threat-dashboard";
import RecentAlerts from "@/components/dashboard/recent-alerts";
import ProtectionStatus from "@/components/dashboard/protection-status";

export default function Dashboard() {
  return (
    <>
      <QuickActions />
      <ThreatDashboard />
      <RecentAlerts />
      <ProtectionStatus />
    </>
  );
}
