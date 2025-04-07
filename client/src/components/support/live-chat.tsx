import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useQuery, useMutation } from "@tanstack/react-query";

interface ChatMessage {
  id: string;
  sender: "user" | "agent";
  content: string;
  timestamp: Date;
  isRead?: boolean;
  agentName?: string;
  agentAvatar?: string;
}

export default function LiveChat() {
  const [message, setMessage] = useState("");
  const [chatActive, setChatActive] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [agentTyping, setAgentTyping] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Initial welcome message when chat starts
  const startChat = () => {
    setChatActive(true);
    setMessages([
      {
        id: "welcome",
        sender: "agent",
        content: "Hello! Welcome to PhishShield AI support. How can I help you today?",
        timestamp: new Date(),
        agentName: "Support Agent",
        agentAvatar: "/assets/support-agent.jpg",
        isRead: true
      }
    ]);
  };

  // Scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Simulate agent typing and response
  const simulateAgentResponse = (userMessage: string) => {
    setAgentTyping(true);
    
    // Simulate thinking time (1.5-3 seconds)
    const thinkingTime = 1500 + Math.random() * 1500;
    
    setTimeout(() => {
      let responseContent = "";
      
      // Simple response logic based on user message keywords
      if (userMessage.toLowerCase().includes("subscription") || 
          userMessage.toLowerCase().includes("payment") || 
          userMessage.toLowerCase().includes("billing")) {
        responseContent = "For subscription and billing questions, you can view your current plan in the Account section. If you're having trouble with payments, please make sure your payment information is up to date. Is there anything specific about your subscription you'd like to know?";
      } else if (userMessage.toLowerCase().includes("phishing") || 
                userMessage.toLowerCase().includes("scan") || 
                userMessage.toLowerCase().includes("threat")) {
        responseContent = "Our phishing detection uses advanced AI to identify suspicious messages and links. You can scan any text or URL in the Scan section of the app. Results are categorized as Safe, Suspicious, or Dangerous based on our threat analysis. Would you like me to explain any specific aspect of our scanning technology?";
      } else if (userMessage.toLowerCase().includes("notification") || 
                userMessage.toLowerCase().includes("alert")) {
        responseContent = "PhishShield AI sends notifications when threats are detected or when important security updates are available. You can manage notification settings in the Account section under Protection Settings. Are you having trouble with notifications?";
      } else {
        responseContent = "Thank you for your message. Our team will look into this for you. Is there anything else you'd like to know about PhishShield AI?";
      }
      
      setAgentTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        sender: "agent",
        content: responseContent,
        timestamp: new Date(),
        agentName: "Support Agent",
        agentAvatar: "/assets/support-agent.jpg",
        isRead: true
      }]);
    }, thinkingTime);
  };

  // Handle sending a new message
  const sendMessage = () => {
    if (!message.trim()) return;
    
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      content: message,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
    setMessage("");
    
    // Simulate agent response
    simulateAgentResponse(message);
  };

  // Handle key press to send message
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // End the chat session
  const endChat = () => {
    toast({
      title: "Chat ended",
      description: "Thank you for chatting with PhishShield AI support.",
    });
    setChatActive(false);
    setMessages([]);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto rounded-xl overflow-hidden border">
      <CardHeader className="pb-0">
        <CardTitle className="text-2xl font-bold text-[#1E1442]">PhishShield AI Support</CardTitle>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mx-6 mt-2 grid w-[400px] grid-cols-2">
          <TabsTrigger value="chat">Live Chat</TabsTrigger>
          <TabsTrigger value="hours">Support Hours</TabsTrigger>
        </TabsList>
        
        <TabsContent value="chat" className="mt-0 px-0">
          {!chatActive ? (
            <div className="py-10 px-6 text-center">
              <div className="w-20 h-20 bg-[#f8f9fe] rounded-full flex items-center justify-center mx-auto mb-6">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM7.07 18.28C7.5 17.38 10.12 16.5 12 16.5C13.88 16.5 16.51 17.38 16.93 18.28C15.57 19.36 13.86 20 12 20C10.14 20 8.43 19.36 7.07 18.28ZM18.36 16.83C16.93 15.09 13.46 14.5 12 14.5C10.54 14.5 7.07 15.09 5.64 16.83C4.62 15.49 4 13.82 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 13.82 19.38 15.49 18.36 16.83ZM12 6C10.06 6 8.5 7.56 8.5 9.5C8.5 11.44 10.06 13 12 13C13.94 13 15.5 11.44 15.5 9.5C15.5 7.56 13.94 6 12 6ZM12 11C11.17 11 10.5 10.33 10.5 9.5C10.5 8.67 11.17 8 12 8C12.83 8 13.5 8.67 13.5 9.5C13.5 10.33 12.83 11 12 11Z" fill="#1E1442"/>
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">Start a conversation</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Our support team is available to help you with any questions about PhishShield AI.
              </p>
              <Button 
                onClick={startChat}
                className="px-8 py-2 bg-[#c1c8fb] hover:bg-[#a8b0f8] text-[#1E1442] rounded-full font-medium"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                  <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H6L4 18V4H20V16Z" fill="#1E1442"/>
                </svg>
                Start Chat
              </Button>
            </div>
          ) : (
            <>
              <ScrollArea className="h-[400px] p-4 border-t border-b">
                <div className="space-y-4 px-2">
                  {messages.map((msg) => (
                    <div 
                      key={msg.id} 
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex gap-3 max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        {msg.sender === 'agent' && (
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={msg.agentAvatar} alt={msg.agentName} />
                            <AvatarFallback className="bg-blue-100 text-blue-800">SA</AvatarFallback>
                          </Avatar>
                        )}
                        <div>
                          {msg.sender === 'agent' && (
                            <div className="text-xs text-gray-500 mb-1">{msg.agentName}</div>
                          )}
                          <div className={`rounded-2xl py-2 px-4 ${
                            msg.sender === 'user' 
                              ? 'bg-[#c1c8fb] text-[#1E1442]' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {msg.content}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {agentTyping && (
                    <div className="flex justify-start">
                      <div className="flex gap-3 max-w-[80%]">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-blue-100 text-blue-800">SA</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Support Agent</div>
                          <div className="rounded-2xl py-2 px-4 bg-gray-100 text-gray-800">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
              
              <CardFooter className="py-4 flex gap-4">
                <Input 
                  className="flex-1 rounded-full border-gray-300 focus:border-[#c1c8fb] focus:ring-[#c1c8fb]"
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                />
                <Button
                  onClick={sendMessage}
                  disabled={!message.trim()}
                  className="rounded-full bg-[#c1c8fb] hover:bg-[#a8b0f8] text-[#1E1442]"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill="#1E1442"/>
                  </svg>
                </Button>
                <Button
                  onClick={endChat}
                  variant="outline"
                  className="rounded-full border-gray-300"
                >
                  End Chat
                </Button>
              </CardFooter>
            </>
          )}
        </TabsContent>
        
        <TabsContent value="hours" className="p-6">
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="mr-4 rounded-full bg-[#f8f9fe] p-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" fill="#1E1442"/>
                  <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z" fill="#1E1442"/>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-[#1E1442]">Business Hours</h3>
                <div className="mt-2 space-y-1">
                  <p className="text-gray-600">Monday - Friday: 9:00 AM - 5:00 PM EST</p>
                  <p className="text-gray-600">Saturday: 10:00 AM - 2:00 PM EST</p>
                  <p className="text-gray-600">Sunday: Closed</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="mr-4 rounded-full bg-[#f8f9fe] p-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z" fill="#1E1442"/>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-[#1E1442]">Email Support</h3>
                <p className="mt-2 text-gray-600">
                  Email us at <a href="mailto:support@phishshield.example.com" className="text-blue-600 font-medium">support@phishshield.example.com</a>
                </p>
                <p className="text-gray-600 text-sm mt-1">
                  For email inquiries, our typical response time is within 24 hours during business days.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="mr-4 rounded-full bg-[#f8f9fe] p-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h4l3 3 3-3h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 16h-4.83l-.59.59L12 20.17l-1.59-1.59-.58-.58H5V4h14v14z" fill="#1E1442"/>
                  <path d="M12 17h2v-2h-2v2zm0-4h2V7h-2v6z" fill="#1E1442"/>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-[#1E1442]">Priority Support</h3>
                <p className="mt-2 text-gray-600">
                  Premium and Family plan subscribers receive priority support with faster response times.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}