import React from 'react';
import { useAccessibility } from '@/contexts/accessibility-context';
import DOMPurify from 'dompurify';

interface HighContrastContentProps {
  content: string;
  analysis?: {
    suspiciousTerms?: string[];
    suspiciousUrls?: string[];
    threatLevel?: string;
  };
  className?: string;
}

/**
 * HighContrastContent component renders text content with high-contrast accessibility enhancements
 * and optional highlighting of suspicious elements based on threat analysis.
 */
export const HighContrastContent: React.FC<HighContrastContentProps> = ({
  content,
  analysis = {},
  className = '',
}) => {
  const { highContrast, colorBlindMode } = useAccessibility();
  const { suspiciousTerms = [], suspiciousUrls = [], threatLevel = 'safe' } = analysis;
  
  // Process the content for high-contrast mode and highlight suspicious elements
  const processContent = () => {
    let processedContent = content;
    
    // Enhance URLs with high-contrast formatting
    if (suspiciousUrls.length > 0) {
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      processedContent = processedContent.replace(urlRegex, (match) => {
        // Check if this URL is in the suspicious list
        const isSuspicious = suspiciousUrls.some(url => match.includes(url));
        
        if (isSuspicious) {
          return `<span class="${highContrast ? 'phishing-url-hc' : 'phishing-url'}">${match}</span>`;
        }
        return `<span class="url">${match}</span>`;
      });
    }
    
    // Highlight suspicious terms
    if (suspiciousTerms.length > 0) {
      suspiciousTerms.forEach(term => {
        const termRegex = new RegExp(`(${term})`, 'gi');
        processedContent = processedContent.replace(termRegex, 
          `<span class="${highContrast ? 'suspicious-term-hc' : 'suspicious-term'}">$1</span>`);
      });
    }
    
    return processedContent;
  };
  
  // Get the appropriate container class based on accessibility settings
  const getContainerClass = () => {
    const baseClass = 'p-4 rounded-lg';
    
    if (highContrast) {
      switch (threatLevel) {
        case 'safe':
          return `${baseClass} bg-black text-white border-green-500 border-2`;
        case 'suspicious':
          return `${baseClass} bg-black text-white border-yellow-500 border-2`;
        case 'phishing':
          return `${baseClass} bg-black text-white border-red-500 border-dashed border-2`;
        default:
          return `${baseClass} bg-black text-white border-white border-2`;
      }
    } else {
      switch (threatLevel) {
        case 'safe':
          return `${baseClass} bg-green-50 text-green-900 border border-green-200`;
        case 'suspicious':
          return `${baseClass} bg-amber-50 text-amber-900 border border-amber-200`;
        case 'phishing':
          return `${baseClass} bg-red-50 text-red-900 border border-red-200`;
        default:
          return `${baseClass} bg-white text-gray-900 border border-gray-200`;
      }
    }
  };
  
  return (
    <div className={`${getContainerClass()} ${className} whitespace-pre-wrap`} role="region" aria-label={`Message with ${threatLevel} threat level`}>
      {/* Apply appropriate text styles based on accessibility mode */}
      <div 
        className={`
          font-medium ${highContrast ? 'text-white leading-relaxed' : 'text-gray-800'}
          ${colorBlindMode !== 'none' ? 'text-base' : ''}
        `}
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(processContent()) }}
      />
    </div>
  );
};

// CSS classes to be added to index.css:
// 
// /* High Contrast URL Formatting */
// .high-contrast .phishing-url-hc {
//   @apply bg-red-600 text-white px-1 py-0.5 mx-0.5 rounded font-bold border-white border-2;
// }
// 
// .high-contrast .suspicious-term-hc {
//   @apply bg-yellow-500 text-black px-1 mx-0.5 rounded font-bold border-black border-2;
// }
// 
// /* Standard URL Formatting */
// .phishing-url {
//   @apply bg-red-100 text-red-800 px-1 py-0.5 mx-0.5 rounded-sm border border-red-300;
// }
// 
// .suspicious-term {
//   @apply bg-amber-100 text-amber-800 px-1 mx-0.5 rounded-sm border border-amber-300;
// }
// 
// .url {
//   @apply text-blue-600 underline;
// }