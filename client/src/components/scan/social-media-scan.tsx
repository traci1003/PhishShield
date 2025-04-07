import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { MessageScanResult } from "@/lib/natural-language";
import { Label } from "@/components/ui/label";
import { getThreatColor, getThreatIcon } from "@/lib/link-analyzer";
import { Separator } from "@/components/ui/separator";
import { useAccessibility } from "@/contexts/accessibility-context";

export default function SocialMediaScan() {
  const [content, setContent] = useState("");
  const [platform, setPlatform] = useState("facebook");
  const [scanResults, setScanResults] = useState<MessageScanResult | null>(null);
  const { toast } = useToast();
  const { highContrast } = useAccessibility();

  const scanMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/scan/text", {
        content,
        sender: `${platform} message`,
        source: "social"
      });
      return response.json();
    },
    onSuccess: (data: MessageScanResult) => {
      setScanResults(data);
      toast({
        title: "Scan Complete",
        description: `Threat level: ${data.analysis.threatLevel}`,
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to scan message. Please try again.",
      });
      console.error("Scan error:", error);
    }
  });

  const handleScan = () => {
    if (!content.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a message to scan",
      });
      return;
    }
    scanMutation.mutate();
  };

  // Handle threat level styling
  const getThreatColorClass = (threatLevel: string) => {
    if (highContrast) {
      switch (threatLevel) {
        case 'phishing': return 'bg-black text-white border-white';
        case 'suspicious': return 'bg-black text-white border-white border-dashed';
        default: return 'bg-white text-black border-black';
      }
    } else {
      switch (threatLevel) {
        case 'phishing': return 'bg-red-50 text-red-700 border-red-200';
        case 'suspicious': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
        default: return 'bg-green-50 text-green-700 border-green-200';
      }
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Scan Social Media Message</CardTitle>
          <CardDescription>
            Paste messages from social platforms to scan for phishing attempts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="platform">Social Platform</Label>
            <Select
              value={platform}
              onValueChange={setPlatform}
            >
              <SelectTrigger id="platform">
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="twitter">Twitter/X</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
                <SelectItem value="discord">Discord</SelectItem>
                <SelectItem value="reddit">Reddit</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message-content">Message Content</Label>
            <Textarea
              id="message-content"
              placeholder="Paste the message here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              className="resize-none"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleScan} 
            disabled={scanMutation.isPending || !content.trim()}
            className="w-full"
          >
            {scanMutation.isPending ? 
              <span className="flex items-center">
                <span className="animate-spin mr-2 h-4 w-4 border-2 border-t-transparent rounded-full"></span>
                Scanning...
              </span> 
              : 'Scan Message'
            }
          </Button>
        </CardFooter>
      </Card>

      {scanResults && (
        <Card>
          <CardHeader className={`border-b ${getThreatColorClass(scanResults.analysis.threatLevel)}`}>
            <div className="flex items-center">
              <span className="material-icons mr-2 text-2xl">
                {getThreatIcon(scanResults.analysis.threatLevel)}
              </span>
              <CardTitle className="capitalize">
                {scanResults.analysis.threatLevel} Content
              </CardTitle>
            </div>
            <CardDescription className="mt-2">
              {scanResults.analysis.threatLevel === 'safe' ? 
                'This message appears to be safe.' : 
                'This message contains potential phishing indicators.'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            {scanResults.analysis.reasons.length > 0 && (
              <>
                <h4 className="font-medium text-sm mb-2">Warning Indicators:</h4>
                <ul className="list-disc pl-5 text-sm space-y-1 mb-4">
                  {scanResults.analysis.reasons.map((reason, index) => (
                    <li key={index} className="text-gray-700">{reason}</li>
                  ))}
                </ul>
                <Separator className="my-4" />
              </>
            )}
            
            <h4 className="font-medium text-sm mb-2">Reviewed Content:</h4>
            <div className="text-sm bg-gray-50 p-3 rounded-md whitespace-pre-wrap">
              {scanResults.analysis.content}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-4">
            <Button 
              variant="outline" 
              onClick={() => setScanResults(null)}
            >
              Clear Results
            </Button>
            <div className="flex">
              <Button 
                variant="ghost" 
                className="flex items-center text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <span className="material-icons mr-1 text-sm">report</span>
                Report Falsely Detected
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}