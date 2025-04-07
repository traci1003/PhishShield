import React from 'react';
import { useAccessibility } from '@/contexts/accessibility-context';
import { Shield, ShieldAlert, ShieldCheck, ShieldX } from 'lucide-react';

interface ThreatVisualizationProps {
  threatLevel: string;
  size?: 'sm' | 'md' | 'lg';
  showBorder?: boolean;
  showLabel?: boolean;
  showIcon?: boolean;
  className?: string;
}

export const HighContrastThreatVisualization: React.FC<ThreatVisualizationProps> = ({
  threatLevel,
  size = 'md',
  showBorder = true,
  showLabel = true,
  showIcon = true,
  className = '',
}) => {
  const { highContrast, colorBlindMode } = useAccessibility();

  // Determine the size classes
  const sizeClasses = {
    sm: 'p-1.5 text-sm',
    md: 'p-2 text-base',
    lg: 'p-3 text-lg',
  };

  // Determine the icon size
  const iconSize = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  // Get the appropriate classes based on threat level and high contrast mode
  const getBgClasses = () => {
    // Base classes with good rounded corners for accessibility
    const baseClasses = 'rounded-lg';
    
    if (highContrast) {
      switch (threatLevel.toLowerCase()) {
        case 'safe':
          return `${baseClasses} bg-green-800 text-white border-white border-2 font-bold`;
        case 'suspicious':
          return `${baseClasses} bg-yellow-500 text-black border-black border-2 font-bold`;
        case 'phishing':
          return `${baseClasses} bg-red-800 text-white border-white border-2 font-bold`;
        default:
          return `${baseClasses} bg-gray-200 text-gray-800 border-2 border-gray-400`;
      }
    } else {
      switch (threatLevel.toLowerCase()) {
        case 'safe':
          return `${baseClasses} bg-green-100 text-green-800 border border-green-300`;
        case 'suspicious':
          return `${baseClasses} bg-amber-100 text-amber-800 border border-amber-300`;
        case 'phishing':
          return `${baseClasses} bg-red-100 text-red-800 border border-red-300`;
        default:
          return `${baseClasses} bg-gray-100 text-gray-800 border border-gray-300`;
      }
    }
  };

  // Get the icon component based on threat level
  const getIcon = () => {
    if (highContrast) {
      switch (threatLevel.toLowerCase()) {
        case 'safe':
          return (
            <div className="flex items-center justify-center rounded-full bg-white w-6 h-6">
              <ShieldCheck className="text-green-800" size={iconSize[size] - 6} />
            </div>
          );
        case 'suspicious':
          return (
            <div className="flex items-center justify-center rounded-full bg-black w-6 h-6">
              <ShieldAlert className="text-yellow-500" size={iconSize[size] - 6} />
            </div>
          );
        case 'phishing':
          return (
            <div className="flex items-center justify-center rounded-full bg-white w-6 h-6">
              <ShieldX className="text-red-800" size={iconSize[size] - 6} />
            </div>
          );
        default:
          return <Shield className="text-gray-500" size={iconSize[size]} />;
      }
    } else {
      switch (threatLevel.toLowerCase()) {
        case 'safe':
          return <ShieldCheck className="text-green-600" size={iconSize[size]} />;
        case 'suspicious':
          return <ShieldAlert className="text-amber-600" size={iconSize[size]} />;
        case 'phishing':
          return <ShieldX className="text-red-600" size={iconSize[size]} />;
        default:
          return <Shield className="text-gray-500" size={iconSize[size]} />;
      }
    }
  };

  // Get the label text based on threat level
  const getLabel = () => {
    switch (threatLevel.toLowerCase()) {
      case 'safe':
        return highContrast ? 'SAFE' : 'Safe';
      case 'suspicious':
        return highContrast ? 'SUSPICIOUS' : 'Suspicious';
      case 'phishing':
        return highContrast ? 'PHISHING' : 'Phishing';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className={`inline-flex items-center ${getBgClasses()} ${sizeClasses[size]} ${className}`} 
         role="status" aria-label={`Threat level: ${threatLevel}`}>
      {showIcon && (
        <div className="mr-2 flex-shrink-0">
          {getIcon()}
        </div>
      )}
      {showLabel && (
        <div className={`font-medium ${highContrast ? 'font-bold' : ''}`}>
          {getLabel()}
        </div>
      )}
    </div>
  );
};

// Export a pattern component that displays different threats in a row, useful for legend displays
export const ThreatLegend: React.FC = () => {
  const { highContrast } = useAccessibility();
  
  return (
    <div 
      className={`p-5 rounded-lg ${highContrast ? 'bg-black border-white border-2' : 'bg-white shadow-sm'} flex flex-col gap-4`}
      role="region"
      aria-label="Threat visualization legend"
    >
      <h3 className={`text-lg font-semibold ${highContrast ? 'text-white' : 'text-gray-800'}`}>
        PhishShield.AI.com Threat Legend
      </h3>
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-4">
          <HighContrastThreatVisualization threatLevel="safe" size="md" />
          <div className="flex flex-col">
            <span className={`font-medium ${highContrast ? 'text-white' : 'text-gray-700'}`}>
              Safe Content
            </span>
            <span className={`text-sm ${highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
              Verified by PhishShield.AI.com
            </span>
          </div>
        </div>
        <div className={`h-px w-full ${highContrast ? 'bg-gray-700' : 'bg-gray-200'}`} role="separator" />
        
        <div className="flex items-center gap-4">
          <HighContrastThreatVisualization threatLevel="suspicious" size="md" />
          <div className="flex flex-col">
            <span className={`font-medium ${highContrast ? 'text-white' : 'text-gray-700'}`}>
              Suspicious Content
            </span>
            <span className={`text-sm ${highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
              Flagged by PhishShield.AI.com
            </span>
          </div>
        </div>
        <div className={`h-px w-full ${highContrast ? 'bg-gray-700' : 'bg-gray-200'}`} role="separator" />
        
        <div className="flex items-center gap-4">
          <HighContrastThreatVisualization threatLevel="phishing" size="md" />
          <div className="flex flex-col">
            <span className={`font-medium ${highContrast ? 'text-white' : 'text-gray-700'}`}>
              Phishing Attempt
            </span>
            <span className={`text-sm ${highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
              Detected and blocked by PhishShield.AI.com
            </span>
          </div>
        </div>
      </div>
      
      {highContrast && (
        <div className="mt-2 pt-3 border-t border-gray-700 text-xs text-gray-300">
          High contrast mode enabled for maximum visibility and accessibility
        </div>
      )}
    </div>
  );
};