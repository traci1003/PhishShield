import React from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { ShieldAlert, ShieldCheck, Medal } from 'lucide-react';

interface ProtectionSettings {
  smsProtection: boolean;
  emailProtection: boolean;
  socialMediaProtection: boolean;
  onDeviceScanning: boolean;
  id?: number;
  userId?: number;
}

export default function ProtectionSettings() {
  const { data: settings, isLoading } = useQuery<ProtectionSettings>({
    queryKey: ['/api/protection-settings'],
  });

  const { toast } = useToast();

  const updateMutation = useMutation({
    mutationFn: async (updates: Partial<ProtectionSettings>) => {
      const response = await apiRequest('PATCH', '/api/protection-settings', updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/protection-settings'] });
      toast({
        title: "Settings updated",
        description: "Your protection settings have been updated.",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update settings.",
      });
    }
  });

  const handleToggle = (key: keyof ProtectionSettings, value: boolean) => {
    updateMutation.mutate({ [key]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Protection Settings</CardTitle>
        <CardDescription>
          Configure what PhishShield AI should protect
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : (
          <div className="space-y-6">
            <ProtectionItem
              title="SMS Protection"
              description="Scan text messages for phishing attempts and suspicious content"
              enabled={settings?.smsProtection}
              onChange={(value) => handleToggle('smsProtection', value)}
              icon={<ShieldCheck className="h-6 w-6 text-indigo-500" />}
            />
            
            <ProtectionItem
              title="Email Protection"
              description="Scan emails for phishing attempts, suspicious links, and malicious content"
              enabled={settings?.emailProtection}
              onChange={(value) => handleToggle('emailProtection', value)}
              icon={<ShieldCheck className="h-6 w-6 text-purple-500" />}
            />
            
            <ProtectionItem
              title="Social Media Protection"
              description="Scan social media messages and posts for phishing attempts"
              enabled={settings?.socialMediaProtection}
              onChange={(value) => handleToggle('socialMediaProtection', value)}
              icon={<ShieldCheck className="h-6 w-6 text-fuchsia-500" />}
              premium
            />
            
            <ProtectionItem
              title="On-Device Scanning"
              description="Scan content on your device without sending data to our servers"
              enabled={settings?.onDeviceScanning}
              onChange={(value) => handleToggle('onDeviceScanning', value)}
              icon={<ShieldAlert className="h-6 w-6 text-rose-500" />}
              premium
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface ProtectionItemProps {
  title: string;
  description: string;
  enabled?: boolean;
  onChange: (value: boolean) => void;
  icon: React.ReactNode;
  premium?: boolean;
}

function ProtectionItem({ title, description, enabled, onChange, icon, premium }: ProtectionItemProps) {
  return (
    <div className="flex items-start justify-between p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
      <div className="flex gap-4">
        <div className="mt-0.5">{icon}</div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-medium">{title}</h3>
            {premium && (
              <Badge className="bg-gradient-to-r from-amber-500 to-yellow-300 text-black font-semibold">
                <Medal className="h-3 w-3 mr-1" /> Premium
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
      </div>
      <Switch 
        checked={enabled} 
        onCheckedChange={onChange}
        disabled={premium && false} // TODO: Check if user has premium subscription
      />
    </div>
  );
}