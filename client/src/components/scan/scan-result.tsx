import { MessageScanResult } from "@/lib/natural-language";
import { UrlAnalysisResult, getThreatColor, getThreatIcon } from "@/lib/link-analyzer";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, HelpCircle, Link as LinkIcon, RefreshCw, Flag, AlertCircle, Shield } from "lucide-react";
import { useEffect, useState } from "react";

interface ScanResultProps {
  textResult: MessageScanResult | null;
  urlResult: UrlAnalysisResult | null;
  onNewScan: () => void;
}

export default function ScanResult({ textResult, urlResult, onNewScan }: ScanResultProps) {
  const [showContent, setShowContent] = useState(false);
  
  useEffect(() => {
    // Delayed animation start
    setTimeout(() => {
      setShowContent(true);
    }, 300);
  }, []);
  
  const result = textResult?.analysis || urlResult;
  if (!result) return null;
  
  const threatLevel = result.threatLevel;
  const reasons = result.reasons;
  
  let Icon;
  let bgGradient;
  let title;
  let description;
  let iconBg;
  let iconClass;
  
  switch (threatLevel) {
    case 'phishing':
      Icon = AlertTriangle;
      bgGradient = "bg-gradient-alert";
      title = 'Phishing Detected';
      description = 'This message contains multiple indicators of a phishing attempt.';
      iconBg = "bg-red-100";
      iconClass = "text-red-500 animate-pulse";
      break;
    case 'suspicious':
      Icon = AlertCircle;
      bgGradient = "bg-gradient-caution";
      title = 'Suspicious Content';
      description = 'This message contains some suspicious elements.';
      iconBg = "bg-amber-100";
      iconClass = "text-amber-500 pulse-slow";
      break;
    default:
      Icon = Shield;
      bgGradient = "bg-gradient-safe";
      title = 'Content Appears Safe';
      description = 'No phishing indicators were detected.';
      iconBg = "bg-green-100";
      iconClass = "text-green-500";
  }
  
  return (
    <div className="bg-white rounded-xl p-6 shadow-md overflow-hidden relative fade-in">
      <div className={`absolute top-0 left-0 w-full h-2 ${bgGradient}`}></div>
      
      <div className={`flex items-start mb-6 ${showContent ? 'slide-in-left' : 'opacity-0'}`} style={{transitionDelay: '100ms'}}>
        <div className={`rounded-full ${iconBg} p-4 mr-4 shadow-md`}>
          <Icon className={`h-10 w-10 ${iconClass}`} />
        </div>
        <div>
          <h2 className={`font-bold text-xl text-gradient ${bgGradient}`}>{title}</h2>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>
      
      {textResult && (
        <div className={`mb-6 ${showContent ? 'slide-in-right' : 'opacity-0'}`} style={{transitionDelay: '200ms'}}>
          <h3 className="font-medium text-gray-900 mb-2 flex items-center">
            <span className="mr-2 material-icons-outlined text-primary-500">message</span>
            Analyzed Message
          </h3>
          <div className="bg-gray-50 p-4 rounded-lg text-gray-700 whitespace-pre-wrap border border-gray-100 shadow-inner">
            {textResult.message.content}
          </div>
        </div>
      )}
      
      {urlResult && (
        <div className={`mb-6 ${showContent ? 'slide-in-right' : 'opacity-0'}`} style={{transitionDelay: '200ms'}}>
          <h3 className="font-medium text-gray-900 mb-2 flex items-center">
            <LinkIcon className="mr-2 h-5 w-5 text-primary-500" />
            Analyzed URL
          </h3>
          <div className="bg-gray-50 p-4 rounded-lg text-gray-700 flex items-center border border-gray-100 shadow-inner group hover:bg-gray-100 transition-colors duration-300 break-all">
            <span className="text-blue-500 hover:underline">{urlResult.url}</span>
          </div>
        </div>
      )}
      
      <div className={`mb-6 ${showContent ? 'fade-in' : 'opacity-0'}`} style={{transitionDelay: '300ms'}}>
        <h3 className="font-medium text-gray-900 mb-2 flex items-center">
          <Shield className="mr-2 h-5 w-5 text-primary-500" />
          Analysis Results
        </h3>
        
        {reasons.length > 0 ? (
          <ul className="bg-gray-50 rounded-lg divide-y border border-gray-100">
            {reasons.map((reason, index) => (
              <li key={index} className="p-4 flex items-start group hover:bg-gray-100 transition-all duration-300">
                <div className={`rounded-full p-1 mr-3 ${threatLevel === 'phishing' ? 'bg-red-100' : 'bg-amber-100'}`}>
                  {threatLevel === 'phishing' ? 
                    <AlertTriangle className="h-4 w-4 text-red-500" /> : 
                    <HelpCircle className="h-4 w-4 text-amber-500" />
                  }
                </div>
                <span className="text-gray-700 group-hover:text-gray-900 transition-colors duration-300">{reason}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="bg-gray-50 p-4 rounded-lg text-gray-700 border border-gray-100 flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <span>No suspicious elements detected.</span>
          </div>
        )}
      </div>
      
      {threatLevel !== 'safe' && (
        <div className={`mb-6 bg-gray-50 p-5 rounded-lg border border-gray-100 ${showContent ? 'fade-in' : 'opacity-0'}`} style={{transitionDelay: '400ms'}}>
          <h3 className="font-medium text-gray-900 mb-3 flex items-center">
            <Shield className="mr-2 h-5 w-5 text-primary-500" />
            Recommendations
          </h3>
          <ul className="text-sm text-gray-700 space-y-3">
            <li className="flex items-start p-2 hover:bg-white rounded-md transition-colors duration-300">
              <div className="rounded-full bg-primary-100 p-1 mr-3">
                <CheckCircle className="h-4 w-4 text-primary-600" />
              </div>
              <span>Don't click any links in the message</span>
            </li>
            <li className="flex items-start p-2 hover:bg-white rounded-md transition-colors duration-300">
              <div className="rounded-full bg-primary-100 p-1 mr-3">
                <CheckCircle className="h-4 w-4 text-primary-600" />
              </div>
              <span>Don't reply or provide any personal information</span>
            </li>
            <li className="flex items-start p-2 hover:bg-white rounded-md transition-colors duration-300">
              <div className="rounded-full bg-primary-100 p-1 mr-3">
                <CheckCircle className="h-4 w-4 text-primary-600" />
              </div>
              <span>Block the sender if you continue to receive messages</span>
            </li>
            <li className="flex items-start p-2 hover:bg-white rounded-md transition-colors duration-300">
              <div className="rounded-full bg-primary-100 p-1 mr-3">
                <CheckCircle className="h-4 w-4 text-primary-600" />
              </div>
              <span>Report the message to appropriate authorities</span>
            </li>
          </ul>
        </div>
      )}
      
      <div className={`flex gap-4 ${showContent ? 'slide-in-right' : 'opacity-0'}`} style={{transitionDelay: '500ms'}}>
        <Button 
          className="flex-1 relative overflow-hidden bg-gradient-shield hover:shadow-lg transition-all duration-300"
          onClick={onNewScan}
        >
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgcGF0dGVyblRyYW5zZm9ybT0icm90YXRlKDQ1KSI+PHJlY3Qgd2lkdGg9IjIiIGhlaWdodD0iMiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2EpIi8+PC9zdmc+')] opacity-20"></div>
          <div className="relative z-10 flex items-center justify-center">
            <RefreshCw className="h-5 w-5 mr-2" />
            <span className="font-medium">Scan New Content</span>
          </div>
        </Button>
        
        {threatLevel !== 'safe' && (
          <Button 
            variant="outline" 
            className="flex-1 border-gray-300 hover:border-primary-300 hover:bg-primary-50 transition-all duration-300"
          >
            <Flag className="h-5 w-5 mr-2 text-primary-500" />
            <span className="font-medium">Report</span>
          </Button>
        )}
      </div>
    </div>
  );
}
