import React, { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { 
  Bell, 
  AlertTriangle, 
  BadgeInfo, 
  Shield, 
  CircleAlert,
  MailWarning,
  MessageSquare,
  Smartphone
} from 'lucide-react';

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  icon: React.ReactNode;
}

export default function NotificationSettings() {
  const { toast } = useToast();

  // Notification settings state
  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      id: 'phishing_alerts',
      title: 'Phishing Alerts',
      description: 'Receive alerts when phishing attempts are detected',
      enabled: true,
      icon: <AlertTriangle className="h-5 w-5 text-red-500" />
    },
    {
      id: 'security_updates',
      title: 'Security Updates',
      description: 'Receive notifications about important security updates',
      enabled: true,
      icon: <Shield className="h-5 w-5 text-blue-500" />
    },
    {
      id: 'suspicious_content',
      title: 'Suspicious Content',
      description: 'Receive alerts for suspicious but not confirmed phishing content',
      enabled: true,
      icon: <CircleAlert className="h-5 w-5 text-amber-500" />
    },
    {
      id: 'tips_and_education',
      title: 'Security Tips',
      description: 'Receive educational tips about cybersecurity best practices',
      enabled: false,
      icon: <BadgeInfo className="h-5 w-5 text-indigo-500" />
    }
  ]);

  // Channel settings state
  const [channels, setChannels] = useState({
    push: true,
    email: false,
    sms: false
  });

  // Sensitivity level for notifications (1-5)
  const [sensitivity, setSensitivity] = useState(3);

  const handleToggleSetting = (id: string) => {
    setSettings(settings.map(setting => 
      setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
    ));

    toast({
      title: "Notification setting updated",
      description: "Your notification preferences have been saved.",
    });
  };

  const handleToggleChannel = (channel: keyof typeof channels) => {
    setChannels({
      ...channels,
      [channel]: !channels[channel]
    });

    toast({
      title: "Notification channel updated",
      description: `Notifications via ${channel} ${!channels[channel] ? 'enabled' : 'disabled'}.`,
    });
  };

  const handleSensitivityChange = (value: number[]) => {
    setSensitivity(value[0]);
    
    toast({
      title: "Sensitivity updated",
      description: `Notification sensitivity set to ${value[0]}.`,
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium mb-4">Notification Types</h3>
        <div className="space-y-4">
          {settings.map((setting) => (
            <div key={setting.id} className="flex items-start justify-between p-4 rounded-lg border hover:bg-accent/5 transition-colors">
              <div className="flex gap-3">
                <div className="mt-0.5">{setting.icon}</div>
                <div>
                  <Label className="font-medium" htmlFor={`setting-${setting.id}`}>
                    {setting.title}
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">{setting.description}</p>
                </div>
              </div>
              <Switch
                id={`setting-${setting.id}`}
                checked={setting.enabled}
                onCheckedChange={() => handleToggleSetting(setting.id)}
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Notification Channels</h3>
        <div className="space-y-4">
          <div className="flex items-start justify-between p-4 rounded-lg border hover:bg-accent/5 transition-colors">
            <div className="flex gap-3">
              <Bell className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <Label className="font-medium" htmlFor="channel-push">
                  Push Notifications
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Receive notifications on this device
                </p>
              </div>
            </div>
            <Switch
              id="channel-push"
              checked={channels.push}
              onCheckedChange={() => handleToggleChannel('push')}
            />
          </div>
          
          <div className="flex items-start justify-between p-4 rounded-lg border hover:bg-accent/5 transition-colors">
            <div className="flex gap-3">
              <MailWarning className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <Label className="font-medium" htmlFor="channel-email">
                  Email Notifications
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Receive notifications via email
                </p>
              </div>
            </div>
            <Switch
              id="channel-email"
              checked={channels.email}
              onCheckedChange={() => handleToggleChannel('email')}
            />
          </div>
          
          <div className="flex items-start justify-between p-4 rounded-lg border hover:bg-accent/5 transition-colors">
            <div className="flex gap-3">
              <Smartphone className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <Label className="font-medium" htmlFor="channel-sms">
                  SMS Notifications
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Receive critical alerts via SMS
                </p>
              </div>
            </div>
            <Switch
              id="channel-sms"
              checked={channels.sms}
              onCheckedChange={() => handleToggleChannel('sms')}
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Alert Sensitivity</h3>
        <div className="p-4 rounded-lg border space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <Label htmlFor="sensitivity-slider">Alert Threshold</Label>
              <span className="text-sm font-medium">
                {sensitivity === 1 ? 'Low' : 
                 sensitivity === 2 ? 'Medium-Low' : 
                 sensitivity === 3 ? 'Medium' : 
                 sensitivity === 4 ? 'Medium-High' : 
                 'High'}
              </span>
            </div>
            <Slider 
              id="sensitivity-slider"
              min={1}
              max={5}
              step={1}
              value={[sensitivity]}
              onValueChange={handleSensitivityChange}
              className="py-2"
            />
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Higher sensitivity means more alerts but may include false positives.
            Lower sensitivity means fewer alerts but might miss some threats.
          </p>
        </div>
      </div>
    </div>
  );
}