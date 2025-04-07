import React from 'react';
import { useAccessibility } from '@/contexts/accessibility-context';
import { Card, CardContent } from '@/components/ui/card';
import { HighContrastThreatVisualization } from './high-contrast-threat-visualization';
import { formatDistanceToNow } from 'date-fns';

interface MessageProps {
  message: {
    id: number;
    content: string;
    sender: string;
    threatLevel: string;
    threatDetails: {
      reasons: string[];
    };
    scanDate: string;
  };
  highlightUrls?: boolean;
  showFullDetails?: boolean;
}

export const HighContrastMessage: React.FC<MessageProps> = ({
  message,
  highlightUrls = true,
  showFullDetails = false,
}) => {
  const { highContrast } = useAccessibility();
  
  // Format the scan date
  const formattedDate = formatDistanceToNow(new Date(message.scanDate), { addSuffix: true });
  
  // Highlight the suspicious parts of the message if needed
  const getHighlightedContent = () => {
    if (!highlightUrls) return message.content;
    
    let content = message.content;
    
    // Regex pattern for URLs (simplified)
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    
    // Apply different highlights based on threat level
    if (message.threatLevel === 'phishing') {
      content = content.replace(urlPattern, '<span class="phishing-link">$1</span>');
    } else if (message.threatLevel === 'suspicious') {
      content = content.replace(urlPattern, '<span class="suspicious-link">$1</span>');
    }
    
    // Apply highlights for specific trigger words based on reasons
    message.threatDetails.reasons.forEach(reason => {
      // Extract keywords from the reason (simplified version)
      const keywordMatch = reason.match(/['"]([^'"]+)['"]/);
      if (keywordMatch && keywordMatch[1]) {
        const keyword = keywordMatch[1];
        const keywordRegex = new RegExp(`(${keyword})`, 'gi');
        content = content.replace(keywordRegex, '<span class="bg-warning-100">$1</span>');
      }
    });
    
    return content;
  };
  
  // Get appropriate card style based on threat level and accessibility mode
  const getCardStyle = () => {
    const baseClass = 'mb-3 w-full overflow-hidden ';
    
    if (highContrast) {
      switch (message.threatLevel.toLowerCase()) {
        case 'safe':
          return `${baseClass} message-threat-indicator threat-safe`;
        case 'suspicious':
          return `${baseClass} message-threat-indicator threat-suspicious`;
        case 'phishing':
          return `${baseClass} message-threat-indicator threat-phishing`;
        default:
          return `${baseClass} border-l-8 border-l-gray-400 bg-gray-100`;
      }
    } else {
      // Standard styles for normal mode
      switch (message.threatLevel.toLowerCase()) {
        case 'safe':
          return `${baseClass} border-l-4 border-l-green-500 bg-green-50`;
        case 'suspicious':
          return `${baseClass} border-l-4 border-l-amber-500 bg-amber-50`;
        case 'phishing':
          return `${baseClass} border-l-4 border-l-red-500 bg-red-50`;
        default:
          return `${baseClass} border-l-4 border-l-gray-400 bg-gray-100`;
      }
    }
  };
  
  return (
    <Card className={getCardStyle()}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="font-semibold">
            {message.sender}
          </div>
          <HighContrastThreatVisualization 
            threatLevel={message.threatLevel} 
            size="sm"
            showBorder={true}
          />
        </div>
        
        <div 
          className="mb-3 whitespace-pre-wrap break-words"
          dangerouslySetInnerHTML={{ __html: getHighlightedContent() }}
        />
        
        {showFullDetails && (
          <div className={`mt-4 p-3 rounded-md ${highContrast ? 'bg-black text-white' : 'bg-gray-100'}`}>
            <h4 className={`font-semibold mb-2 ${highContrast ? 'text-white' : 'text-gray-800'}`}>
              PhishShield.AI.com Analysis:
            </h4>
            <ul className="list-disc pl-5 space-y-1">
              {message.threatDetails.reasons.map((reason, index) => (
                <li key={index} className={highContrast ? 'text-white font-medium' : 'text-gray-700'}>
                  {reason}
                </li>
              ))}
            </ul>
            <div className={`mt-3 pt-2 border-t ${highContrast ? 'border-gray-700 text-gray-300' : 'border-gray-200 text-gray-500'} text-xs`}>
              Protected by PhishShield.AI.com | Advanced Threat Analysis
            </div>
          </div>
        )}
        
        <div className={`text-xs mt-3 ${highContrast ? 'text-white opacity-90' : 'text-gray-500'}`}>
          Scanned {formattedDate}
        </div>
      </CardContent>
    </Card>
  );
};