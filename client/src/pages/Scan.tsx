import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ScanForm from "@/components/scan/scan-form";
import ScanResult from "@/components/scan/scan-result";
import SocialMediaScan from "@/components/scan/social-media-scan";
import { PhishingAnalysisResult, MessageScanResult } from "@/lib/natural-language";
import { UrlAnalysisResult } from "@/lib/link-analyzer";

export default function Scan() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<MessageScanResult | null>(null);
  const [urlResult, setUrlResult] = useState<UrlAnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState("general");

  const handleScanComplete = (result: MessageScanResult) => {
    setIsScanning(false);
    setScanResult(result);
  };

  const handleUrlScanComplete = (result: UrlAnalysisResult) => {
    setIsScanning(false);
    setUrlResult(result);
  };

  const handleScanStart = () => {
    setIsScanning(true);
    setScanResult(null);
    setUrlResult(null);
  };

  const handleNewScan = () => {
    setScanResult(null);
    setUrlResult(null);
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Scan for Threats</h1>
        <p className="text-gray-600">
          Analyze messages or URLs for phishing and scams
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="general">General Scan</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          {!scanResult && !urlResult ? (
            <ScanForm 
              onScanStart={handleScanStart}
              onScanComplete={handleScanComplete}
              onUrlScanComplete={handleUrlScanComplete}
              isScanning={isScanning}
            />
          ) : (
            <ScanResult 
              textResult={scanResult}
              urlResult={urlResult}
              onNewScan={handleNewScan}
            />
          )}
        </TabsContent>
        
        <TabsContent value="social">
          <SocialMediaScan />
        </TabsContent>
      </Tabs>
    </div>
  );
}
