import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { analyzeText } from "@/lib/natural-language";
import { analyzeUrl, extractUrls } from "@/lib/link-analyzer";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Search, Database, ShieldCheck } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const textFormSchema = z.object({
  content: z.string().min(1, {
    message: "Please enter a message to scan.",
  }),
  sender: z.string().optional(),
  source: z.enum(["sms", "email", "social", "manual"]).default("manual"),
  useAdvancedScan: z.boolean().default(false),
});

const urlFormSchema = z.object({
  url: z.string().url({
    message: "Please enter a valid URL starting with http:// or https://",
  }),
  saveToHistory: z.boolean().default(true),
  useAdvancedScan: z.boolean().default(false),
});

interface ScanFormProps {
  onScanStart: () => void;
  onScanComplete: (result: any) => void;
  onUrlScanComplete: (result: any) => void;
  isScanning: boolean;
}

export default function ScanForm({ 
  onScanStart,
  onScanComplete,
  onUrlScanComplete,
  isScanning 
}: ScanFormProps) {
  const [activeTab, setActiveTab] = useState("text");
  const { toast } = useToast();

  const textForm = useForm<z.infer<typeof textFormSchema>>({
    resolver: zodResolver(textFormSchema),
    defaultValues: {
      content: "",
      sender: "",
      source: "manual",
      useAdvancedScan: true,
    },
  });

  const urlForm = useForm<z.infer<typeof urlFormSchema>>({
    resolver: zodResolver(urlFormSchema),
    defaultValues: {
      url: "",
      saveToHistory: true,
      useAdvancedScan: true,
    },
  });

  const onTextSubmit = async (values: z.infer<typeof textFormSchema>) => {
    try {
      onScanStart();
      const result = await analyzeText(
        values.content, 
        values.sender, 
        values.source as any, 
        values.useAdvancedScan, // Use advanced threat intelligence
        true // Save to history
      );
      onScanComplete(result);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Scan failed",
        description: "There was a problem scanning your message.",
      });
      console.error(error);
    }
  };

  const onUrlSubmit = async (values: z.infer<typeof urlFormSchema>) => {
    try {
      onScanStart();
      const source: 'sms' | 'email' | 'social' | 'manual' = 'manual';
      const result = await analyzeUrl(
        values.url, 
        values.useAdvancedScan, // Use advanced threat intelligence
        values.saveToHistory, // Save to history
        source // Source of the URL - use manual default
      );
      onUrlScanComplete(result);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Scan failed",
        description: "There was a problem scanning the URL.",
      });
      console.error(error);
    }
  };

  const handlePaste = async (e: React.ClipboardEvent) => {
    const pastedText = e.clipboardData.getData('text');
    
    // Check if the pasted content looks like a URL
    const urls = extractUrls(pastedText);
    if (urls.length > 0 && urls[0].startsWith('http')) {
      setActiveTab('url');
      urlForm.setValue('url', urls[0]);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="text">Message</TabsTrigger>
          <TabsTrigger value="url">URL</TabsTrigger>
        </TabsList>
        
        <TabsContent value="text">
          <Form {...textForm}>
            <form onSubmit={textForm.handleSubmit(onTextSubmit)} className="space-y-6">
              <FormField
                control={textForm.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message to scan</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Paste the suspicious message here..." 
                        className="min-h-[150px]"
                        onPaste={handlePaste}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={textForm.control}
                  name="sender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sender (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Who sent this message?" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={textForm.control}
                  name="source"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message type</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select message type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="sms">SMS</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="social">Social Media</SelectItem>
                          <SelectItem value="manual">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <Collapsible className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                <CollapsibleTrigger className="flex w-full items-center justify-between">
                  <div className="flex items-center">
                    <Database className="h-4 w-4 mr-2 text-primary-600" />
                    <span className="text-sm font-medium">Advanced Scan Settings</span>
                  </div>
                  <div className="text-xs text-gray-500">Currently using enhanced protection</div>
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-3">
                  <div className="space-y-3">
                    <FormField
                      control={textForm.control}
                      name="useAdvancedScan"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                          <div className="space-y-0.5">
                            <FormLabel className="text-sm font-medium flex items-center">
                              <ShieldCheck className="h-4 w-4 mr-2 text-primary-500" />
                              Enhanced Threat Intelligence
                            </FormLabel>
                            <FormDescription className="text-xs">
                              Use advanced threat database and AI analysis to improve detection rates
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="data-[state=checked]:bg-primary-500"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </CollapsibleContent>
              </Collapsible>
              
              <Button 
                type="submit" 
                className={`w-full relative overflow-hidden ${isScanning ? 'bg-primary-600' : 'bg-gradient-shield hover:shadow-lg transition-all duration-300'}`}
                disabled={isScanning}
              >
                {!isScanning && (
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgcGF0dGVyblRyYW5zZm9ybT0icm90YXRlKDQ1KSI+PHJlY3Qgd2lkdGg9IjIiIGhlaWdodD0iMiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2EpIi8+PC9zdmc+')] opacity-20"></div>
                )}
                <div className="relative z-10 py-1">
                  {isScanning ? (
                    <>
                      <div className="flex items-center justify-center">
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        <span className="font-medium">Analyzing content...</span>
                      </div>
                      {/* Progress bar animation */}
                      <div className="mt-1 h-1 w-full bg-white/20 rounded-full overflow-hidden">
                        <div className="h-full bg-white animate-[shimmer_2s_ease-in-out_infinite]" style={{width: '80%'}}></div>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Search className="mr-2 h-5 w-5" />
                      <span className="font-medium">Scan Message</span>
                    </div>
                  )}
                </div>
              </Button>
            </form>
          </Form>
        </TabsContent>
        
        <TabsContent value="url">
          <Form {...urlForm}>
            <form onSubmit={urlForm.handleSubmit(onUrlSubmit)} className="space-y-6">
              <FormField
                control={urlForm.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL to scan</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://example.com" 
                        {...field} 
                        onPaste={handlePaste}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Collapsible className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                <CollapsibleTrigger className="flex w-full items-center justify-between">
                  <div className="flex items-center">
                    <Database className="h-4 w-4 mr-2 text-primary-600" />
                    <span className="text-sm font-medium">Advanced Scan Settings</span>
                  </div>
                  <div className="text-xs text-gray-500">Enhanced protection enabled</div>
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-3">
                  <div className="space-y-3">
                    <FormField
                      control={urlForm.control}
                      name="useAdvancedScan"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                          <div className="space-y-0.5">
                            <FormLabel className="text-sm font-medium flex items-center">
                              <ShieldCheck className="h-4 w-4 mr-2 text-primary-500" />
                              Enhanced Threat Intelligence
                            </FormLabel>
                            <FormDescription className="text-xs">
                              Use advanced reputation databases and AI analysis to detect malicious URLs
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="data-[state=checked]:bg-primary-500"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={urlForm.control}
                      name="saveToHistory"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                          <div className="space-y-0.5">
                            <FormLabel className="text-sm font-medium flex items-center">
                              <span className="material-icons-outlined text-primary-500 mr-2 text-base">history</span>
                              Save to Scan History
                            </FormLabel>
                            <FormDescription className="text-xs">
                              Save this scan to your history for future reference
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="data-[state=checked]:bg-primary-500"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </CollapsibleContent>
              </Collapsible>
              
              <Button 
                type="submit" 
                className={`w-full relative overflow-hidden ${isScanning ? 'bg-primary-600' : 'bg-gradient-shield hover:shadow-lg transition-all duration-300'}`}
                disabled={isScanning}
              >
                {!isScanning && (
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgcGF0dGVyblRyYW5zZm9ybT0icm90YXRlKDQ1KSI+PHJlY3Qgd2lkdGg9IjIiIGhlaWdodD0iMiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2EpIi8+PC9zdmc+')] opacity-20"></div>
                )}
                <div className="relative z-10 py-1">
                  {isScanning ? (
                    <>
                      <div className="flex items-center justify-center">
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        <span className="font-medium">Analyzing URL...</span>
                      </div>
                      {/* Progress bar animation */}
                      <div className="mt-1 h-1 w-full bg-white/20 rounded-full overflow-hidden">
                        <div className="h-full bg-white animate-[shimmer_2s_ease-in-out_infinite]" style={{width: '80%'}}></div>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                      </svg>
                      <span className="font-medium">Scan URL</span>
                    </div>
                  )}
                </div>
              </Button>
            </form>
          </Form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
