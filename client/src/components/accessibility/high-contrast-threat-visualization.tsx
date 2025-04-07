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
  const { highContrast } = useAccessibility();

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
    const baseClasses = showBorder ? 'rounded-lg' : 'rounded-lg';
    
    if (highContrast) {
      switch (threatLevel.toLowerCase()) {
        case 'safe':
          return `${baseClasses} threat-safe`;
        case 'suspicious':
          return `${baseClasses} threat-suspicious`;
        case 'phishing':
          return `${baseClasses} threat-phishing`;
        default:
          return `${baseClasses} bg-gray-200 text-gray-800 border-2 border-gray-400`;
      }
    } else {
      switch (threatLevel.toLowerCase()) {
        case 'safe':
          return `${baseClasses} threat-safe`;
        case 'suspicious':
          return `${baseClasses} threat-suspicious`;
        case 'phishing':
          return `${baseClasses} threat-phishing`;
        default:
          return `${baseClasses} bg-gray-100 text-gray-800 border-gray-200`;
      }
    }
  };

  // Get the icon component based on threat level
  const getIcon = () => {
    const iconClass = highContrast 
      ? `threat-${threatLevel.toLowerCase()}-icon` 
      : `threat-${threatLevel.toLowerCase()}-icon`;

    switch (threatLevel.toLowerCase()) {
      case 'safe':
        return <ShieldCheck className={iconClass} size={iconSize[size]} />;
      case 'suspicious':
        return <ShieldAlert className={iconClass} size={iconSize[size]} />;
      case 'phishing':
        return <ShieldX className={iconClass} size={iconSize[size]} />;
      default:
        return <Shield className="text-gray-500" size={iconSize[size]} />;
    }
  };

  // Get the label text based on threat level
  const getLabel = () => {
    switch (threatLevel.toLowerCase()) {
      case 'safe':
        return 'Safe';
      case 'suspicious':
        return 'Suspicious';
      case 'phishing':
        return 'Phishing';
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
    <div className={`p-3 rounded-lg ${highContrast ? 'bg-black border-white border-2' : 'bg-white shadow-sm'} flex flex-col gap-3`}>
      <h3 className={`text-lg font-semibold ${highContrast ? 'text-white' : 'text-gray-800'}`}>
        PhishShield.AI.com Threat Legend
      </h3>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <HighContrastThreatVisualization threatLevel="safe" />
          <span className={`text-sm ${highContrast ? 'text-white' : 'text-gray-600'}`}>
            Verified by PhishShield.AI.com
          </span>
        </div>
        <div className="flex items-center justify-between">
          <HighContrastThreatVisualization threatLevel="suspicious" />
          <span className={`text-sm ${highContrast ? 'text-white' : 'text-gray-600'}`}>
            Flagged by PhishShield.AI.com
          </span>
        </div>
        <div className="flex items-center justify-between">
          <HighContrastThreatVisualization threatLevel="phishing" />
          <span className={`text-sm ${highContrast ? 'text-white' : 'text-gray-600'}`}>
            Detected by PhishShield.AI.com
          </span>
        </div>
      </div>
    </div>
  );
};