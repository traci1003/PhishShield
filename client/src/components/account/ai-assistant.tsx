import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { ChatMessage, ChatResponse } from '@shared/schema';
import { SendIcon, RefreshCwIcon, BrainCircuitIcon } from "lucide-react";
import { cn } from '@/lib/utils';

export default function AIAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: "Hello! I'm your PhishShield AI assistant. How can I help you with phishing protection today?",
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState('');
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input on component mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Mutation for sending chat messages
  const chatMutation = useMutation({
    mutationFn: async (query: string) => {
      const response = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json() as ChatResponse;
    },
    onSuccess: (response) => {
      if (response) {
        // Add assistant response to chat
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: response.answer,
          timestamp: response.timestamp
        }]);
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Unable to get a response. Please try again later.",
        variant: "destructive"
      });
      console.error("AI assistant error:", error);
    }
  });

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!input.trim() || chatMutation.isPending) return;
    
    // Add user message to chat
    const userMessage: ChatMessage = {
      role: 'user',
      content: input,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Clear input
    setInput('');
    
    // Send to AI assistant
    chatMutation.mutate(userMessage.content);
  };

  // Handle Enter key press
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Clear chat history
  const handleClearChat = () => {
    setMessages([{
      role: 'assistant',
      content: "How can I help you with phishing protection today?",
      timestamp: new Date().toISOString()
    }]);
    
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Format timestamp for display
  const formatTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return '';
    }
  };

  return (
    <Card className="w-full shadow-lg border-0 bg-gradient-to-b from-card/70 to-card">
      <CardHeader className="pb-3">
        <div className="flex items-center">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-purple-400 to-indigo-600 flex items-center justify-center mr-2">
            <BrainCircuitIcon size={20} className="text-white" />
          </div>
          <div>
            <CardTitle>Virtual Assistant</CardTitle>
            <CardDescription>Get help with security questions</CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <ScrollArea className="h-[400px] px-4 pt-2">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={cn(
                "mb-4 flex flex-col max-w-[85%] rounded-lg p-3",
                message.role === 'user' 
                  ? "ml-auto bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                  : "mr-auto bg-muted/80"
              )}
            >
              <div className="text-sm">{message.content}</div>
              <div className={cn(
                "text-xs mt-1 self-end",
                message.role === 'user' ? "text-indigo-100" : "text-muted-foreground"
              )}>
                {formatTime(message.timestamp)}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </ScrollArea>
      </CardContent>
      
      <CardFooter className="flex flex-col space-y-2 pt-3">
        <div className="flex w-full items-center space-x-2">
          <Input
            ref={inputRef}
            placeholder="Ask about phishing or security..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={chatMutation.isPending}
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!input.trim() || chatMutation.isPending}
            variant="default"
            size="icon"
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
          >
            {chatMutation.isPending ? (
              <RefreshCwIcon size={18} className="animate-spin" />
            ) : (
              <SendIcon size={18} />
            )}
          </Button>
        </div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleClearChat}
          className="self-end text-xs"
        >
          Clear conversation
        </Button>
      </CardFooter>
    </Card>
  );
}