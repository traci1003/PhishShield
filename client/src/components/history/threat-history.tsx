import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { highlightSuspiciousParts } from "@/lib/natural-language";
import { useAccessibility } from "@/contexts/accessibility-context";
import { Check, AlertCircle, X } from "lucide-react";
import { Message } from "@shared/schema";

export default function ThreatHistory() {
  const [activeTab, setActiveTab] = useState("all");
  
  const { data: messages = [], isLoading } = useQuery<Message[]>({
    queryKey: ['/api/messages'],
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

  const renderMessages = (threatLevel: string | null = null) => {
    if (!messages || messages.length === 0) {
      return (
        <div className="bg-white rounded-xl shadow-sm p-6 text-center">
          <div className="rounded-full bg-primary-50 p-3 mb-3 mx-auto w-fit">
            <span className="material-icons text-primary-600">search</span>
          </div>
          <h3 className="font-medium text-gray-900">No Messages Found</h3>
          <p className="text-sm text-gray-500 mt-1">
            No scan history is available.
          </p>
        </div>
      );
    }

    const filteredMessages = threatLevel 
      ? messages.filter(msg => msg.threatLevel === threatLevel)
      : messages;

    if (filteredMessages.length === 0) {
      return (
        <div className="bg-white rounded-xl shadow-sm p-6 text-center">
          <div className="rounded-full bg-primary-50 p-3 mb-3 mx-auto w-fit">
            <span className="material-icons text-primary-600">
              {threatLevel === 'phishing' ? 'security' : 'check_circle'}
            </span>
          </div>
          <h3 className="font-medium text-gray-900">
            {threatLevel === 'phishing' 
              ? 'No Phishing Messages' 
              : threatLevel === 'suspicious'
                ? 'No Suspicious Messages'
                : 'No Safe Messages'}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {threatLevel === 'phishing'
              ? 'No phishing attacks have been detected.'
              : threatLevel === 'suspicious'
                ? 'No suspicious messages have been found.'
                : 'No safe messages in your history.'}
          </p>
        </div>
      );
    }

    return filteredMessages.map(message => (
      <HistoryItem 
        key={message.id}
        message={message as unknown as ExtendedMessage}
        onDelete={() => handleDelete(message.id)}
      />
    ));
  };

  return (
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="phishing">Phishing</TabsTrigger>
          <TabsTrigger value="suspicious">Suspicious</TabsTrigger>
          <TabsTrigger value="safe">Safe</TabsTrigger>
        </TabsList>
        
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : (
          <>
            <TabsContent value="all">
              {renderMessages()}
            </TabsContent>
            
            <TabsContent value="phishing">
              {renderMessages('phishing')}
            </TabsContent>
            
            <TabsContent value="suspicious">
              {renderMessages('suspicious')}
            </TabsContent>
            
            <TabsContent value="safe">
              {renderMessages('safe')}
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
}

// Define a more specific type for message in our component
interface ExtendedMessage {
  id: number;
  userId: number | null;
  content: string;
  sender: string | null;
  scanDate: Date;
  threatLevel: string;
  threatDetails: {
    reasons: string[];
  } | Record<string, never>;
  isRead: boolean;
  source: string | null;
}

interface HistoryItemProps {
  message: ExtendedMessage;
  onDelete: () => void;
}

function HistoryItem({ message, onDelete }: HistoryItemProps) {
  const [expanded, setExpanded] = useState(false);
  const { highContrast } = useAccessibility();
  
  const threatLevel = message.threatLevel;
  const reasons = message.threatDetails?.reasons || [];
  
  const scanDate = new Date(message.scanDate);
  const formattedDate = format(scanDate, 'MMM d, yyyy h:mm a');
  
  // Define threat classes based on accessibility settings
  const getThreatClasses = () => {
    // Use the threat- classes we defined in CSS
    const containerClass = `threat-${threatLevel}`;
    const iconClass = `threat-${threatLevel}-icon`;
    
    return {
      containerClass,
      iconClass,
    };
  };
  
  const { containerClass, iconClass } = getThreatClasses();
  
  // Get icon based on threat level
  const ThreatIcon = () => {
    switch (threatLevel) {
      case 'phishing':
        return <X className="h-4 w-4" />;
      case 'suspicious':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Check className="h-4 w-4" />;
    }
  };
  
  return (
    <div className={`${highContrast ? 'high-contrast' : ''} rounded-xl shadow-sm p-4 mb-4 ${containerClass}`}>
      <div className="flex items-start">
        <div className={`mr-3 ${iconClass}`}>
          <ThreatIcon />
        </div>
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <h3 className="font-medium">
              {threatLevel === 'phishing' 
                ? 'Phishing Detected' 
                : threatLevel === 'suspicious'
                  ? 'Suspicious Content'
                  : 'Safe Message'}
            </h3>
            <span className="text-xs">{formattedDate}</span>
          </div>
          <p className="text-xs mt-1">
            {message.sender ? (
              <>
                Message from <span className="font-medium">{message.sender}</span>
              </>
            ) : (
              <>URL Scan</>
            )}
          </p>
          
          {/* Message Preview */}
          <div className={`mt-3 text-sm p-3 rounded-lg ${highContrast ? 'bg-gray-800 text-white' : 'bg-gray-50'}`}>
            {expanded ? (
              <div 
                dangerouslySetInnerHTML={{ 
                  __html: highlightSuspiciousParts(message.content, reasons)
                }}
              />
            ) : (
              <p className="line-clamp-2">
                {message.content}
              </p>
            )}
          </div>
          
          {/* Threat Indicators for High Contrast Mode */}
          {reasons.length > 0 && expanded && highContrast && (
            <div className="mt-2 p-3 border-2 border-dashed border-white bg-black text-white rounded-lg">
              <h4 className="font-bold text-sm mb-1">Threat Indicators:</h4>
              <ul className="list-disc pl-5 text-sm space-y-1">
                {reasons.map((reason: string, index: number) => (
                  <li key={index}>{reason}</li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="mt-3 flex justify-between">
            <div>
              <Button 
                variant={highContrast ? "default" : "ghost"} 
                size="sm" 
                className={`text-xs ${highContrast ? 'bg-blue-700 text-white' : ''}`}
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? 'Show Less' : 'Show More'}
              </Button>
            </div>
            <Button 
              variant={highContrast ? "destructive" : "outline"} 
              size="sm" 
              className={`text-xs rounded-full ${highContrast ? 'bg-red-700 text-white' : ''}`}
              onClick={onDelete}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
