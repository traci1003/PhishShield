import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { getThreatColor, getThreatIcon } from "@/lib/link-analyzer";
import { highlightSuspiciousParts } from "@/lib/natural-language";
import { useToast } from "@/hooks/use-toast";

export default function RecentAlerts() {
  const { data: messages, isLoading } = useQuery({
    queryKey: ['/api/messages'],
    queryFn: async () => {
      const response = await fetch('/api/messages?limit=5');
      if (!response.ok) {
        throw new Error('Failed to fetch alerts');
      }
      return response.json();
    },
  });

  const { toast } = useToast();

  const handleDelete = async (id: number) => {
    try {
      await apiRequest('DELETE', `/api/messages/${id}`);
      queryClient.invalidateQueries({ queryKey: ['/api/messages'] });
      queryClient.invalidateQueries({ queryKey: ['/api/message-stats'] });
      toast({
        title: "Message deleted",
        description: "The message has been removed from your history.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete message.",
      });
    }
  };

  const handleReport = (id: number) => {
    toast({
      title: "Message reported",
      description: "Thank you for reporting this message.",
    });
  };

  const handleBlock = (sender: string) => {
    toast({
      title: "Sender blocked",
      description: `Messages from ${sender} will be blocked.`,
    });
  };

  return (
    <section className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Recent Alerts</h2>
        <Link href="/history">
          <a className="text-sm text-primary-600">View All</a>
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      ) : messages && messages.length > 0 ? (
        messages.filter(msg => msg.threatLevel !== 'safe').map((message) => (
          <AlertCard 
            key={message.id}
            message={message}
            onDelete={() => handleDelete(message.id)}
            onReport={() => handleReport(message.id)}
            onBlock={() => handleBlock(message.sender)}
          />
        ))
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-6 text-center">
          <div className="rounded-full bg-primary-50 p-3 mb-3 mx-auto w-fit">
            <span className="material-icons text-primary-600">security</span>
          </div>
          <h3 className="font-medium text-gray-900">No Threats Detected</h3>
          <p className="text-sm text-gray-500 mt-1">
            You have no recent phishing alerts. Your device is secure.
          </p>
        </div>
      )}
    </section>
  );
}

interface AlertCardProps {
  message: any;
  onDelete: () => void;
  onReport: () => void;
  onBlock: () => void;
}

function AlertCard({ message, onDelete, onReport, onBlock }: AlertCardProps) {
  const threatLevel = message.threatLevel;
  const reasons = message.threatDetails?.reasons || [];
  const color = threatLevel === 'phishing' ? 'danger' : 'caution';
  const icon = getThreatIcon(threatLevel);
  const title = threatLevel === 'phishing' ? 'Phishing Detected' : 'Suspicious Link';
  const date = new Date(message.scanDate);
  const formattedDate = isToday(date) ? 'Today' : isYesterday(date) ? 'Yesterday' : format(date, 'MMM d');

  function isToday(date: Date) {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  }

  function isYesterday(date: Date) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear();
  }

  return (
    <div className={`bg-white rounded-xl shadow-sm p-4 mb-4 border-l-4 border-${color}-500`}>
      <div className="flex items-start">
        <div className={`rounded-full bg-${color}-500 p-1 mr-3`}>
          <span className="material-icons text-white text-sm">{icon}</span>
        </div>
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-gray-900">{title}</h3>
            <span className="text-xs text-gray-500">{formattedDate}</span>
          </div>
          <p className="text-xs text-gray-600 mt-1">
            Message from <span className="font-medium">{message.sender}</span>
          </p>
          
          {/* Message Preview */}
          <div className="mt-3 text-sm p-3 bg-gray-50 rounded-lg">
            <p 
              className="text-gray-700" 
              dangerouslySetInnerHTML={{ 
                __html: highlightSuspiciousParts(message.content, reasons) 
              }}
            />
          </div>
          
          {/* Threat Details */}
          <div className="mt-3 text-xs">
            {reasons.map((reason, index) => (
              <div key={index} className="flex items-center text-gray-700">
                <span className="material-icons text-xs mr-1">
                  {reason.includes('URL') ? 'link_off' : 
                   reason.includes('urgency') ? 'priority_high' :
                   reason.includes('reward') ? 'card_giftcard' :
                   reason.includes('time') ? 'timer' :
                   reason.includes('impersonation') ? 'spellcheck' : 'warning'}
                </span>
                <span>{reason}</span>
              </div>
            ))}
          </div>
          
          {/* Action Buttons */}
          <div className="mt-3 flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs rounded-full"
              onClick={onDelete}
            >
              Delete
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs rounded-full"
              onClick={onReport}
            >
              Report
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs rounded-full"
              onClick={onBlock}
            >
              Block Sender
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
