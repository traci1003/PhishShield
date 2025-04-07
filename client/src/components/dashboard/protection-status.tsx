import { useQuery, useMutation } from "@tanstack/react-query";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ProtectionSettings {
  smsProtection: boolean;
  emailProtection: boolean;
  socialMediaProtection: boolean;
  id?: number;
  userId?: number;
}

export default function ProtectionStatus() {
  const { data: settings, isLoading } = useQuery<ProtectionSettings>({
    queryKey: ['/api/protection-settings'],
  });

  const { toast } = useToast();

  const updateMutation = useMutation({
    mutationFn: async (updates: any) => {
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

  const handleToggleProtection = (key: string, value: boolean) => {
    updateMutation.mutate({ [key]: value });
  };

  return (
    <section className="mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Protection Status</h2>
      
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm divide-y">
          <ProtectionItem 
            icon="phone_android"
            title="SMS Protection"
            description="Scanning incoming messages"
            enabled={settings?.smsProtection}
            onChange={(value) => handleToggleProtection('smsProtection', value)}
            color="indigo"
          />
          
          <ProtectionItem 
            icon="email"
            title="Email Protection"
            description="Scanning messages and links"
            enabled={settings?.emailProtection}
            onChange={(value) => handleToggleProtection('emailProtection', value)}
            color="purple"
          />
          
          <ProtectionItem 
            icon="chat"
            title="Social Media Protection"
            description="Protection for common platforms"
            enabled={settings?.socialMediaProtection}
            onChange={(value) => handleToggleProtection('socialMediaProtection', value)}
            color="fuchsia"
          />
          
          <ProtectionItem
            icon="notifications"
            title="Push Notifications"
            description="Real-time phishing alerts"
            enabled={true} 
            onChange={(value) => {
              // In a real app, this would toggle notifications
              // For now we'll just show a toast
              if (!value) {
                toast({
                  title: "Notifications disabled",
                  description: "You won't receive real-time phishing alerts."
                });
              } else {
                toast({
                  title: "Notifications enabled",
                  description: "You'll receive real-time phishing alerts."
                });
              }
            }}
            color="rose"
          />
          
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center">
              <span className="material-icons text-primary-600 mr-3">privacy_tip</span>
              <div>
                <h3 className="font-medium text-gray-900">On-Device Scanning</h3>
                <p className="text-xs text-gray-500">Enhanced privacy (Premium)</p>
              </div>
            </div>
            <Button size="sm" className="rounded-full text-xs bg-primary-600 hover:bg-primary-700">
              Upgrade
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}

interface ProtectionItemProps {
  icon: string;
  title: string;
  description: string;
  enabled?: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  color?: 'indigo' | 'purple' | 'fuchsia' | 'rose';
}

function ProtectionItem({
  icon,
  title,
  description,
  enabled = false,
  onChange,
  disabled = false,
  color = 'indigo'
}: ProtectionItemProps) {
  const bgColors = {
    indigo: "bg-indigo-100",
    purple: "bg-purple-100",
    fuchsia: "bg-fuchsia-100",
    rose: "bg-rose-100"
  };
  
  const textColors = {
    indigo: "text-indigo-600",
    purple: "text-purple-600",
    fuchsia: "text-fuchsia-600",
    rose: "text-rose-600"
  };
  
  const borderColors = {
    indigo: "border-indigo-200",
    purple: "border-purple-200",
    fuchsia: "border-fuchsia-200",
    rose: "border-rose-200"
  };
  
  const rippleAnimation = enabled && !disabled ? 'animate-ripple' : '';
  
  return (
    <div className={`p-4 flex items-center justify-between transition-all duration-300 ${enabled && !disabled ? 'bg-gray-50' : ''} hover:bg-gray-50`}>
      <div className="flex items-center">
        <div className={`rounded-full ${bgColors[color]} p-2 mr-3 relative`}>
          <span className={`material-icons ${textColors[color]}`}>{icon}</span>
          {enabled && !disabled && (
            <span className={`absolute inset-0 rounded-full ${bgColors[color]} ${rippleAnimation}`}></span>
          )}
        </div>
        <div>
          <h3 className="font-medium text-gray-900 flex items-center">
            {title}
            {enabled && !disabled && (
              <span className={`ml-2 text-xs ${textColors[color]} bg-white px-1.5 py-0.5 rounded-full border ${borderColors[color]}`}>
                Active
              </span>
            )}
          </h3>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
      </div>
      <div className="flex items-center">
        {disabled && (
          <Button size="sm" variant="ghost" className="mr-2 px-2 py-0 h-6 text-xs rounded-full hover:bg-primary-50 hover:text-primary-600">
            Upgrade
          </Button>
        )}
        <Switch 
          checked={enabled} 
          onCheckedChange={onChange}
          disabled={disabled}
          className={`${disabled ? "opacity-50" : ""} ${enabled && !disabled ? textColors[color] : ""}`}
        />
      </div>
    </div>
  );
}
