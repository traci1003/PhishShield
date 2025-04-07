import React from 'react';
import { useAccessibility } from '@/contexts/accessibility-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ThreatLegend } from './high-contrast-threat-visualization';
import { AccessibilityDemoMessages } from './accessibility-demo';
import { Eye, Zap, Palette } from 'lucide-react';

export default function AccessibilitySettings() {
  const { 
    highContrast, 
    toggleHighContrast, 
    largeText, 
    toggleLargeText, 
    reducedMotion, 
    toggleReducedMotion,
    colorBlindMode,
    setColorBlindMode
  } = useAccessibility();

  return (
    <div className="space-y-6 pb-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Accessibility Settings</CardTitle>
          <CardDescription>
            Customize your experience to improve usability and readability
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-primary" />
                <Label htmlFor="high-contrast" className="font-medium">High Contrast Mode</Label>
              </div>
              <Switch 
                id="high-contrast"
                checked={highContrast}
                onCheckedChange={toggleHighContrast}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Eye className="h-5 w-5 text-primary" />
                <Label htmlFor="large-text" className="font-medium">Large Text</Label>
              </div>
              <Switch 
                id="large-text"
                checked={largeText}
                onCheckedChange={toggleLargeText}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-primary"
                >
                  <path d="M22 12C22 12 19 18 12 18C5 18 2 12 2 12C2 12 5 6 12 6C19 6 22 12 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4 4L20 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={reducedMotion ? "" : "animate-pulse"}/>
                </svg>
                <Label htmlFor="reduced-motion" className="font-medium">Reduced Motion</Label>
              </div>
              <Switch 
                id="reduced-motion"
                checked={reducedMotion}
                onCheckedChange={toggleReducedMotion}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Palette className="h-5 w-5 text-primary" />
                <Label htmlFor="colorblind-mode" className="font-medium">Color Blind Mode</Label>
              </div>
              <Select 
                value={colorBlindMode} 
                onValueChange={(value) => setColorBlindMode(value as any)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="protanopia">Protanopia (Red-Blind)</SelectItem>
                  <SelectItem value="deuteranopia">Deuteranopia (Green-Blind)</SelectItem>
                  <SelectItem value="tritanopia">Tritanopia (Blue-Blind)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* High contrast threat visualization legend */}
      <Card className={highContrast ? 'bg-black text-white border-white border-2' : ''}>
        <CardHeader>
          <CardTitle className="text-xl font-bold">High Contrast Threat Visualization</CardTitle>
          <CardDescription className={highContrast ? 'text-gray-300' : ''}>
            Preview how threats will appear in {highContrast ? 'high contrast' : 'standard'} mode
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <p className={`${highContrast ? 'text-white' : 'text-gray-600'} mb-4`}>
              Our enhanced visualization system highlights potential threats with distinct colors, 
              bold text, and strong contrast to improve visibility for all users.
            </p>
          </div>
          <ThreatLegend />
        </CardContent>
      </Card>
      
      {/* Message visualization demo */}
      <AccessibilityDemoMessages />
    </div>
  );
}