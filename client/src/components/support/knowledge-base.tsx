import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface KnowledgeArticle {
  id: string;
  title: string;
  content: string;
  category: "general" | "account" | "security" | "technical" | "billing";
  tags: string[];
}

const ARTICLES: KnowledgeArticle[] = [
  {
    id: "kb-001",
    title: "How does PhishShield AI detect phishing attempts?",
    category: "security",
    tags: ["phishing", "detection", "ai"],
    content: `
      <p>PhishShield AI uses multiple layers of advanced artificial intelligence to detect phishing attempts:</p>
      
      <h4 class="font-bold mt-4 mb-2">Natural Language Processing (NLP)</h4>
      <p>Our system analyzes the text content of messages to identify suspicious patterns, unusual requests, and linguistic markers commonly associated with phishing attempts.</p>
      
      <h4 class="font-bold mt-4 mb-2">URL Analysis</h4>
      <p>When a link is detected, our system:</p>
      <ul class="list-disc pl-5 space-y-1 mt-2">
        <li>Checks against a database of known malicious URLs</li>
        <li>Analyzes URL structure for suspicious patterns</li>
        <li>Detects lookalike domains designed to impersonate legitimate websites</li>
        <li>Evaluates domain age and reputation</li>
      </ul>
      
      <h4 class="font-bold mt-4 mb-2">Behavioral Analysis</h4>
      <p>PhishShield AI learns from user behavior to identify unusual or unexpected communication patterns that may indicate phishing attempts.</p>
      
      <h4 class="font-bold mt-4 mb-2">Threat Intelligence</h4>
      <p>Our system constantly updates with the latest phishing tactics and techniques from global threat intelligence sources.</p>
      
      <p class="mt-4">All of these factors are combined to generate a comprehensive threat assessment that categorizes messages as Safe, Suspicious, or Dangerous.</p>
    `
  },
  {
    id: "kb-002",
    title: "What's the difference between free and premium plans?",
    category: "billing",
    tags: ["subscription", "premium", "pricing"],
    content: `
      <p>PhishShield AI offers three subscription tiers to meet different needs:</p>
      
      <h4 class="font-bold mt-4 mb-2">Basic Plan (Free)</h4>
      <ul class="list-disc pl-5 space-y-1 mt-2">
        <li>Basic SMS/message phishing detection</li>
        <li>Up to 15 scans per day</li>
        <li>Standard threat notifications</li>
        <li>Basic threat analysis reports</li>
      </ul>
      
      <h4 class="font-bold mt-4 mb-2">Premium Plan ($7.99/month)</h4>
      <ul class="list-disc pl-5 space-y-1 mt-2">
        <li>Advanced SMS/message phishing detection</li>
        <li>Unlimited scans</li>
        <li>Social media protection</li>
        <li>Real-time threat alerts</li>
        <li>Detailed threat analysis reports</li>
        <li>Priority customer support</li>
      </ul>
      
      <h4 class="font-bold mt-4 mb-2">Family Plan ($14.99/month)</h4>
      <ul class="list-disc pl-5 space-y-1 mt-2">
        <li>All Premium features</li>
        <li>Protection for up to 5 family members</li>
        <li>Family security dashboard</li>
        <li>Enhanced parental controls</li>
        <li>VIP customer support</li>
      </ul>
      
      <p class="mt-4">You can upgrade or downgrade your plan at any time from the Account section.</p>
    `
  },
  {
    id: "kb-003",
    title: "How to scan suspicious messages",
    category: "technical",
    tags: ["scan", "guide", "tutorial"],
    content: `
      <p>Scanning suspicious messages with PhishShield AI is simple:</p>
      
      <h4 class="font-bold mt-4 mb-2">Method 1: Direct Scan</h4>
      <ol class="list-decimal pl-5 space-y-2 mt-2">
        <li>Open the PhishShield AI app</li>
        <li>Navigate to the "Scan" tab in the main navigation</li>
        <li>Copy and paste the suspicious message text into the scanning area</li>
        <li>Tap the "Scan" button to analyze the message</li>
        <li>Review the threat analysis results</li>
      </ol>
      
      <h4 class="font-bold mt-4 mb-2">Method 2: URL Scan</h4>
      <ol class="list-decimal pl-5 space-y-2 mt-2">
        <li>Open the PhishShield AI app</li>
        <li>Navigate to the "Scan" tab</li>
        <li>Select the "URL" tab</li>
        <li>Enter or paste the suspicious URL</li>
        <li>Tap "Scan URL" to analyze the link</li>
        <li>Review the threat analysis results</li>
      </ol>
      
      <h4 class="font-bold mt-4 mb-2">Method 3: Share Extension (Mobile)</h4>
      <ol class="list-decimal pl-5 space-y-2 mt-2">
        <li>When viewing a suspicious message in another app, tap the Share button</li>
        <li>Select "PhishShield AI" from the sharing options</li>
        <li>The app will automatically scan the shared content</li>
        <li>Review the threat analysis results</li>
      </ol>
      
      <p class="mt-4 text-sm italic">Note: Premium users can enable background scanning for automatic detection without manual scanning.</p>
    `
  },
  {
    id: "kb-004",
    title: "Frequently Asked Questions (FAQ)",
    category: "general",
    tags: ["faq", "questions", "help"],
    content: `
      <h4 class="font-bold mt-3 mb-2">Q: Can PhishShield AI protect me on all my devices?</h4>
      <p>A: Yes, PhishShield AI is available for iOS, Android, and as a web application. Your subscription works across all platforms with the same account.</p>
      
      <h4 class="font-bold mt-4 mb-2">Q: How accurate is PhishShield AI?</h4>
      <p>A: Our system achieves over 98% accuracy in detecting phishing attempts based on our latest testing. We continuously improve our AI models with machine learning to adapt to new phishing tactics.</p>
      
      <h4 class="font-bold mt-4 mb-2">Q: Does PhishShield AI access my personal messages?</h4>
      <p>A: No. PhishShield AI only analyzes messages or URLs that you specifically submit for scanning. We do not have access to your messages or emails unless you explicitly share them with the app for scanning.</p>
      
      <h4 class="font-bold mt-4 mb-2">Q: Can I cancel my subscription at any time?</h4>
      <p>A: Yes, you can cancel your subscription at any time from your Account settings. Your premium features will remain active until the end of your current billing period.</p>
      
      <h4 class="font-bold mt-4 mb-2">Q: What should I do if I already clicked on a suspicious link?</h4>
      <p>A: If you've already clicked on a link that PhishShield AI identifies as dangerous, you should:</p>
      <ul class="list-disc pl-5 space-y-1 mt-1">
        <li>Disconnect your device from the internet</li>
        <li>Run a full virus/malware scan</li>
        <li>Change passwords for any accounts that may be affected</li>
        <li>Monitor your accounts for suspicious activity</li>
        <li>Contact your bank if you entered financial information</li>
      </ul>
      
      <h4 class="font-bold mt-4 mb-2">Q: Does PhishShield AI work with social media?</h4>
      <p>A: Yes, Premium and Family plan subscribers get social media protection that can scan for suspicious links and messages across major social platforms.</p>
    `
  },
  {
    id: "kb-005",
    title: "Managing your PhishShield AI account",
    category: "account",
    tags: ["account", "settings", "profile"],
    content: `
      <p>You can easily manage your PhishShield AI account through the Account section of the app:</p>
      
      <h4 class="font-bold mt-4 mb-2">Updating Personal Information</h4>
      <ol class="list-decimal pl-5 space-y-1 mt-2">
        <li>Navigate to the "Account" tab</li>
        <li>Select "Profile"</li>
        <li>Edit your name, email, or other personal information</li>
        <li>Tap "Save Changes"</li>
      </ol>
      
      <h4 class="font-bold mt-4 mb-2">Changing Your Password</h4>
      <ol class="list-decimal pl-5 space-y-1 mt-2">
        <li>Navigate to the "Account" tab</li>
        <li>Select "Security"</li>
        <li>Tap "Change Password"</li>
        <li>Enter your current password and your new password</li>
        <li>Tap "Update Password"</li>
      </ol>
      
      <h4 class="font-bold mt-4 mb-2">Managing Subscription</h4>
      <ol class="list-decimal pl-5 space-y-1 mt-2">
        <li>Navigate to the "Account" tab</li>
        <li>Select "Subscription"</li>
        <li>View your current plan, next billing date, and payment method</li>
        <li>Choose "Upgrade Plan" or "Manage Subscription" to make changes</li>
      </ol>
      
      <h4 class="font-bold mt-4 mb-2">Protection Settings</h4>
      <ol class="list-decimal pl-5 space-y-1 mt-2">
        <li>Navigate to the "Account" tab</li>
        <li>Select "Protection Settings"</li>
        <li>Toggle different protection features on or off</li>
        <li>Customize notification preferences</li>
        <li>Set scanning sensitivity levels</li>
      </ol>
      
      <h4 class="font-bold mt-4 mb-2">Device Management</h4>
      <ol class="list-decimal pl-5 space-y-1 mt-2">
        <li>Navigate to the "Account" tab</li>
        <li>Select "Security"</li>
        <li>Tap "Devices"</li>
        <li>View all devices connected to your account</li>
        <li>Remove devices you no longer use</li>
      </ol>
      
      <p class="mt-4 text-sm italic">Note: Some settings may only be available to Premium and Family plan subscribers.</p>
    `
  },
];

