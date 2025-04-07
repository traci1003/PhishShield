import React from 'react';
import { HighContrastMessage } from './high-contrast-message';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAccessibility } from '@/contexts/accessibility-context';

export const AccessibilityDemoMessages = () => {
  const { highContrast } = useAccessibility();
  
  // Demo message examples with various threat levels
  const demoMessages = [
    {
      id: 1,
      content: "Hello, this is a normal message from your friend. Let's meet up tomorrow for coffee!",
      sender: "Friend",
      threatLevel: "safe",
      threatDetails: {
        reasons: ["Message contains no suspicious elements"]
      },
      scanDate: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
    },
    {
      id: 2,
      content: "You've won a $500 Amazon gift card! Click here to claim: https://amaz0n-gift.scam/claim",
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
      content: "Your account will be deactivated in 24 hours. Verify your details at http://secure-bank.info/verify",
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

  return (
    <Card className={`mt-6 ${highContrast ? 'bg-black text-white border-white border-2' : ''}`}>
      <CardHeader>
        <CardTitle>Threat Visualization Demo</CardTitle>
        <CardDescription className={highContrast ? 'text-gray-300' : ''}>
          See how our high-contrast threat visualizations improve readability and comprehension
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className={`mb-4 ${highContrast ? 'text-white' : 'text-gray-600'}`}>
          The following examples show how messages are displayed in {highContrast ? 'high contrast' : 'standard'} mode, 
          with enhanced visibility for threat indicators.
        </p>
        
        <div className="space-y-4">
          {demoMessages.map(message => (
            <HighContrastMessage 
              key={message.id} 
              message={message} 
              highlightUrls={true}
              showFullDetails={true}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};