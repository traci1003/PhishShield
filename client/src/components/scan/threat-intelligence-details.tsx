import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Database, Shield, AlertTriangle, CheckCircle, Info, AlertCircle } from "lucide-react";
import { BsGraphUp } from "react-icons/bs";
import { ThreatData } from "@shared/schema";

interface ThreatIntelligenceDetailsProps {
  threatData?: ThreatData;
  className?: string;
}

export default function ThreatIntelligenceDetails({ 
  threatData, 
  className = "" 
}: ThreatIntelligenceDetailsProps) {
  const [isOpen, setIsOpen] = useState(true);
  
  if (!threatData) return null;

  // Get domain info if it exists
  const domainInfo = threatData.domainInfo;
  // Get sender info if it exists
  const senderInfo = threatData.senderInfo;
  
  // Function to determine color based on reputation score
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    if (score >= 40) return "text-orange-500";
    return "text-red-500";
  };
  
  // Function to get progress color
  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    if (score >= 40) return "bg-orange-500";
    return "bg-red-500";
  };

  // Function to render security indicator
  const SecurityIndicator = ({ 
    value, 
    label, 
    positive = true 
  }: { 
    value?: boolean; 
    label: string; 
    positive?: boolean;
  }) => {
    if (value === undefined) return null;
    
    const Icon = value === positive ? CheckCircle : AlertCircle;
    const iconColor = value === positive ? "text-green-500" : "text-red-500";
    
    return (
      <div className="flex items-center space-x-2">
        <Icon className={`h-4 w-4 ${iconColor}`} />
        <span className="text-sm">{label}</span>
      </div>
    );
  };
  
  return (
    <div className={`bg-white rounded-lg border border-gray-200 overflow-hidden ${className}`}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-gray-50 transition-colors text-left">
          <div className="flex items-center">
            <Database className="h-5 w-5 mr-2 text-primary-500" />
            <span className="font-medium">Threat Intelligence Details</span>
          </div>
          <div className="text-xs text-gray-500">
            {isOpen ? 'Hide details' : 'Show details'}
          </div>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="px-4 pb-4 pt-1 space-y-4">
          {/* Domain Reputation Score */}
          {domainInfo?.reputationScore !== undefined && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <BsGraphUp className="h-4 w-4 mr-2 text-primary-500" />
                  <span className="text-sm font-medium">Domain Reputation</span>
                </div>
                <span className={`text-sm font-bold ${getScoreColor(domainInfo.reputationScore)}`}>
                  {domainInfo.reputationScore}/100
                </span>
              </div>
              <Progress 
                value={domainInfo.reputationScore} 
                max={100}
                className="h-2 bg-gray-100"
                indicatorClassName={getProgressColor(domainInfo.reputationScore)}
              />
              
              {domainInfo.domain && (
                <div className="text-xs text-gray-500 mt-1">
                  Domain: {domainInfo.domain}
                </div>
              )}

              {domainInfo.categories && domainInfo.categories.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {domainInfo.categories.map((category, index) => (
                    <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                      {category}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* Sender Security Information */}
          {senderInfo && (
            <div className="space-y-2 pt-2 border-t">
              <div className="flex items-center">
                <Shield className="h-4 w-4 mr-2 text-primary-500" />
                <span className="text-sm font-medium">Sender Security</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mt-2">
                <SecurityIndicator 
                  value={senderInfo.hasDmarc} 
                  label="DMARC Protection" 
                />
                <SecurityIndicator 
                  value={senderInfo.hasSpf} 
                  label="SPF Record" 
                />
                <SecurityIndicator 
                  value={senderInfo.hasDkim} 
                  label="DKIM Signature" 
                />
                {senderInfo.securityLevel && (
                  <div className="flex items-center space-x-2">
                    <Info className="h-4 w-4 text-blue-500" />
                    <span className="text-sm capitalize">
                      {senderInfo.securityLevel} Security
                    </span>
                  </div>
                )}
              </div>
              
              {senderInfo.reputationScore !== undefined && (
                <div className="mt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Sender Score</span>
                    <span className={`text-xs font-bold ${getScoreColor(senderInfo.reputationScore)}`}>
                      {senderInfo.reputationScore}/100
                    </span>
                  </div>
                  <Progress 
                    value={senderInfo.reputationScore} 
                    max={100}
                    className="h-1.5 mt-1 bg-gray-100"
                    indicatorClassName={getProgressColor(senderInfo.reputationScore)}
                  />
                </div>
              )}
              
              {senderInfo.creationDate && (
                <div className="text-xs text-gray-500 mt-1">
                  Domain registered: {senderInfo.creationDate}
                </div>
              )}
            </div>
          )}
          
          {/* Threat Information */}
          {domainInfo && (
            <div className="space-y-2 pt-2 border-t">
              <div className="flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
                <span className="text-sm font-medium">Threat Assessment</span>
              </div>
              
              {domainInfo.malicious && (
                <div className="flex items-start p-1 bg-red-50 rounded border border-red-100 text-xs text-red-800">
                  <AlertTriangle className="h-3.5 w-3.5 mt-0.5 mr-1 flex-shrink-0" />
                  <span>This domain has been flagged as malicious by security providers</span>
                </div>
              )}
              
              {domainInfo.suspicious && !domainInfo.malicious && (
                <div className="flex items-start p-1 bg-amber-50 rounded border border-amber-100 text-xs text-amber-800">
                  <AlertCircle className="h-3.5 w-3.5 mt-0.5 mr-1 flex-shrink-0" />
                  <span>This domain has suspicious characteristics that warrant caution</span>
                </div>
              )}
              
              {domainInfo.sources && domainInfo.sources.length > 0 && (
                <div className="mt-1">
                  <span className="text-xs text-gray-500">Flagged by: </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {domainInfo.sources.map((source, idx) => (
                      <span key={idx} className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">
                        {source}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {domainInfo.lastChecked && (
                <div className="text-xs text-gray-500 mt-1">
                  Last checked: {domainInfo.lastChecked}
                </div>
              )}
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}