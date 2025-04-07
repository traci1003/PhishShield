import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";

export default function ThreatDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['/api/message-stats'],
  });

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  
  return (
    <section className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Your Protection</h2>
        <Link href="/history">
          <a className="text-sm text-primary-600">View Details</a>
        </Link>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-medium text-gray-900">Threat Dashboard</h3>
            <p className="text-xs text-gray-500">Last 30 days</p>
          </div>
          <div className="bg-gradient-to-r from-primary-700 to-primary-500 text-white text-xs px-3 py-1 rounded-full">
            Protected
          </div>
        </div>
        
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-20 w-full" />
            <div className="grid grid-cols-3 gap-2">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          </div>
        ) : (
          <>
            {/* Threat Stats */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="text-xl font-semibold text-danger-500">{stats?.phishing || 0}</div>
                <div className="text-xs text-gray-500">Phishing</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="text-xl font-semibold text-caution-500">{stats?.suspicious || 0}</div>
                <div className="text-xs text-gray-500">Suspicious</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="text-xl font-semibold text-success-500">{stats?.safe || 0}</div>
                <div className="text-xs text-gray-500">Safe</div>
              </div>
            </div>
            
            {/* Activity Timeline */}
            <div className="h-20 relative flex items-end mb-1">
              <div className="absolute inset-0 flex items-end">
                {/* For demo purposes - in real app, would use actual data */}
                <div className="w-1/7 h-4 bg-gray-200 mx-0.5 rounded-sm"></div>
                <div className="w-1/7 h-8 bg-gray-200 mx-0.5 rounded-sm"></div>
                <div className="w-1/7 h-6 bg-gray-200 mx-0.5 rounded-sm"></div>
                <div className="w-1/7 h-12 bg-gray-200 mx-0.5 rounded-sm"></div>
                <div className="w-1/7 h-5 bg-gray-200 mx-0.5 rounded-sm"></div>
                <div className="w-1/7 h-10 bg-caution-500 mx-0.5 rounded-sm"></div>
                <div className="w-1/7 h-16 bg-danger-500 mx-0.5 rounded-sm"></div>
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              {days.map(day => (
                <span key={day}>{day}</span>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