export default function KnowledgeBase() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle | null>(null);
  
  // Filter articles based on search query and active tab
  const filteredArticles = ARTICLES.filter(article => {
    const matchesSearch = searchQuery === "" || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = activeTab === "all" || article.category === activeTab;
    
    return matchesSearch && matchesCategory;
  });
  
  // Handle article selection
  const viewArticle = (article: KnowledgeArticle) => {
    setSelectedArticle(article);
    window.scrollTo(0, 0);
  };
  
  // Go back to article list
  const backToList = () => {
    setSelectedArticle(null);
  };
  
  return (
    <Card className="w-full max-w-4xl mx-auto rounded-xl overflow-hidden border">
      <CardHeader className="pb-0">
        <CardTitle className="text-2xl font-bold text-[#1E1442]">Knowledge Base</CardTitle>
        <CardDescription>
          Browse helpful articles and guides about PhishShield AI features
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6">
        {!selectedArticle ? (
          <>
            <div className="mb-6">
              <Input 
                placeholder="Search for help articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-lg border-gray-300 focus:border-[#c1c8fb] focus:ring-[#c1c8fb]"
              />
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-4 w-full flex justify-start overflow-x-auto">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="technical">How-To</TabsTrigger>
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="billing">Billing</TabsTrigger>
              </TabsList>
              
              <TabsContent value={activeTab} className="mt-0">
                {filteredArticles.length > 0 ? (
                  <div className="space-y-4">
                    {filteredArticles.map((article) => (
                      <Card 
                        key={article.id} 
                        className="hover:border-[#c1c8fb] transition-colors cursor-pointer"
                        onClick={() => viewArticle(article)}
                      >
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-[#1E1442] text-lg">{article.title}</h3>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {article.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="bg-[#f8f9fe] text-[#1E1442] hover:bg-[#f0f2fd]">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-[#f8f9fe] rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" fill="#1E1442"/>
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium mb-2">No results found</h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                      We couldn't find any articles matching your search. 
                      Try using different keywords or browse categories.
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <div>
            <Button 
              onClick={backToList}
              variant="ghost" 
              className="mb-4 pl-0 text-[#1E1442] hover:bg-[#f8f9fe]"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1">
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" fill="#1E1442"/>
              </svg>
              Back to articles
            </Button>
            
            <h2 className="text-2xl font-bold text-[#1E1442] mb-4">{selectedArticle.title}</h2>
            
            <div className="flex flex-wrap gap-2 mb-6">
              <Badge className="bg-[#f0f2fd] text-[#1E1442] hover:bg-[#e8eafd]">
                {selectedArticle.category.charAt(0).toUpperCase() + selectedArticle.category.slice(1)}
              </Badge>
              {selectedArticle.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-[#f8f9fe] text-[#1E1442] hover:bg-[#f0f2fd]">
                  {tag}
                </Badge>
              ))}
            </div>
            
            <div 
              className="prose max-w-none" 
              dangerouslySetInnerHTML={{ __html: selectedArticle.content }} 
            />
            
            <div className="mt-8 border-t pt-6">
              <h4 className="font-semibold text-[#1E1442] mb-2">Was this article helpful?</h4>
              <div className="flex gap-3">
                <Button 
                  className="bg-[#c1c8fb] hover:bg-[#a8b0f8] text-[#1E1442] rounded-full"
                >
                  Yes, it helped
                </Button>
                <Button 
                  variant="outline"
                  className="rounded-full border-gray-300"
                >
                  No, I need more help
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}