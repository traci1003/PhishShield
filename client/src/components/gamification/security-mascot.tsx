import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useAccessibility } from '@/contexts/accessibility-context';
import { Shield, AlertOctagon, Lightbulb, MessageCircle } from 'lucide-react';

interface MascotProps {
  onStartTutorial?: () => void;
  className?: string;
}

type MascotCharacter = 'shield-guardian' | 'cyber-owl' | 'tech-fox' | 'data-dolphin';
type MascotColor = 'blue' | 'purple' | 'teal' | 'orange';
type MascotPersonality = 'friendly' | 'expert' | 'vigilant' | 'quirky';

export const SecurityMascot: React.FC<MascotProps> = ({ 
  onStartTutorial,
  className = '' 
}) => {
  const { highContrast } = useAccessibility();
  const [character, setCharacter] = useState<MascotCharacter>('shield-guardian');
  const [color, setColor] = useState<MascotColor>('purple');
  const [personality, setPersonality] = useState<MascotPersonality>('friendly');
  const [showCustomization, setShowCustomization] = useState(false);
  
  // Map personalities to different mascot messages
  const personalityMessages = {
    friendly: "Hi there! I'm your PhishShield buddy! Want to learn how to stay safe online?",
    expert: "Welcome to PhishShield.AI.com. I recommend starting with our advanced security assessment.",
    vigilant: "Alert! 60% of users fall victim to phishing. Let me help you avoid becoming a statistic.",
    quirky: "Ahoy, digital explorer! Ready to become a cyber-superhero? Let's shield you from those sneaky phish!"
  };
  
  // Map characters to their visual representation (using simple components for now)
  const renderMascotCharacter = () => {
    const colorClasses = {
      blue: highContrast ? 'text-blue-300' : 'text-blue-500',
      purple: highContrast ? 'text-purple-300' : 'text-purple-500',
      teal: highContrast ? 'text-teal-300' : 'text-teal-500',
      orange: highContrast ? 'text-orange-300' : 'text-orange-500'
    };
    
    const colorClass = colorClasses[color];
    
    switch(character) {
      case 'shield-guardian':
        return (
          <div className={`flex items-center justify-center rounded-full p-6 bg-opacity-20 ${
            highContrast ? 'bg-gray-800' : `bg-${color}-100`
          }`}>
            <Shield className={`h-16 w-16 ${colorClass}`} />
          </div>
        );
      case 'cyber-owl':
        return (
          <div className={`flex items-center justify-center rounded-full p-6 bg-opacity-20 ${
            highContrast ? 'bg-gray-800' : `bg-${color}-100`
          }`}>
            <AlertOctagon className={`h-16 w-16 ${colorClass}`} />
          </div>
        );
      case 'tech-fox':
        return (
          <div className={`flex items-center justify-center rounded-full p-6 bg-opacity-20 ${
            highContrast ? 'bg-gray-800' : `bg-${color}-100`
          }`}>
            <Lightbulb className={`h-16 w-16 ${colorClass}`} />
          </div>
        );
      case 'data-dolphin':
        return (
          <div className={`flex items-center justify-center rounded-full p-6 bg-opacity-20 ${
            highContrast ? 'bg-gray-800' : `bg-${color}-100`
          }`}>
            <MessageCircle className={`h-16 w-16 ${colorClass}`} />
          </div>
        );
      default:
        return null;
    }
  };
  
  const characterNames = {
    'shield-guardian': 'Shield Guardian',
    'cyber-owl': 'Cyber Owl',
    'tech-fox': 'Tech Fox',
    'data-dolphin': 'Data Dolphin'
  };
  
  return (
    <Card className={`${className} ${
      highContrast ? 'bg-black text-white border-white border-2' : ''
    }`}>
      <CardHeader className="text-center">
        <CardTitle className={`text-xl ${highContrast ? 'text-white' : ''}`}>
          Your Security Guide
        </CardTitle>
        <CardDescription className={highContrast ? 'text-gray-400' : ''}>
          Customize your PhishShield.AI.com personal security mascot
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex flex-col items-center">
          {renderMascotCharacter()}
          
          <div className="mt-4 p-4 rounded-lg text-center max-w-sm mx-auto bg-opacity-20 
            border border-dashed border-opacity-50 
            animate-pulse-slow
            ${highContrast ? 'bg-gray-800 border-gray-600' : `bg-${color}-50 border-${color}-200`}">
            <p className={`${highContrast ? 'text-white' : ''}`}>
              {personalityMessages[personality]}
            </p>
          </div>
        </div>
        
        {showCustomization && (
          <div className={`mt-6 p-4 rounded-lg ${
            highContrast ? 'bg-gray-900' : 'bg-gray-50'
          }`}>
            <h3 className={`text-lg font-medium mb-4 ${
              highContrast ? 'text-white' : ''
            }`}>
              Customize Your Mascot
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="character" className={highContrast ? 'text-white' : ''}>
                  Character
                </Label>
                <Select 
                  value={character} 
                  onValueChange={(value) => setCharacter(value as MascotCharacter)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select character" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="shield-guardian">Shield Guardian</SelectItem>
                    <SelectItem value="cyber-owl">Cyber Owl</SelectItem>
                    <SelectItem value="tech-fox">Tech Fox</SelectItem>
                    <SelectItem value="data-dolphin">Data Dolphin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="color" className={highContrast ? 'text-white' : ''}>
                  Color
                </Label>
                <div className="flex space-x-2">
                  <button 
                    className={`w-8 h-8 rounded-full bg-blue-500 ${
                      color === 'blue' ? 'ring-2 ring-offset-2' : ''
                    }`}
                    onClick={() => setColor('blue')}
                    aria-label="Blue color"
                  />
                  <button 
                    className={`w-8 h-8 rounded-full bg-purple-500 ${
                      color === 'purple' ? 'ring-2 ring-offset-2' : ''
                    }`}
                    onClick={() => setColor('purple')}
                    aria-label="Purple color"
                  />
                  <button 
                    className={`w-8 h-8 rounded-full bg-teal-500 ${
                      color === 'teal' ? 'ring-2 ring-offset-2' : ''
                    }`}
                    onClick={() => setColor('teal')}
                    aria-label="Teal color"
                  />
                  <button 
                    className={`w-8 h-8 rounded-full bg-orange-500 ${
                      color === 'orange' ? 'ring-2 ring-offset-2' : ''
                    }`}
                    onClick={() => setColor('orange')}
                    aria-label="Orange color"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="personality" className={highContrast ? 'text-white' : ''}>
                  Personality
                </Label>
                <RadioGroup 
                  value={personality}
                  onValueChange={(value) => setPersonality(value as MascotPersonality)}
                  className="grid grid-cols-2 gap-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="friendly" id="friendly" />
                    <Label htmlFor="friendly" className={highContrast ? 'text-white' : ''}>Friendly</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="expert" id="expert" />
                    <Label htmlFor="expert" className={highContrast ? 'text-white' : ''}>Expert</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="vigilant" id="vigilant" />
                    <Label htmlFor="vigilant" className={highContrast ? 'text-white' : ''}>Vigilant</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="quirky" id="quirky" />
                    <Label htmlFor="quirky" className={highContrast ? 'text-white' : ''}>Quirky</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col sm:flex-row gap-2">
        <Button 
          variant="outline" 
          onClick={() => setShowCustomization(!showCustomization)}
          className={`w-full ${highContrast ? 'text-white border-white' : ''}`}
        >
          {showCustomization ? 'Hide Customization' : 'Customize Mascot'}
        </Button>
        <Button 
          onClick={onStartTutorial} 
          className="w-full"
        >
          Start Tutorial
        </Button>
      </CardFooter>
    </Card>
  );
};

interface MascotTutorialProps {
  character: MascotCharacter;
  color: MascotColor;
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onBack: () => void;
  onComplete: () => void;
}

export const SecurityMascotTutorial: React.FC<MascotTutorialProps> = ({
  character,
  color,
  currentStep,
  totalSteps,
  onNext,
  onBack,
  onComplete
}) => {
  const { highContrast } = useAccessibility();
  
  // Tutorial content based on steps
  const tutorialSteps = [
    {
      title: "Welcome to PhishShield.AI.com",
      content: "I'll guide you through protecting yourself from online threats. Let's get started!",
    },
    {
      title: "Recognizing Phishing Emails",
      content: "Phishing emails often have spelling errors, suspicious links, and create a sense of urgency.",
    },
    {
      title: "URL Safety",
      content: "Always check the URL before clicking. Hover over links to see where they really go.",
    },
    {
      title: "Social Media Protection",
      content: "Be careful with messages from strangers or unexpected requests from friends.",
    },
    {
      title: "You're Protected!",
      content: "Great job! You've completed the basic security tutorial. Keep using PhishShield.AI.com to stay safe.",
    }
  ];
  
  const currentTutorial = tutorialSteps[currentStep - 1];
  
  return (
    <Card className={highContrast ? 'bg-black text-white border-white border-2' : ''}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className={highContrast ? 'text-white' : ''}>
            {currentTutorial.title}
          </CardTitle>
          <Badge className={highContrast ? 'bg-white text-black' : ''}>
            Step {currentStep}/{totalSteps}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className={`rounded-full p-3 ${
            highContrast ? 'bg-gray-800' : `bg-${color}-100`
          }`}>
            {character === 'shield-guardian' && (
              <Shield className={`h-6 w-6 ${
                highContrast ? `text-${color}-300` : `text-${color}-500`
              }`} />
            )}
            {/* Add other character renderings */}
          </div>
          <div className={`p-3 rounded-lg ${
            highContrast ? 'bg-gray-800' : 'bg-gray-100'
          }`}>
            <p className={highContrast ? 'text-white' : ''}>
              {currentTutorial.content}
            </p>
          </div>
        </div>
        
        {/* Tutorial content visualization */}
        <div className={`mt-4 p-4 rounded-lg ${
          highContrast ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border border-gray-200'
        }`}>
          {/* Tutorial visuals would go here */}
          <div className="h-40 flex items-center justify-center">
            <p className={`text-center ${highContrast ? 'text-gray-400' : 'text-gray-500'}`}>
              Interactive tutorial content for step {currentStep}
            </p>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={onBack} 
          disabled={currentStep === 1}
          className={highContrast ? 'text-white border-white' : ''}
        >
          Back
        </Button>
        
        {currentStep < totalSteps ? (
          <Button onClick={onNext}>
            Next
          </Button>
        ) : (
          <Button onClick={onComplete}>
            Complete
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

// Import missing Badge component
function Badge({ children, className = '' }) {
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold bg-primary text-primary-foreground ${className}`}>
      {children}
    </span>
  );
}