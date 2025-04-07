import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAccessibility } from '@/contexts/accessibility-context';
import { Shield, Download, Share, ChevronLeft, ChevronRight } from 'lucide-react';

interface MascotPart {
  id: string;
  name: string;
  options: {
    id: string;
    preview: string; // This would be an SVG string in a real implementation
    name: string;
  }[];
}

export const SecurityMascot: React.FC = () => {
  const { highContrast } = useAccessibility();
  
  // State for selected mascot parts
  const [selectedHead, setSelectedHead] = useState('head1');
  const [selectedBody, setSelectedBody] = useState('body1');
  const [selectedAccessory, setSelectedAccessory] = useState('shield1');
  const [selectedColor, setSelectedColor] = useState('#6366f1'); // Default indigo
  const [mascotName, setMascotName] = useState('PhishGuard');
  
  // Mascot customization options
  const mascotParts: MascotPart[] = [
    {
      id: 'head',
      name: 'Head Style',
      options: [
        {
          id: 'head1',
          preview: 'Head 1 SVG',
          name: 'Heroic'
        },
        {
          id: 'head2',
          preview: 'Head 2 SVG',
          name: 'Friendly'
        },
        {
          id: 'head3',
          preview: 'Head 3 SVG',
          name: 'Wise'
        }
      ]
    },
    {
      id: 'body',
      name: 'Body Type',
      options: [
        {
          id: 'body1',
          preview: 'Body 1 SVG',
          name: 'Defender'
        },
        {
          id: 'body2',
          preview: 'Body 2 SVG',
          name: 'Guardian'
        },
        {
          id: 'body3',
          preview: 'Body 3 SVG',
          name: 'Sentinel'
        }
      ]
    },
    {
      id: 'accessory',
      name: 'Accessory',
      options: [
        {
          id: 'shield1',
          preview: 'Shield 1 SVG',
          name: 'Guardian Shield'
        },
        {
          id: 'sword1',
          preview: 'Sword 1 SVG',
          name: 'Phish Slayer'
        },
        {
          id: 'glasses1',
          preview: 'Glasses 1 SVG',
          name: 'Cyber Vision'
        }
      ]
    }
  ];
  
  // Color options
  const colorOptions = [
    { name: 'Indigo', value: '#6366f1' },
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Green', value: '#10b981' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Orange', value: '#f97316' }
  ];
  
  // Mascot name suggestions
  const nameOptions = [
    "PhishGuard",
    "CyberSentinel",
    "ShieldMaster",
    "SecuriTron",
    "PixelProtector"
  ];
  
  // Handle selection changes
  const handlePartSelection = (partType: string, optionId: string) => {
    switch (partType) {
      case 'head':
        setSelectedHead(optionId);
        break;
      case 'body':
        setSelectedBody(optionId);
        break;
      case 'accessory':
        setSelectedAccessory(optionId);
        break;
      default:
        break;
    }
  };
  
  // Placeholder for mascot SVG
  const renderMascotPreview = () => {
    // In a real implementation, we would combine SVG parts here
    return (
      <div className="flex justify-center items-center py-8">
        <div 
          className="w-64 h-64 rounded-full flex items-center justify-center text-white" 
          style={{ backgroundColor: selectedColor }}
        >
          <div className="text-center">
            <Shield className="h-20 w-20 mx-auto mb-2" />
            <div className="text-lg font-bold">{mascotName}</div>
            <div className="text-xs mt-1">Your Security Buddy</div>
          </div>
        </div>
      </div>
    );
  };
  
  // Placeholder for mascot downloading
  const handleDownloadMascot = () => {
    alert("In a real implementation, this would download your mascot as an image file.");
  };
  
  // Placeholder for mascot sharing
  const handleShareMascot = () => {
    alert("In a real implementation, this would share your mascot on social media or via link.");
  };
  
  // Part selection carousel
  const renderPartSelector = (part: MascotPart) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const options = part.options;
    
    const nextOption = () => {
      setCurrentIndex((currentIndex + 1) % options.length);
      handlePartSelection(part.id, options[(currentIndex + 1) % options.length].id);
    };
    
    const prevOption = () => {
      setCurrentIndex((currentIndex - 1 + options.length) % options.length);
      handlePartSelection(part.id, options[(currentIndex - 1 + options.length) % options.length].id);
    };
    
    return (
      <div className="mb-4">
        <h3 className={`text-sm font-medium mb-2 ${highContrast ? 'text-white' : ''}`}>{part.name}</h3>
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={prevOption} className={highContrast ? 'text-white' : ''}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className={`flex-1 text-center p-2 rounded-md ${highContrast ? 'bg-gray-800' : 'bg-gray-100'}`}>
            {options[currentIndex].name}
          </div>
          
          <Button variant="ghost" size="icon" onClick={nextOption} className={highContrast ? 'text-white' : ''}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };
  
  // Color selection
  const renderColorSelector = () => {
    return (
      <div className="mb-4">
        <h3 className={`text-sm font-medium mb-2 ${highContrast ? 'text-white' : ''}`}>Color Theme</h3>
        <div className="flex flex-wrap gap-2">
          {colorOptions.map(color => (
            <button
              key={color.value}
              className={`w-8 h-8 rounded-full transition-transform ${
                selectedColor === color.value ? 'ring-2 ring-offset-2 ring-primary scale-110' : ''
              }`}
              style={{ backgroundColor: color.value }}
              onClick={() => setSelectedColor(color.value)}
              title={color.name}
            />
          ))}
        </div>
      </div>
    );
  };
  
  // Name selection
  const renderNameSelector = () => {
    return (
      <div className="mb-4">
        <h3 className={`text-sm font-medium mb-2 ${highContrast ? 'text-white' : ''}`}>Mascot Name</h3>
        <div className="flex flex-wrap gap-2">
          {nameOptions.map(name => (
            <button
              key={name}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                mascotName === name 
                  ? highContrast 
                    ? 'bg-primary text-white' 
                    : 'bg-primary-100 text-primary-800 border border-primary-200' 
                  : highContrast 
                    ? 'bg-gray-800 text-white hover:bg-gray-700' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
              onClick={() => setMascotName(name)}
            >
              {name}
            </button>
          ))}
        </div>
      </div>
    );
  };
  
  return (
    <Card className={highContrast ? 'bg-black text-white border-white border-2' : ''}>
      <CardHeader>
        <CardTitle>Customize Your Security Mascot</CardTitle>
        <CardDescription className={highContrast ? 'text-gray-300' : ''}>
          Create your own security companion to guide you through PhishShield.AI.com
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="customize">
          <TabsList className="mb-4">
            <TabsTrigger value="customize">Customize</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="tutorials">Tutorials</TabsTrigger>
          </TabsList>
          
          <TabsContent value="customize" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                {renderMascotPreview()}
              </div>
              
              <div className="space-y-4">
                {mascotParts.map(part => (
                  <div key={part.id}>
                    {renderPartSelector(part)}
                  </div>
                ))}
                
                {renderColorSelector()}
                {renderNameSelector()}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="preview">
            <div className="text-center py-6">
              {renderMascotPreview()}
              
              <div className={`max-w-md mx-auto mt-6 p-4 rounded-lg ${
                highContrast ? 'bg-gray-900' : 'bg-gray-50'
              }`}>
                <h3 className={`text-lg font-bold mb-2 ${highContrast ? 'text-white' : ''}`}>
                  Meet {mascotName}!
                </h3>
                <p className={`mb-4 ${highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
                  Your personal security guide that will help protect you from online threats and phishing attacks.
                </p>
                
                <div className="flex justify-center gap-3">
                  <Button 
                    variant="outline" 
                    onClick={handleDownloadMascot}
                    className={highContrast ? 'border-gray-700 text-white' : ''}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button onClick={handleShareMascot}>
                    <Share className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="tutorials">
            <div className={`p-4 rounded-lg ${
              highContrast ? 'bg-gray-900' : 'bg-gray-50'
            }`}>
              <h3 className={`text-lg font-bold mb-2 ${highContrast ? 'text-white' : ''}`}>
                Interactive Tutorials with {mascotName}
              </h3>
              <p className={`mb-4 ${highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
                Your mascot will guide you through these personalized security tutorials:
              </p>
              
              <ul className="space-y-3">
                {[
                  "Introduction to Phishing Defense",
                  "Recognizing Suspicious Links",
                  "Password Security Basics",
                  "Social Engineering Awareness",
                  "Safe Online Shopping"
                ].map((tutorial, index) => (
                  <li 
                    key={index} 
                    className={`p-3 rounded-md ${
                      highContrast 
                        ? index === 0 ? 'bg-gray-800 border-l-4 border-primary' : 'bg-gray-800' 
                        : index === 0 ? 'bg-white shadow-sm border-l-4 border-primary' : 'bg-white shadow-sm'
                    } flex items-center justify-between`}
                  >
                    <span className={highContrast ? 'text-white' : ''}>
                      {tutorial}
                    </span>
                    <Button 
                      size="sm"
                      variant={index === 0 ? "default" : "outline"}
                      className={index === 0 ? "" : highContrast ? "border-gray-700 text-white" : ""}
                    >
                      {index === 0 ? "Continue" : "Start"}
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className={`flex justify-between border-t ${highContrast ? 'border-gray-800' : ''} pt-4`}>
        <div className={`text-sm ${highContrast ? 'text-gray-400' : 'text-gray-500'}`}>
          Your mascot will appear in tutorials and alerts
        </div>
        <Button variant="outline" className={highContrast ? 'border-gray-700 text-white' : ''}>
          Save Mascot
        </Button>
      </CardFooter>
    </Card>
  );
};