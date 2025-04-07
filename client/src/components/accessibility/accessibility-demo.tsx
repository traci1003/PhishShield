import React from 'react';
import { HighContrastMessage } from './high-contrast-message';
import { HighContrastContent } from './high-contrast-content';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useAccessibility } from '@/contexts/accessibility-context';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShieldCheck, ShieldX, AlertTriangle } from 'lucide-react';
import { HighContrastThreatVisualization } from './high-contrast-threat-visualization';

export const AccessibilityDemoMessages = () => {
  const { highContrast, colorBlindMode } = useAccessibility();
  
  // Demo message examples with various threat levels
  const demoMessages = [
    {
      id: 1,
      content: "Hello, this is a normal message from your friend. Let's meet up tomorrow for coffee! [Verified safe by PhishShield.AI.com]",
      sender: "Friend",
      threatLevel: "safe",
      threatDetails: {
        reasons: ["Message contains no suspicious elements"]
      },
      scanDate: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
    },
    {
      id: 2,
      content: "You've won a $500 Amazon gift card! Click here to claim: https://amaz0n-gift.scam/claim [Detected by PhishShield.AI.com]",
      sender: "Unknown",
      threatLevel: "phishing",
      threatDetails: {
        reasons: [
          "Contains suspicious URL 'amaz0n-gift.scam'",
          "Uses urgency tactics with 'won' and 'claim'",
          "Unsolicited prize notification"
        ]
      },
      scanDate: new Date(Date.now() - 7200000).toISOString() // 2 hours ago
    },
    {
      id: 3,
      content: "Your account will be deactivated in 24 hours. Verify your details at http://secure-bank.info/verify [Flagged by PhishShield.AI.com]",
      sender: "Security Team",
      threatLevel: "suspicious",
      threatDetails: {
        reasons: [
          "Domain 'secure-bank.info' doesn't match legitimate banking domains",
          "Creates urgency with 'deactivated' threat"
        ]
      },
      scanDate: new Date(Date.now() - 86400000).toISOString() // 1 day ago
    }
  ];

  // Enhanced examples for the new high-contrast content component
  const enhancedExamples = [
    {
      id: 1,
      content: "Thanks for signing up! Your account at securebank.com is now active. If you have any questions, reach out to our support team.",
      threatLevel: "safe",
      analysis: {
        suspiciousTerms: [],
        suspiciousUrls: []
      }
    },
    {
      id: 2,
      content: "URGENT: Your account has been locked due to unusual activity. Click here to reset: http://secur3-b4nk.com/reset",
      threatLevel: "phishing",
      analysis: {
        suspiciousTerms: ["URGENT", "locked", "unusual activity"],
        suspiciousUrls: ["secur3-b4nk.com"]
      }
    },
    {
      id: 3,
      content: "Your subscription renewal is pending. Please visit accounts.companyname.net/billing to update your payment information.",
      threatLevel: "suspicious",
      analysis: {
        suspiciousTerms: ["renewal", "pending"],
        suspiciousUrls: []
      }
    }
  ];

  return (
    <Card className={`mt-6 ${highContrast ? 'bg-black text-white border-white border-2' : ''}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className={highContrast ? 'text-white' : ''}>Accessibility Visualization Demo</span>
          {colorBlindMode !== 'none' && (
            <span className="text-sm bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
              {colorBlindMode} Mode Active
            </span>
          )}
        </CardTitle>
        <CardDescription className={highContrast ? 'text-gray-300' : ''}>
          See how our enhanced accessibility features improve readability and comprehension
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="enhanced">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="enhanced" className="w-1/2">Enhanced Visualization</TabsTrigger>
            <TabsTrigger value="standard" className="w-1/2">Standard Messages</TabsTrigger>
          </TabsList>
          
          <TabsContent value="enhanced" className="space-y-6">
            <p className={`mb-4 ${highContrast ? 'text-white' : 'text-gray-600'}`}>
              Our enhanced high-contrast visualization improves identification of threats with clear visual indicators, 
              better contrast ratios, and special formatting for suspicious content.
            </p>
            
            {enhancedExamples.map(example => (
              <div key={example.id} className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <HighContrastThreatVisualization 
                    threatLevel={example.threatLevel} 
                    showLabel={true}
                    size="sm"
                  />
                  <span className={`text-sm ${highContrast ? 'text-gray-300' : 'text-gray-500'}`}>
                    Enhanced Accessibility Example
                  </span>
                </div>
                
                <HighContrastContent 
                  content={example.content}
                  analysis={{
                    suspiciousTerms: example.analysis.suspiciousTerms,
                    suspiciousUrls: example.analysis.suspiciousUrls,
                    threatLevel: example.threatLevel
                  }}
                />
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="standard" className="space-y-4">
            <p className={`mb-4 ${highContrast ? 'text-white' : 'text-gray-600'}`}>
              The following examples show how messages are displayed in {highContrast ? 'high contrast' : 'standard'} mode, 
              with enhanced visibility for threat indicators.
            </p>
            
            <div className="space-y-6">
              {demoMessages.map(message => (
                <HighContrastMessage 
                  key={message.id} 
                  message={message} 
                  highlightUrls={true}
                  showFullDetails={true}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className={`pt-4 border-t ${highContrast ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className={`w-full text-center text-sm ${highContrast ? 'text-white' : 'text-gray-500'}`}>
          PhishShield.AI.com uses accessibility best practices to ensure protection for all users
        </div>
      </CardFooter>
    </Card>
  );
};