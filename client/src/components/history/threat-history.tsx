import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { highlightSuspiciousParts } from "@/lib/natural-language";

export default function ThreatHistory() {
  const [activeTab, setActiveTab] = useState("all");
  
  const { data: messages, isLoading } = useQuery({
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
        message={message}
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

interface HistoryItemProps {
  message: any;
  onDelete: () => void;
}

function HistoryItem({ message, onDelete }: HistoryItemProps) {
  const [expanded, setExpanded] = useState(false);
  
  const threatLevel = message.threatLevel;
  const reasons = message.threatDetails?.reasons || [];
  
  let borderColor;
  let icon;
  
  switch (threatLevel) {
    case 'phishing':
      borderColor = 'border-danger-500';
      icon = 'warning';
      break;
    case 'suspicious':
      borderColor = 'border-caution-500';
      icon = 'help_outline';
      break;
    default:
      borderColor = 'border-success-500';
      icon = 'check_circle';
  }
  
  const scanDate = new Date(message.scanDate);
  const formattedDate = format(scanDate, 'MMM d, yyyy h:mm a');
  
  return (
    <div className={`bg-white rounded-xl shadow-sm p-4 mb-4 border-l-4 ${borderColor}`}>
      <div className="flex items-start">
        <div className={`rounded-full bg-${threatLevel === 'phishing' ? 'danger' : threatLevel === 'suspicious' ? 'caution' : 'success'}-500 p-1 mr-3`}>
          <span className="material-icons text-white text-sm">{icon}</span>
        </div>
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-gray-900">
              {threatLevel === 'phishing' 
                ? 'Phishing Detected' 
                : threatLevel === 'suspicious'
                  ? 'Suspicious Content'
                  : 'Safe Message'}
            </h3>
            <span className="text-xs text-gray-500">{formattedDate}</span>
          </div>
          <p className="text-xs text-gray-600 mt-1">
            {message.source.charAt(0).toUpperCase() + message.source.slice(1)} from{" "}
            <span className="font-medium">{message.sender}</span>
          </p>
          
          {/* Message Preview */}
          <div className="mt-3 text-sm p-3 bg-gray-50 rounded-lg">
            {expanded ? (
              <p 
                className="text-gray-700" 
                dangerouslySetInnerHTML={{ 
                  __html: highlightSuspiciousParts(message.content, reasons) 
                }}
              />
            ) : (
              <p className="text-gray-700 line-clamp-2">
                {message.content}
              </p>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="mt-3 flex justify-between">
            <div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs"
                onClick={() => setExpanded(!expanded)}
              >
                <span className="material-icons text-sm mr-1">
                  {expanded ? 'unfold_less' : 'unfold_more'}
                </span>
                {expanded ? 'Show Less' : 'Show More'}
              </Button>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs rounded-full"
              onClick={onDelete}
            >
              <span className="material-icons text-sm mr-1">delete</span>
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
