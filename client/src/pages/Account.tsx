import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, User, HelpCircle, CreditCard, Lock, LogOut, BrainCircuit } from "lucide-react";
import AIAssistant from "@/components/account/ai-assistant";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Account() {
  const [activeTab, setActiveTab] = useState("account");
  const isMobile = useIsMobile();
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Account</h1>
        <p className="text-gray-600">
          Manage your account, subscription, and get help
        </p>
      </div>
      
      <Tabs 
        defaultValue="account" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="assistant">Virtual Assistant</TabsTrigger>
        </TabsList>
        
        <TabsContent value="account" className="space-y-4 mt-0">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Account Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-4">
                <div className="rounded-full bg-primary-100 p-3 mr-3">
                  <User className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-medium">Demo User</h3>
                  <p className="text-sm text-gray-500">demo@example.com</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                <Lock className="h-4 w-4 mr-2" />
                Change Password
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Subscription</CardTitle>
              <CardDescription>You are currently on the free plan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-primary-50 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-primary-700 flex items-center mb-2">
                  <Shield className="h-5 w-5 mr-2" />
                  PhishShield Free
                </h3>
                <ul className="text-sm space-y-2">
                  <li className="flex items-center">
                    <span className="material-icons text-primary-600 mr-2 text-sm">check</span>
                    Basic SMS Protection
                  </li>
                  <li className="flex items-center">
                    <span className="material-icons text-primary-600 mr-2 text-sm">check</span>
                    Basic Email Protection
                  </li>
                  <li className="flex items-center">
                    <span className="material-icons text-primary-600 mr-2 text-sm">check</span>
                    AI Virtual Assistant
                  </li>
                  <li className="flex items-center">
                    <span className="material-icons text-gray-400 mr-2 text-sm">close</span>
                    <span className="text-gray-500">Social Media Protection</span>
                  </li>
                  <li className="flex items-center">
                    <span className="material-icons text-gray-400 mr-2 text-sm">close</span>
                    <span className="text-gray-500">On-Device Scanning</span>
                  </li>
                  <li className="flex items-center">
                    <span className="material-icons text-gray-400 mr-2 text-sm">close</span>
                    <span className="text-gray-500">Priority Support</span>
                  </li>
                </ul>
              </div>
              <Button className="w-full bg-primary-600 hover:bg-primary-700">
                <CreditCard className="h-4 w-4 mr-2" />
                Upgrade to Premium
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Help & Support</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setActiveTab("assistant")}
              >
                <BrainCircuit className="h-4 w-4 mr-2" />
                Ask Virtual Assistant
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <HelpCircle className="h-4 w-4 mr-2" />
                FAQ
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <span className="material-icons text-sm mr-2">contact_support</span>
                Contact Support
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <span className="material-icons text-sm mr-2">privacy_tip</span>
                Privacy Policy
              </Button>
            </CardContent>
          </Card>
          
          <Button variant="outline" className="w-full text-gray-600 mt-6">
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </TabsContent>
        
        <TabsContent value="assistant" className="mt-0">
          <div className={isMobile ? "w-full" : "max-w-2xl mx-auto"}>
            <AIAssistant />
          </div>
          <div className="mt-6 text-center">
            <Button 
              variant="outline" 
              onClick={() => setActiveTab("account")} 
              className="mx-auto"
            >
              Back to Account
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
