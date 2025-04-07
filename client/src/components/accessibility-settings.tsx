import { useState } from 'react';
import { useAccessibility } from '@/contexts/accessibility-context';
import { 
  AccessibilityIcon, 
  Eye, 
  ZoomIn, 
  MoveHorizontal, 
  Palette,
  Check,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function AccessibilitySettings() {
  const [open, setOpen] = useState(false);
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full"
          aria-label="Accessibility settings"
        >
          <AccessibilityIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Accessibility Settings</DialogTitle>
          <DialogDescription>
            Customize the app display for better visibility and usability
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Eye className="h-5 w-5 text-gray-500" />
              <div>
                <Label htmlFor="high-contrast" className="text-base">High Contrast Mode</Label>
                <p className="text-sm text-gray-500">
                  Enhanced visual distinction with prominent colors
                </p>
              </div>
            </div>
            <Switch 
              id="high-contrast" 
              checked={highContrast}
              onCheckedChange={toggleHighContrast}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ZoomIn className="h-5 w-5 text-gray-500" />
              <div>
                <Label htmlFor="large-text" className="text-base">Large Text</Label>
                <p className="text-sm text-gray-500">
                  Increases text size for better readability
                </p>
              </div>
            </div>
            <Switch 
              id="large-text" 
              checked={largeText}
              onCheckedChange={toggleLargeText}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MoveHorizontal className="h-5 w-5 text-gray-500" />
              <div>
                <Label htmlFor="reduced-motion" className="text-base">Reduced Motion</Label>
                <p className="text-sm text-gray-500">
                  Minimizes animations and transitions
                </p>
              </div>
            </div>
            <Switch 
              id="reduced-motion" 
              checked={reducedMotion}
              onCheckedChange={toggleReducedMotion}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Palette className="h-5 w-5 text-gray-500" />
              <div>
                <Label htmlFor="color-blind-mode" className="text-base">Color Blind Mode</Label>
                <p className="text-sm text-gray-500">
                  Adjusts colors for different types of color vision
                </p>
              </div>
            </div>
            <Select 
              value={colorBlindMode} 
              onValueChange={(value) => setColorBlindMode(value as any)}
            >
              <SelectTrigger id="color-blind-mode" className="w-36">
                <SelectValue placeholder="None" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="protanopia">Protanopia</SelectItem>
                <SelectItem value="deuteranopia">Deuteranopia</SelectItem>
                <SelectItem value="tritanopia">Tritanopia</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-4 border-t pt-4">
          <h3 className="font-semibold">Threat Visualization Preview</h3>
          <div className="grid grid-cols-1 gap-3">
            <div className={`p-3 rounded-md flex items-center threat-safe ${highContrast ? 'high-contrast' : ''}`}>
              <div className={`mr-2 threat-safe-icon ${highContrast ? 'high-contrast' : ''}`}>
                <Check className="h-4 w-4" />
              </div>
              <span>Safe Content</span>
            </div>
            
            <div className={`p-3 rounded-md flex items-center threat-suspicious ${highContrast ? 'high-contrast' : ''}`}>
              <div className={`mr-2 threat-suspicious-icon ${highContrast ? 'high-contrast' : ''}`}>
                <Eye className="h-4 w-4" />
              </div>
              <span>Suspicious Content</span>
            </div>
            
            <div className={`p-3 rounded-md flex items-center threat-phishing ${highContrast ? 'high-contrast' : ''}`}>
              <div className={`mr-2 threat-phishing-icon ${highContrast ? 'high-contrast' : ''}`}>
                <X className="h-4 w-4" />
              </div>
              <span>Phishing Content</span>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button 
            type="button" 
            onClick={() => setOpen(false)}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}