import { MessageScanResult } from "@/lib/natural-language";
import { UrlAnalysisResult, getThreatColor, getThreatIcon } from "@/lib/link-analyzer";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, HelpCircle, Link as LinkIcon } from "lucide-react";

interface ScanResultProps {
  textResult: MessageScanResult | null;
  urlResult: UrlAnalysisResult | null;
  onNewScan: () => void;
}

export default function ScanResult({ textResult, urlResult, onNewScan }: ScanResultProps) {
  const result = textResult?.analysis || urlResult;
  if (!result) return null;
  
  const threatLevel = result.threatLevel;
  const reasons = result.reasons;
  
  let icon;
  let color;
  let title;
  let description;
  
  switch (threatLevel) {
    case 'phishing':
      icon = <AlertTriangle className="h-10 w-10 text-red-500" />;
      color = 'red';
      title = 'Phishing Detected';
      description = 'This message contains multiple indicators of a phishing attempt.';
      break;
    case 'suspicious':
      icon = <HelpCircle className="h-10 w-10 text-amber-500" />;
      color = 'amber';
      title = 'Suspicious Content';
      description = 'This message contains some suspicious elements.';
      break;
    default:
      icon = <CheckCircle className="h-10 w-10 text-green-500" />;
      color = 'green';
      title = 'Content Appears Safe';
      description = 'No phishing indicators were detected.';
  }
  
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-start mb-6">
        {icon}
        <div className="ml-4">
          <h2 className={`font-bold text-xl text-${color}-600`}>{title}</h2>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>
      
      {textResult && (
        <div className="mb-6">
          <h3 className="font-medium text-gray-900 mb-2">Analyzed Message</h3>
          <div className="bg-gray-50 p-4 rounded-lg text-gray-700 whitespace-pre-wrap">
            {textResult.message.content}
          </div>
        </div>
      )}
      
      {urlResult && (
        <div className="mb-6">
          <h3 className="font-medium text-gray-900 mb-2">Analyzed URL</h3>
          <div className="bg-gray-50 p-4 rounded-lg text-gray-700 flex items-center">
            <LinkIcon className="mr-2 h-4 w-4 flex-shrink-0" />
            <span className="truncate">{urlResult.url}</span>
          </div>
        </div>
      )}
      
      <div className="mb-6">
        <h3 className="font-medium text-gray-900 mb-2">Analysis Results</h3>
        
        {reasons.length > 0 ? (
          <ul className="bg-gray-50 rounded-lg divide-y">
            {reasons.map((reason, index) => (
              <li key={index} className="p-3 flex items-start">
                <span className={`material-icons text-${color}-500 mr-2`}>
                  {threatLevel === 'phishing' ? 'warning' : 'info'}
                </span>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="bg-gray-50 p-4 rounded-lg text-gray-700">
            No suspicious elements detected.
          </div>
        )}
      </div>
      
      {threatLevel !== 'safe' && (
        <div className="mb-6 bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">Recommendations</h3>
          <ul className="text-sm text-gray-700 space-y-2">
            <li className="flex items-start">
              <span className="material-icons text-primary-600 mr-2 text-sm">check_circle</span>
              <span>Don't click any links in the message</span>
            </li>
            <li className="flex items-start">
              <span className="material-icons text-primary-600 mr-2 text-sm">check_circle</span>
              <span>Don't reply or provide any personal information</span>
            </li>
            <li className="flex items-start">
              <span className="material-icons text-primary-600 mr-2 text-sm">check_circle</span>
              <span>Block the sender if you continue to receive messages</span>
            </li>
            <li className="flex items-start">
              <span className="material-icons text-primary-600 mr-2 text-sm">check_circle</span>
              <span>Report the message to appropriate authorities</span>
            </li>
          </ul>
        </div>
      )}
      
      <div className="flex gap-4">
        <Button 
          className="flex-1 bg-primary-600 hover:bg-primary-700"
          onClick={onNewScan}
        >
          <span className="material-icons mr-2">refresh</span>
          Scan Another
        </Button>
        
        {threatLevel !== 'safe' && (
          <Button 
            variant="outline" 
            className="flex-1"
          >
            <span className="material-icons mr-2">report</span>
            Report
          </Button>
        )}
      </div>
    </div>
  );
}
